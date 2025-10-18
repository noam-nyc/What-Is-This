import { useState, useEffect } from "react";
import { Camera, ArrowLeft, History } from "lucide-react";
import TermsAndConditions from "@/components/TermsAndConditions";
import AgeVerification from "@/components/AgeVerification";
import LanguageSelector from "@/components/LanguageSelector";
import TextSizeControl from "@/components/TextSizeControl";
import TokenBalance from "@/components/TokenBalance";
import TokenPurchase from "@/components/TokenPurchase";
import TokenCostPreview from "@/components/TokenCostPreview";
import SubscriptionBanner from "@/components/SubscriptionBanner";
import SubscriptionPurchase from "@/components/SubscriptionPurchase";
import SavedAnswers from "@/components/SavedAnswers";
import InputMethodSelector from "@/components/InputMethodSelector";
import CameraCapture from "@/components/CameraCapture";
import PhotoUpload from "@/components/PhotoUpload";
import UrlInput from "@/components/UrlInput";
import ExplanationDisplay from "@/components/ExplanationDisplay";
import DocumentDisplay from "@/components/DocumentDisplay";
import RecipeDisplay from "@/components/RecipeDisplay";
import QuestionAnswer from "@/components/QuestionAnswer";
import ContentWarning from "@/components/ContentWarning";
import ContentBlocked from "@/components/ContentBlocked";
import LoadingState from "@/components/LoadingState";
import { Button } from "@/components/ui/button";

type ViewMode = "start" | "capture" | "upload" | "url" | "cost-preview" | "loading" | "warning" | "blocked" | "results";
type ContentType = "product" | "document" | "food";
type WarningType = "violence" | "self-harm" | "drugs" | "offensive" | "general";

interface SavedAnswer {
  id: string;
  type: ContentType;
  title: string;
  date: string;
  preview: string;
  data: any;
}

