import { useState } from "react";
import { Camera, ArrowLeft } from "lucide-react";
import LanguageSelector from "@/components/LanguageSelector";
import TextSizeControl from "@/components/TextSizeControl";
import CameraCapture from "@/components/CameraCapture";
import PhotoUpload from "@/components/PhotoUpload";
import ExplanationDisplay from "@/components/ExplanationDisplay";
import LoadingState from "@/components/LoadingState";
import { Button } from "@/components/ui/button";

type ViewMode = "capture" | "upload" | "loading" | "results";

export default function Home() {
  const [viewMode, setViewMode] = useState<ViewMode>("capture");
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [textSize, setTextSize] = useState<"small" | "medium" | "large">("medium");
  const [capturedPhoto, setCapturedPhoto] = useState<string>("");
  const [isSpeaking, setIsSpeaking] = useState(false);

  // TODO: remove mock functionality - replace with real API call
  const mockExplanation = {
    productName: "Smart Water Bottle",
    sections: [
      {
        title: "What is this?",
        content: "This is a smart water bottle. It helps you remember to drink water throughout the day. The bottle has lights that glow to remind you.",
        icon: "info" as const,
      },
      {
        title: "How to use",
        content: "Fill the bottle with clean water. Twist the cap to close it tightly. The lights will blink every hour to remind you to drink. Press the button on the side to see how much water you drank today.",
        icon: "wrench" as const,
      },
      {
        title: "Care instructions",
        content: "Wash the bottle with warm soapy water every day. Do not put in dishwasher. Charge the battery using the USB cable once a week. Keep the charging port dry.",
        icon: "wrench" as const,
      },
      {
        title: "Safety warnings",
        content: "Only use cold or room temperature water. Never use hot liquids. Do not drop or throw the bottle. Keep away from fire or heat. If the lights stop working, stop using and contact support.",
        icon: "warning" as const,
      },
    ],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Water_bottle",
    manufacturerUrl: "https://example.com/smartbottle",
    price: {
      amount: "34.99",
      currency: "$",
      range: "Typical price: $30-40",
    },
    purchaseLinks: [
      { name: "Amazon", url: "https://amazon.com/smart-water-bottle", type: "online" as const },
      { name: "Best Buy", url: "https://bestbuy.com/smart-bottles", type: "online" as const },
      { name: "Walmart", url: "https://walmart.com/store-finder", type: "nearby" as const },
      { name: "Target", url: "https://target.com/store-locator", type: "nearby" as const },
    ],
  };

  const handlePhotoCapture = (imageData: string) => {
    setCapturedPhoto(imageData);
    setViewMode("loading");
    // TODO: remove mock functionality - make real API call here
    setTimeout(() => {
      setViewMode("results");
    }, 2000);
  };

  const handleTextToSpeech = () => {
    // TODO: remove mock functionality - implement real text-to-speech
    setIsSpeaking(!isSpeaking);
    console.log("Text to speech:", isSpeaking ? "stopped" : "started");
    
    if (!isSpeaking) {
      setTimeout(() => setIsSpeaking(false), 3000);
    }
  };

  const handleStartOver = () => {
    setViewMode("capture");
    setCapturedPhoto("");
    setIsSpeaking(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background border-b border-border shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            {viewMode === "results" ? (
              <Button
                size="lg"
                variant="outline"
                onClick={handleStartOver}
                className="min-h-14"
                data-testid="button-back"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                <span className="text-lg font-semibold">New Photo</span>
              </Button>
            ) : (
              <div className="flex items-center gap-3">
                <Camera className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold">Xplain This</h1>
              </div>
            )}

            {viewMode === "results" && (
              <TextSizeControl size={textSize} onSizeChange={setTextSize} />
            )}

            {viewMode !== "results" && (
              <div className="w-64">
                <LanguageSelector
                  selectedLanguage={selectedLanguage}
                  onLanguageChange={setSelectedLanguage}
                />
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {viewMode === "capture" && (
          <div className="space-y-6">
            <div className="text-center space-y-2 mb-8">
              <h2 className="text-3xl font-bold">Take a Photo</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Point your camera at any product to learn about it in simple language
              </p>
            </div>
            <CameraCapture
              onCapture={handlePhotoCapture}
              onUploadClick={() => setViewMode("upload")}
            />
          </div>
        )}

        {viewMode === "upload" && (
          <div className="space-y-6">
            <Button
              variant="ghost"
              size="lg"
              onClick={() => setViewMode("capture")}
              className="min-h-14"
              data-testid="button-back-to-camera"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              <span className="text-lg">Back to Camera</span>
            </Button>
            <div className="text-center space-y-2 mb-8">
              <h2 className="text-3xl font-bold">Upload a Photo</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Choose a photo from your device to get started
              </p>
            </div>
            <PhotoUpload onPhotoSelect={handlePhotoCapture} />
          </div>
        )}

        {viewMode === "loading" && (
          <LoadingState message="Reading your photo..." />
        )}

        {viewMode === "results" && (
          <ExplanationDisplay
            photo={capturedPhoto}
            productName={mockExplanation.productName}
            sections={mockExplanation.sections}
            textSize={textSize}
            onTextToSpeech={handleTextToSpeech}
            isSpeaking={isSpeaking}
            wikipediaUrl={mockExplanation.wikipediaUrl}
            manufacturerUrl={mockExplanation.manufacturerUrl}
            price={mockExplanation.price}
            purchaseLinks={mockExplanation.purchaseLinks}
          />
        )}
      </main>
    </div>
  );
}
