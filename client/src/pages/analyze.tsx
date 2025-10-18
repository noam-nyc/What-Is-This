import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Camera, Upload, Link2, AlertTriangle, Phone, Coins, CreditCard, Save, Check, Globe } from "lucide-react";
import type { User } from "@shared/schema";

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
  { code: "zh", name: "中文" },
  { code: "ar", name: "العربية" },
  { code: "fr", name: "Français" },
  { code: "de", name: "Deutsch" },
  { code: "hi", name: "हिन्दी" },
  { code: "pt", name: "Português" },
];

interface AnalysisResult {
  emergency?: {
    detected: boolean;
    type?: string;
    severity?: string;
    message?: string;
  };
  contentType?: string;
  explanation?: string;
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

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlSubmit = () => {
    if (imageUrl) {
      setImagePreview(imageUrl);
    }
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
      const response = await apiRequest("POST", "/api/analyze", {
        imageData: imagePreview,
        language: selectedLanguage,
      });

      const data = await response.json();
      setResult(data);

      if (data.emergency?.detected) {
        toast({
          variant: "destructive",
          title: "Emergency Detected!",
          description: data.emergency.message,
        });
      }
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
        imageUrl: imagePreview,
        analysis: JSON.stringify(result),
        language: selectedLanguage,
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
            {/* Emergency Alert */}
            {result.emergency?.detected && (
              <Alert className="border-destructive bg-destructive/10">
                <AlertTriangle className="w-6 h-6 text-destructive" />
                <div className="ml-3 flex-1">
                  <AlertDescription className="text-lg font-semibold mb-3">
                    {result.emergency.message}
                  </AlertDescription>
                  <Button
                    variant="destructive"
                    className="h-14 text-xl w-full sm:w-auto"
                    asChild
                    data-testid="button-emergency"
                  >
                    <a href="tel:911">
                      <Phone className="w-5 h-5 mr-2" />
                      Call Emergency Services (911)
                    </a>
                  </Button>
                </div>
              </Alert>
            )}

            {/* Explanation */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <h3 className="text-2xl font-semibold">Explanation</h3>
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