export default function Home() {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [ageVerified, setAgeVerified] = useState(false);
  const [isAdult, setIsAdult] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("start");
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [textSize, setTextSize] = useState<"small" | "medium" | "large">("medium");
  const [capturedPhoto, setCapturedPhoto] = useState<string>("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [contentType, setContentType] = useState<ContentType>("product");
  const [messages, setMessages] = useState<Array<{ id: string; text: string; sender: "user" | "assistant" }>>([]);
  const [warningType, setWarningType] = useState<WarningType>("general");
  const [tokenBalance, setTokenBalance] = useState(0);
  const [freeAnswersRemaining, setFreeAnswersRemaining] = useState(3);
  const [showTokenPurchase, setShowTokenPurchase] = useState(false);
  const [estimatedTokenCost, setEstimatedTokenCost] = useState(0);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const [isPremiumSubscriber, setIsPremiumSubscriber] = useState(false);
  const [showSubscriptionPurchase, setShowSubscriptionPurchase] = useState(false);
  const [showSavedAnswers, setShowSavedAnswers] = useState(false);
  const [savedAnswers, setSavedAnswers] = useState<SavedAnswer[]>([]);

  // Load user data from localStorage
  useEffect(() => {
    const savedTermsStatus = localStorage.getItem("xplain_terms_accepted");
    const savedAgeStatus = localStorage.getItem("xplain_age_verified");
    const savedIsAdult = localStorage.getItem("xplain_is_adult");
    const savedTokens = localStorage.getItem("xplain_tokens");
    const savedFreeAnswers = localStorage.getItem("xplain_free_answers");
    const savedLastReset = localStorage.getItem("xplain_last_reset");
    const savedPremiumStatus = localStorage.getItem("xplain_premium_subscriber");
    const savedAnswersData = localStorage.getItem("xplain_saved_answers");
    
    if (savedTermsStatus === "true") {
      setTermsAccepted(true);
    }
    
    if (savedAgeStatus === "true" && savedIsAdult) {
      setAgeVerified(true);
      setIsAdult(savedIsAdult === "true");
    }

    if (savedTokens) {
      setTokenBalance(parseInt(savedTokens));
    }

    if (savedPremiumStatus === "true") {
      setIsPremiumSubscriber(true);
    }

    if (savedAnswersData && savedPremiumStatus === "true") {
      try {
        setSavedAnswers(JSON.parse(savedAnswersData));
      } catch (e) {
        console.error("Failed to load saved answers");
      }
    }

    // Reset free answers monthly
    const now = new Date();
    const lastReset = savedLastReset ? new Date(savedLastReset) : null;
    const shouldReset = !lastReset || 
      lastReset.getMonth() !== now.getMonth() || 
      lastReset.getFullYear() !== now.getFullYear();

    if (shouldReset) {
      setFreeAnswersRemaining(3);
      localStorage.setItem("xplain_free_answers", "3");
      localStorage.setItem("xplain_last_reset", now.toISOString());
    } else if (savedFreeAnswers) {
      setFreeAnswersRemaining(parseInt(savedFreeAnswers));
    }
  }, []);

  const handleTermsAccepted = () => {
    setTermsAccepted(true);
    localStorage.setItem("xplain_terms_accepted", "true");
  };

  const handleAgeVerified = (adult: boolean) => {
    setAgeVerified(true);
    setIsAdult(adult);
    localStorage.setItem("xplain_age_verified", "true");
    localStorage.setItem("xplain_is_adult", String(adult));
  };

  // TODO: remove mock functionality - replace with real API call
  const mockProductData = {
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

  // TODO: remove mock functionality - replace with real API call
  const mockDocumentData = {
    title: "Medical Insurance Form",
    summary: "This is a form to renew your health insurance. You need to fill in your personal information like name, address, and date of birth. Then sign at the bottom and send it back to the insurance company before the deadline.",
    followUpActions: [
      { action: "Fill in all the blank spaces with your information", priority: "high" as const },
      { action: "Sign your name at the bottom of the form", priority: "high" as const },
      { action: "Mail the form back by next Friday", priority: "high" as const },
      { action: "Keep a copy for your records", priority: "low" as const },
    ],
  };

  // TODO: remove mock functionality - replace with real API call
  const mockFoodData = {
    foodName: "Fresh Tomatoes",
    recipes: [
      {
        name: "Simple Tomato Salad",
        prepTime: "10 minutes",
        servings: "2 people",
        ingredients: [
          "3 large tomatoes",
          "1 tablespoon olive oil",
          "Salt and pepper",
          "Fresh basil leaves",
        ],
        instructions: [
          "Wash the tomatoes and cut them into slices.",
          "Put the slices on a plate.",
          "Drizzle olive oil over the tomatoes.",
          "Sprinkle salt and pepper on top.",
          "Add fresh basil leaves.",
          "Serve fresh and enjoy!",
        ],
        tips: [
          "Use ripe tomatoes for best flavor.",
          "You can add mozzarella cheese if you like.",
        ],
      },
      {
        name: "Easy Tomato Sauce",
        prepTime: "30 minutes",
        servings: "4 people",
        ingredients: [
          "6 large tomatoes",
          "2 tablespoons olive oil",
          "2 cloves garlic",
          "Salt and pepper",
          "Pinch of sugar (optional)",
        ],
        instructions: [
          "Wash and chop the tomatoes into small pieces.",
          "Peel and chop the garlic.",
          "Heat olive oil in a pan.",
          "Add garlic and cook for 1 minute until it smells good.",
          "Add the chopped tomatoes.",
          "Cook on low heat for 20 minutes, stirring sometimes.",
          "Add salt, pepper, and a pinch of sugar if needed.",
          "Use on pasta, pizza, or bread.",
        ],
        tips: [
          "The sauce gets better the longer you cook it.",
          "You can freeze extra sauce for later use.",
        ],
      },
    ],
  };

  const calculateTokenCost = (type: ContentType): number => {
    // TODO: remove mock functionality - calculate based on actual OpenAI tokens with 100% markup
    // Base estimates (OpenAI tokens * 2 for 100% markup)
    const baseCosts = {
      product: 200,  // ~100 OpenAI tokens * 2
      document: 300, // ~150 OpenAI tokens * 2
      food: 250,     // ~125 OpenAI tokens * 2
    };
    return baseCosts[type];
  };

  const handlePhotoCapture = (imageData: string) => {
    setCapturedPhoto(imageData);
    
    // Randomly decide content type for demo purposes
    const contentTypes: ContentType[] = ["product", "document", "food"];
    const randomType = contentTypes[Math.floor(Math.random() * contentTypes.length)];
    setContentType(randomType);
    
    // Calculate token cost
    const cost = calculateTokenCost(randomType);
    setEstimatedTokenCost(cost);
    
    // Store the action to execute after token confirmation
    setPendingAction(() => () => processAnalysis(imageData, randomType));
    
    // Show cost preview
    setViewMode("cost-preview");
  };

  const processAnalysis = (imageData: string, type: ContentType) => {
    setViewMode("loading");
    
    // Deduct tokens or free answer
    if (freeAnswersRemaining > 0) {
      const newFreeAnswers = freeAnswersRemaining - 1;
      setFreeAnswersRemaining(newFreeAnswers);
      localStorage.setItem("xplain_free_answers", String(newFreeAnswers));
    } else {
      const newBalance = tokenBalance - estimatedTokenCost;
      setTokenBalance(newBalance);
      localStorage.setItem("xplain_tokens", String(newBalance));
    }
    
    // TODO: remove mock functionality - simulate content analysis for sensitive material
    const hasSensitiveContent = Math.random() > 0.7;
    const sensitiveTypes: WarningType[] = ["violence", "self-harm", "drugs", "offensive", "general"];
    const randomWarningType = sensitiveTypes[Math.floor(Math.random() * sensitiveTypes.length)];
    
    setTimeout(() => {
      if (hasSensitiveContent) {
        setWarningType(randomWarningType);
        if (isAdult) {
          setViewMode("warning");
        } else {
          setViewMode("blocked");
        }
      } else {
        setViewMode("results");
      }
    }, 2000);
  };

  const handleUrlSubmit = (url: string) => {
    console.log("Analyzing URL:", url);
    
    const type: ContentType = "product";
    setContentType(type);
    
    const cost = calculateTokenCost(type);
    setEstimatedTokenCost(cost);
    
    setPendingAction(() => () => processAnalysis("", type));
    setViewMode("cost-preview");
  };

  const handleTokenPurchase = (packageIndex: number) => {
    // TODO: remove mock functionality - integrate with Stripe
    const packages = [
      { tokens: 1000, price: 5 },
      { tokens: 2500, price: 10 },
      { tokens: 5000, price: 18 },
      { tokens: 10000, price: 30 },
    ];
    
    const selectedPackage = packages[packageIndex];
    console.log("Purchasing package:", selectedPackage);
    
    // Simulate successful purchase
    const newBalance = tokenBalance + selectedPackage.tokens;
    setTokenBalance(newBalance);
    localStorage.setItem("xplain_tokens", String(newBalance));
    setShowTokenPurchase(false);
  };

  const handleSubscribe = () => {
    // TODO: remove mock functionality - integrate with Stripe for subscription
    console.log("Subscribing to premium");
    setIsPremiumSubscriber(true);
    localStorage.setItem("xplain_premium_subscriber", "true");
    setShowSubscriptionPurchase(false);
  };

  const saveCurrentAnswer = () => {
    if (!isPremiumSubscriber) {
      setShowSubscriptionPurchase(true);
      return;
    }

    const newAnswer: SavedAnswer = {
      id: Date.now().toString(),
      type: contentType,
      title: contentType === "product" ? mockProductData.productName :
             contentType === "document" ? mockDocumentData.title :
             mockFoodData.foodName,
      date: new Date().toISOString(),
      preview: contentType === "product" ? mockProductData.sections[0].content :
               contentType === "document" ? mockDocumentData.summary :
               mockFoodData.recipes[0].instructions[0],
      data: contentType === "product" ? mockProductData :
            contentType === "document" ? mockDocumentData :
            mockFoodData,
    };

    const updatedAnswers = [newAnswer, ...savedAnswers];
    setSavedAnswers(updatedAnswers);
    localStorage.setItem("xplain_saved_answers", JSON.stringify(updatedAnswers));
  };

  const handleDeleteAnswer = (answerId: string) => {
    const updatedAnswers = savedAnswers.filter(a => a.id !== answerId);
    setSavedAnswers(updatedAnswers);
    localStorage.setItem("xplain_saved_answers", JSON.stringify(updatedAnswers));
  };

  const handleSendMessage = (message: string) => {
    console.log("Sending question:", message);
    const newMessage = { id: Date.now().toString(), text: message, sender: "user" as const };
    setMessages([...messages, newMessage]);
    
    // TODO: remove mock functionality - make real API call here
    setTimeout(() => {
      const response = { 
        id: (Date.now() + 1).toString(), 
        text: "Based on the product information, here is a helpful answer to your question in simple language.", 
        sender: "assistant" as const 
      };
      setMessages((prev) => [...prev, response]);
    }, 1000);
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
    setViewMode("start");
    setCapturedPhoto("");
    setIsSpeaking(false);
    setMessages([]);
  };

  if (!termsAccepted) {
    return <TermsAndConditions onAccept={handleTermsAccepted} />;
  }

  if (!ageVerified) {
    return <AgeVerification onAgeVerified={handleAgeVerified} />;
  }

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

            {viewMode === "results" ? (
              <div className="flex items-center gap-3">
                <TextSizeControl size={textSize} onSizeChange={setTextSize} />
                {isPremiumSubscriber && (
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => setShowSavedAnswers(true)}
                    className="min-h-12 min-w-12"
                    data-testid="button-view-history"
                  >
                    <History className="h-5 w-5" />
                  </Button>
                )}
              </div>
            ) : viewMode === "start" || viewMode === "capture" || viewMode === "upload" || viewMode === "url" ? (
              <>
                <TokenBalance
                  tokens={tokenBalance}
                  freeAnswersRemaining={freeAnswersRemaining}
                  onBuyTokens={() => setShowTokenPurchase(true)}
                />
                {isPremiumSubscriber && (
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => setShowSavedAnswers(true)}
                    className="min-h-12 min-w-12"
                    data-testid="button-view-history-header"
                  >
                    <History className="h-5 w-5" />
                  </Button>
                )}
                <div className="w-64">
                  <LanguageSelector
                    selectedLanguage={selectedLanguage}
                    onLanguageChange={setSelectedLanguage}
                  />
                </div>
              </>
            ) : (
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
        {viewMode === "start" && (
          <InputMethodSelector
            onMethodSelect={(method) => {
              if (method === "camera") setViewMode("capture");
              else if (method === "upload") setViewMode("upload");
              else if (method === "url") setViewMode("url");
            }}
          />
        )}

        {viewMode === "capture" && (
          <div className="space-y-6">
            <Button
              variant="ghost"
              size="lg"
              onClick={() => setViewMode("start")}
              className="min-h-14"
              data-testid="button-back"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              <span className="text-lg">Back</span>
            </Button>
            <div className="text-center space-y-2 mb-8">
              <h2 className="text-3xl font-bold">Take a Photo</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Point your camera at any product or document
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
              onClick={() => setViewMode("start")}
              className="min-h-14"
              data-testid="button-back-to-start"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              <span className="text-lg">Back</span>
            </Button>
            <div className="text-center space-y-2 mb-8">
              <h2 className="text-3xl font-bold">Upload a File</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Choose a photo or document from your device
              </p>
            </div>
            <PhotoUpload onPhotoSelect={handlePhotoCapture} />
          </div>
        )}

        {viewMode === "url" && (
          <div className="space-y-6">
            <Button
              variant="ghost"
              size="lg"
              onClick={() => setViewMode("start")}
              className="min-h-14"
              data-testid="button-back-to-start"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              <span className="text-lg">Back</span>
            </Button>
            <UrlInput onUrlSubmit={handleUrlSubmit} />
          </div>
        )}

        {viewMode === "cost-preview" && (
          <TokenCostPreview
            estimatedTokens={estimatedTokenCost}
            currentBalance={tokenBalance}
            freeAnswersRemaining={freeAnswersRemaining}
            onProceed={() => {
              if (pendingAction) {
                pendingAction();
                setPendingAction(null);
              }
            }}
            onCancel={handleStartOver}
            textSize={textSize}
          />
        )}

        {viewMode === "loading" && (
          <LoadingState message="Analyzing content..." />
        )}

        {viewMode === "warning" && (
          <ContentWarning
            warningType={warningType}
            onProceed={() => setViewMode("results")}
            onGoBack={handleStartOver}
            textSize={textSize}
          />
        )}

        {viewMode === "blocked" && (
          <ContentBlocked
            onGoBack={handleStartOver}
            textSize={textSize}
          />
        )}

        {viewMode === "results" && contentType === "product" && (
          <div className="space-y-6">
            {!isPremiumSubscriber && (
              <SubscriptionBanner onUpgrade={() => setShowSubscriptionPurchase(true)} />
            )}
            <ExplanationDisplay
              photo={capturedPhoto}
              productName={mockProductData.productName}
              sections={mockProductData.sections}
              textSize={textSize}
              onTextToSpeech={handleTextToSpeech}
              isSpeaking={isSpeaking}
              wikipediaUrl={mockProductData.wikipediaUrl}
              manufacturerUrl={mockProductData.manufacturerUrl}
              price={mockProductData.price}
              purchaseLinks={mockProductData.purchaseLinks}
            />
            {isPremiumSubscriber && (
              <Button
                size="lg"
                onClick={saveCurrentAnswer}
                className="w-full min-h-14 text-lg"
                data-testid="button-save-answer"
              >
                Save This Answer
              </Button>
            )}
            <QuestionAnswer
              messages={messages}
              onSendMessage={handleSendMessage}
              textSize={textSize}
            />
          </div>
        )}

        {viewMode === "results" && contentType === "document" && (
          <div className="space-y-6">
            {!isPremiumSubscriber && (
              <SubscriptionBanner onUpgrade={() => setShowSubscriptionPurchase(true)} />
            )}
            <DocumentDisplay
              title={mockDocumentData.title}
              summary={mockDocumentData.summary}
              followUpActions={mockDocumentData.followUpActions}
              textSize={textSize}
              onTextToSpeech={handleTextToSpeech}
              isSpeaking={isSpeaking}
            />
            {isPremiumSubscriber && (
              <Button
                size="lg"
                onClick={saveCurrentAnswer}
                className="w-full min-h-14 text-lg"
                data-testid="button-save-answer"
              >
                Save This Answer
              </Button>
            )}
            <QuestionAnswer
              messages={messages}
              onSendMessage={handleSendMessage}
              textSize={textSize}
            />
          </div>
        )}

        {viewMode === "results" && contentType === "food" && (
          <div className="space-y-6">
            {!isPremiumSubscriber && (
              <SubscriptionBanner onUpgrade={() => setShowSubscriptionPurchase(true)} />
            )}
            <RecipeDisplay
              photo={capturedPhoto}
              foodName={mockFoodData.foodName}
              recipes={mockFoodData.recipes}
              textSize={textSize}
              onTextToSpeech={handleTextToSpeech}
              isSpeaking={isSpeaking}
            />
            {isPremiumSubscriber && (
              <Button
                size="lg"
                onClick={saveCurrentAnswer}
                className="w-full min-h-14 text-lg"
                data-testid="button-save-answer"
              >
                Save This Answer
              </Button>
            )}
            <QuestionAnswer
              messages={messages}
              onSendMessage={handleSendMessage}
              textSize={textSize}
            />
          </div>
        )}
      </main>

      {showTokenPurchase && (
        <TokenPurchase
          onPurchase={handleTokenPurchase}
          onClose={() => setShowTokenPurchase(false)}
        />
      )}

      {showSubscriptionPurchase && (
        <SubscriptionPurchase
          onSubscribe={handleSubscribe}
          onClose={() => setShowSubscriptionPurchase(false)}
        />
      )}

      {showSavedAnswers && (
        <SavedAnswers
          answers={savedAnswers}
          onAnswerClick={(answerId) => {
            console.log("View saved answer:", answerId);
            setShowSavedAnswers(false);
          }}
          onDelete={handleDeleteAnswer}
          onClose={() => setShowSavedAnswers(false)}
        />
      )}
    </div>
  );
}
