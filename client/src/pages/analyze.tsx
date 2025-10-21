import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Camera, Upload, Link2, AlertTriangle, Phone, Coins, CreditCard, Save, Check, Globe, HelpCircle, MapPin, MessageCircle, BookOpen, Sparkles, Shield, Wrench, ShoppingCart, TrendingUp } from "lucide-react";
import type { User } from "@shared/schema";
import DailyUsageIndicator from "@/components/DailyUsageIndicator";
import IntentSelector from "@/components/IntentSelector";
import type { AnalysisIntent } from "@shared/schema";

// Intent labels and icons
const INTENT_INFO: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  what_is_this: { label: "What is this?", icon: HelpCircle, color: "bg-blue-500/10 text-blue-700 border-blue-200" },
  where_from: { label: "Where is it from?", icon: MapPin, color: "bg-indigo-500/10 text-indigo-700 border-indigo-200" },
  general_info: { label: "General Info", icon: MessageCircle, color: "bg-slate-500/10 text-slate-700 border-slate-200" },
  how_to_use: { label: "How to use it", icon: BookOpen, color: "bg-green-500/10 text-green-700 border-green-200" },
  how_to_care: { label: "How to care for it", icon: Sparkles, color: "bg-purple-500/10 text-purple-700 border-purple-200" },
  is_safe: { label: "Is it safe?", icon: Shield, color: "bg-red-500/10 text-red-700 border-red-200" },
  how_to_fix: { label: "How to fix it", icon: Wrench, color: "bg-orange-500/10 text-orange-700 border-orange-200" },
  where_to_buy: { label: "Where to buy one", icon: ShoppingCart, color: "bg-pink-500/10 text-pink-700 border-pink-200" },
};

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
  { code: "zh", name: "中文" },
  { code: "fr", name: "Français" },
  { code: "de", name: "Deutsch" },
  { code: "it", name: "Italiano" },
  { code: "pt", name: "Português" },
  { code: "ru", name: "Русский" },
  { code: "he", name: "עברית" },
  { code: "ja", name: "日本語" },
  { code: "ko", name: "한국어" },
];

interface AnalysisResult {
  contentType?: string;
  explanation?: string;
  confidence?: number;
  product?: {
    name: string;
    description: string;
    wikiLink?: string;
  };
  recipe?: {
    name: string;
    ingredients: string[];
    instructions: string[];
  };
  document?: {
    summary: string;
    keyPoints: string[];
  };
  tokensUsed?: number;
  costInTokens?: number;
  language?: string;
}

export default function Analyze() {
  const { toast } = useToast();
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [selectedIntent, setSelectedIntent] = useState<AnalysisIntent>("what_is_this");
  const [inputMethod, setInputMethod] = useState<"camera" | "upload" | "url">("upload");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const { data: user } = useQuery<User>({
    queryKey: ["/api/auth/user"],
  });
  const { data: tokenBalance } = useQuery<{ balance: number }>({
    queryKey: ["/api/tokens/balance"],
  });
  const { data: subscription } = useQuery<{ isPremium: boolean }>({
    queryKey: ["/api/subscription/check-premium"],
  });
  const { data: dailyUsage } = useQuery<{
    currentCount: number;
    dailyLimit: number;
    subscriptionTier: string;
    resetsAt: string;
  }>({
    queryKey: ["/api/usage/daily"],
  });

  const validateImageQuality = async (file: File, dataUrl: string): Promise<{ valid: boolean; error?: string }> => {
    // Check file size (max 10MB)
    const maxSizeMB = 10;
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return { valid: false, error: `Image too large. Maximum size is ${maxSizeMB}MB` };
    }

    // Check minimum file size (too small = likely corrupted)
    const minSizeBytes = 1024; // 1KB
    if (file.size < minSizeBytes) {
      return { valid: false, error: "Image file is too small or corrupted" };
    }

    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          resolve({ valid: false, error: "Unable to process image" });
          return;
        }

        // Check minimum resolution
        const minWidth = 640;
        const minHeight = 480;
        if (img.width < minWidth || img.height < minHeight) {
          resolve({ valid: false, error: `Image too small. Minimum size is ${minWidth}x${minHeight} pixels` });
          return;
        }

        // Resize for quality checks (use smaller size for performance)
        const maxDim = 800;
        let width = img.width;
        let height = img.height;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = (height * maxDim) / width;
            width = maxDim;
          } else {
            width = (width * maxDim) / height;
            height = maxDim;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        
        const imageData = ctx.getImageData(0, 0, width, height);
        const pixels = imageData.data;
        
        // Check brightness (detect very dark images)
        let totalBrightness = 0;
        for (let i = 0; i < pixels.length; i += 4) {
          const r = pixels[i];
          const g = pixels[i + 1];
          const b = pixels[i + 2];
          totalBrightness += (r + g + b) / 3;
        }
        const avgBrightness = totalBrightness / (pixels.length / 4);
        
        if (avgBrightness < 20) {
          resolve({ valid: false, error: "Image is too dark. Please use better lighting" });
          return;
        }

        // Check for blur using edge detection (Laplacian variance)
        const gray: number[] = [];
        for (let i = 0; i < pixels.length; i += 4) {
          const r = pixels[i];
          const g = pixels[i + 1];
          const b = pixels[i + 2];
          gray.push((r + g + b) / 3);
        }

        let variance = 0;
        const laplacianKernel = [0, -1, 0, -1, 4, -1, 0, -1, 0];
        const w = width;
        const h = height;

        for (let y = 1; y < h - 1; y++) {
          for (let x = 1; x < w - 1; x++) {
            let sum = 0;
            for (let ky = -1; ky <= 1; ky++) {
              for (let kx = -1; kx <= 1; kx++) {
                const idx = (y + ky) * w + (x + kx);
                const kernelIdx = (ky + 1) * 3 + (kx + 1);
                sum += gray[idx] * laplacianKernel[kernelIdx];
              }
            }
            variance += sum * sum;
          }
        }
        
        variance = variance / ((w - 2) * (h - 2));
        
        // Blur threshold (lower = more blurry)
        const blurThreshold = 100;
        if (variance < blurThreshold) {
          resolve({ valid: false, error: "Image appears blurry. Please use a clearer photo" });
          return;
        }

        resolve({ valid: true });
      };

      img.onerror = () => {
        resolve({ valid: false, error: "Unable to load image. File may be corrupted" });
      };

      img.src = dataUrl;
    });
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const dataUrl = reader.result as string;
        
        // Validate image quality
        const validation = await validateImageQuality(file, dataUrl);
        
        if (!validation.valid) {
          toast({
            variant: "destructive",
            title: "Image Quality Issue",
            description: validation.error || "Please try a different image",
          });
          // Reset file input
          e.target.value = '';
          return;
        }

        setSelectedImage(file);
        setImagePreview(dataUrl);
        
        toast({
          title: "Image loaded",
          description: "Image quality looks good! Ready to analyze.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlSubmit = async () => {
    if (!imageUrl) return;

    // For URL images, we can't validate quality before loading
    // But we set preview so user can see it
    setImagePreview(imageUrl);
    
    toast({
      title: "URL loaded",
      description: "Image loaded from URL. Quality will be checked during analysis.",
    });
  };

  // Optimize image for OpenAI API - resize and compress to reduce costs
  const optimizeImageForAPI = async (dataUrl: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error("Unable to process image"));
          return;
        }

        // Resize to max 1024px (ideal for AI analysis, reduces costs)
        const maxDim = 1024;
        let width = img.width;
        let height = img.height;
        
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw image with high quality
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to JPEG with 85% quality for optimal compression
        const optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
        resolve(optimizedDataUrl);
      };

      img.onerror = () => {
        reject(new Error("Unable to load image for optimization"));
      };

      img.src = dataUrl;
    });
  };

  const handleAnalyze = async () => {
    if (!imagePreview) {
      toast({
        variant: "destructive",
        title: "No image selected",
        description: "Please select an image to analyze",
      });
      return;
    }

    setAnalyzing(true);
    setResult(null);

    try {
      // Determine if it's a URL or base64 data
      const isUrl = imagePreview.startsWith("http://") || imagePreview.startsWith("https://");
      const payload: any = {
        language: selectedLanguage,
        intent: selectedIntent,
      };

      if (isUrl) {
        payload.imageUrl = imagePreview;
      } else {
        // Optimize base64 image before sending to OpenAI (resize to 1024px, compress to JPEG 85%)
        // This reduces costs by 80-90% while maintaining analysis quality
        const optimizedImage = await optimizeImageForAPI(imagePreview);
        payload.imageBase64 = optimizedImage;
      }

      const response = await apiRequest("POST", "/api/analyze", payload);

      const data = await response.json();
      setResult(data);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Analysis failed",
        description: error.message || "Please try again",
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSaveAnswer = async () => {
    if (!result || !subscription?.isPremium) return;

    try {
      await apiRequest("POST", "/api/saved-answers", {
        title: `Analysis (${selectedIntent})`,
        preview: result.explanation?.substring(0, 100),
        type: result.contentType || "general",
        data: JSON.stringify(result),
        imageUrl: imagePreview,
        analysisIntent: selectedIntent,
      });

      toast({
        title: "Answer saved!",
        description: "You can view it in your saved answers",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to save",
        description: error.message,
      });
    }
  };

  const freeAnswersRemaining = user?.freeAnswersRemaining ?? 0;
  const hasTokens = (tokenBalance?.balance ?? 0) > 0;
  const isPremium = subscription?.isPremium ?? false;
  const canAnalyze = freeAnswersRemaining > 0 || hasTokens || isPremium;

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Analyze Image</h1>
            <p className="text-lg text-muted-foreground mt-1">
              Get instant explanations in any language
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="outline" className="text-base px-4 py-2" data-testid="badge-free-answers">
              {freeAnswersRemaining} free left
            </Badge>
            <Badge variant="outline" className="text-base px-4 py-2" data-testid="badge-token-balance">
              <Coins className="w-4 h-4 mr-2" />
              {tokenBalance?.balance ?? 0} tokens
            </Badge>
            {isPremium && (
              <Badge className="text-base px-4 py-2" data-testid="badge-premium">
                <CreditCard className="w-4 h-4 mr-2" />
                Premium
              </Badge>
            )}
          </div>
        </div>

        {/* Daily Usage Indicator */}
        {dailyUsage && (
          <DailyUsageIndicator
            currentCount={dailyUsage.currentCount}
            dailyLimit={dailyUsage.dailyLimit}
            subscriptionTier={dailyUsage.subscriptionTier}
            resetsAt={dailyUsage.resetsAt}
          />
        )}

        {/* Language Selector */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <Globe className="w-5 h-5 text-primary" />
              <h3 className="text-xl font-semibold">Language</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {LANGUAGES.map((lang) => (
                <Button
                  key={lang.code}
                  variant={selectedLanguage === lang.code ? "default" : "outline"}
                  className="h-14 text-lg"
                  onClick={() => setSelectedLanguage(lang.code)}
                  data-testid={`button-language-${lang.code}`}
                >
                  {lang.name}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Input Methods */}
        <Card>
          <CardContent className="p-6">
            <Tabs value={inputMethod} onValueChange={(v) => setInputMethod(v as any)}>
              <TabsList className="grid w-full grid-cols-3 h-auto">
                <TabsTrigger value="upload" className="h-14 text-lg" data-testid="tab-upload">
                  <Upload className="w-5 h-5 mr-2" />
                  Upload
                </TabsTrigger>
                <TabsTrigger value="camera" className="h-14 text-lg" data-testid="tab-camera">
                  <Camera className="w-5 h-5 mr-2" />
                  Camera
                </TabsTrigger>
                <TabsTrigger value="url" className="h-14 text-lg" data-testid="tab-url">
                  <Link2 className="w-5 h-5 mr-2" />
                  URL
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upload" className="space-y-4 mt-6">
                <label htmlFor="file-upload">
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageSelect}
                    data-testid="input-file"
                  />
                  <Button
                    asChild
                    variant="outline"
                    className="w-full h-20 text-lg cursor-pointer"
                  >
                    <span>
                      <Upload className="w-6 h-6 mr-3" />
                      Choose Image from Device
                    </span>
                  </Button>
                </label>
              </TabsContent>

              <TabsContent value="camera" className="space-y-4 mt-6">
                <Alert>
                  <Camera className="w-5 h-5" />
                  <AlertDescription className="text-base ml-2">
                    Camera capture will be available in the mobile app. For now, please upload an image.
                  </AlertDescription>
                </Alert>
              </TabsContent>

              <TabsContent value="url" className="space-y-4 mt-6">
                <div className="flex gap-3">
                  <input
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="flex-1 h-14 px-4 text-lg rounded-md border bg-background"
                    data-testid="input-url"
                  />
                  <Button
                    onClick={handleUrlSubmit}
                    className="h-14 text-lg"
                    data-testid="button-load-url"
                  >
                    Load
                  </Button>
                </div>
              </TabsContent>
            </Tabs>

            {imagePreview && (
              <div className="mt-6">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full max-h-64 object-contain rounded-lg border"
                  data-testid="img-preview"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Intent Selector - What do you want to know? */}
        {imagePreview && (
          <Card>
            <CardContent className="p-6">
              <IntentSelector
                selectedIntent={selectedIntent}
                onIntentChange={setSelectedIntent}
                isPremium={subscription?.isPremium ?? false}
              />
            </CardContent>
          </Card>
        )}

        {/* Analyze Button */}
        {imagePreview && (
          <Card>
            <CardContent className="p-6">
              {!canAnalyze ? (
                <Alert className="border-warning/50 bg-warning/10">
                  <AlertTriangle className="w-5 h-5 text-warning" />
                  <AlertDescription className="text-base ml-2">
                    You've used all your free answers. Purchase tokens or subscribe to continue.
                  </AlertDescription>
                </Alert>
              ) : (
                <Button
                  onClick={handleAnalyze}
                  disabled={analyzing}
                  className="w-full h-16 text-xl"
                  data-testid="button-analyze"
                >
                  {analyzing ? "Analyzing..." : "Analyze Image"}
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {analyzing && (
          <Card>
            <CardContent className="p-8 space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-2/3" />
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-4">

            {/* Explanation */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="text-2xl font-semibold">Explanation</h3>
                    {INTENT_INFO[selectedIntent] && (() => {
                      const IntentIcon = INTENT_INFO[selectedIntent].icon;
                      return (
                        <Badge variant="outline" className={`text-sm ${INTENT_INFO[selectedIntent].color}`} data-testid="badge-intent">
                          <IntentIcon className="h-4 w-4 mr-1" />
                          {INTENT_INFO[selectedIntent].label}
                        </Badge>
                      );
                    })()}
                  </div>
                  {isPremium && (
                    <Button
                      variant="outline"
                      onClick={handleSaveAnswer}
                      className="h-12 text-lg"
                      data-testid="button-save-answer"
                    >
                      <Save className="w-5 h-5 mr-2" />
                      Save Answer
                    </Button>
                  )}
                </div>
                <p className="text-lg leading-relaxed" data-testid="text-explanation">
                  {result.explanation}
                </p>

                {/* Confidence Score */}
                {result.confidence !== undefined && (
                  <div className="border-t pt-4 mt-4">
                    <div className="flex items-center gap-3 mb-3">
                      <TrendingUp className="w-5 h-5 text-muted-foreground" />
                      <h4 className="font-semibold text-lg">Confidence</h4>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-base font-medium" data-testid="text-confidence-value">
                          {result.confidence}% confident
                        </span>
                        <Badge 
                          variant={result.confidence >= 80 ? "default" : result.confidence >= 60 ? "secondary" : "destructive"}
                          data-testid="badge-confidence-level"
                        >
                          {result.confidence >= 80 ? "Very Confident" : result.confidence >= 60 ? "Fairly Confident" : "Uncertain"}
                        </Badge>
                      </div>
                      <Progress 
                        value={result.confidence} 
                        className={`h-3 ${
                          result.confidence >= 80 ? "bg-green-200 dark:bg-green-900 [&>div]:bg-green-600" : 
                          result.confidence >= 60 ? "bg-yellow-200 dark:bg-yellow-900 [&>div]:bg-yellow-600" : 
                          "bg-red-200 dark:bg-red-900 [&>div]:bg-red-600"
                        }`}
                        data-testid="progress-confidence"
                      />
                      <p className="text-sm text-muted-foreground">
                        {result.confidence >= 80 
                          ? "The AI is very confident about this answer." 
                          : result.confidence >= 60 
                          ? "The AI is fairly confident, but there may be some uncertainty."
                          : "The AI is uncertain about this answer. Please verify independently."}
                      </p>
                    </div>
                  </div>
                )}

                {result.product && (
                  <div className="border-t pt-4 mt-4">
                    <h4 className="font-semibold text-xl mb-2">Product Information</h4>
                    <p className="text-lg font-medium">{result.product.name}</p>
                    <p className="text-muted-foreground mt-2">{result.product.description}</p>
                    {result.product.wikiLink && (
                      <a
                        href={result.product.wikiLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-lg text-primary hover:underline inline-block mt-2"
                        data-testid="link-wikipedia"
                      >
                        Learn more on Wikipedia →
                      </a>
                    )}
                  </div>
                )}

                {result.recipe && (
                  <div className="border-t pt-4 mt-4">
                    <h4 className="font-semibold text-xl mb-2">Recipe: {result.recipe.name}</h4>
                    <div className="space-y-3">
                      <div>
                        <h5 className="font-medium text-lg mb-2">Ingredients:</h5>
                        <ul className="list-disc pl-6 space-y-1">
                          {result.recipe.ingredients.map((ingredient, i) => (
                            <li key={i} className="text-lg">{ingredient}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium text-lg mb-2">Instructions:</h5>
                        <ol className="list-decimal pl-6 space-y-1">
                          {result.recipe.instructions.map((instruction, i) => (
                            <li key={i} className="text-lg">{instruction}</li>
                          ))}
                        </ol>
                      </div>
                    </div>
                  </div>
                )}

                {result.document && (
                  <div className="border-t pt-4 mt-4">
                    <h4 className="font-semibold text-xl mb-2">Document Summary</h4>
                    <p className="text-lg mb-3">{result.document.summary}</p>
                    <h5 className="font-medium text-lg mb-2">Key Points:</h5>
                    <ul className="list-disc pl-6 space-y-1">
                      {result.document.keyPoints.map((point, i) => (
                        <li key={i} className="text-lg">{point}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.tokensUsed && (
                  <div className="border-t pt-4 mt-4 flex items-center gap-2 text-muted-foreground">
                    <Coins className="w-5 h-5" />
                    <span className="text-base">
                      {result.costInTokens ? `${result.costInTokens} tokens used` : `${result.tokensUsed} tokens processed`}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
