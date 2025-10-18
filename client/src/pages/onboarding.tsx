import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, Upload, Link2, MessageSquare, CreditCard, Save, CheckCircle2, AlertTriangle, Shield } from "lucide-react";

const steps = [
  {
    title: "Welcome to Xplain This!",
    description: "Your personal AI assistant for understanding images, documents, and products in any language.",
    icon: MessageSquare,
    content: "Take a photo or upload an image, and we'll explain what it is in simple terms. Perfect for seniors, non-English speakers, and anyone who needs quick information.",
  },
  {
    title: "Three Ways to Analyze",
    description: "Choose how you want to get information:",
    icon: Camera,
    content: (
      <div className="space-y-4 text-left">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Camera className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-1">Take a Photo</h4>
            <p className="text-muted-foreground">Use your camera to snap a picture of anything</p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Upload className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-1">Upload a Photo</h4>
            <p className="text-muted-foreground">Choose an existing image from your device</p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Link2 className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-1">Paste a URL</h4>
            <p className="text-muted-foreground">Enter a web address to analyze an online image</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Free & Premium Options",
    description: "Choose how you want to use Xplain This:",
    icon: CreditCard,
    content: (
      <div className="space-y-4 text-left">
        <div className="border rounded-lg p-4 bg-card">
          <h4 className="font-semibold text-lg mb-2">Free Plan</h4>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-success" />
              <span>3 free analysis requests per month</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-success" />
              <span>All languages supported</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-success" />
              <span>Emergency detection included</span>
            </li>
          </ul>
        </div>
        <div className="border rounded-lg p-4 bg-card">
          <h4 className="font-semibold text-lg mb-2">Premium - $4.99/month</h4>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-success" />
              <span>Unlimited analysis requests</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-success" />
              <span>Save answers for later</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-success" />
              <span>Priority processing</span>
            </li>
          </ul>
        </div>
        <div className="border rounded-lg p-4 bg-card">
          <h4 className="font-semibold text-lg mb-2">Pay-as-you-go Tokens</h4>
          <p className="text-muted-foreground">
            Purchase tokens for occasional use beyond your free quota
          </p>
        </div>
      </div>
    ),
  },
  {
    title: "Safety Features",
    description: "We keep you safe with built-in protections:",
    icon: Save,
    content: (
      <div className="space-y-4 text-left">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-6 h-6 text-destructive" />
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-1">Emergency Detection</h4>
            <p className="text-muted-foreground">
              We detect medical emergencies, fires, violence, and accidents. You'll see a "Call Emergency Services" button if danger is detected.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center flex-shrink-0">
            <Shield className="w-6 h-6 text-warning" />
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-1">Content Filtering</h4>
            <p className="text-muted-foreground">
              Inappropriate content is automatically blocked to ensure a safe experience for everyone.
            </p>
          </div>
        </div>
      </div>
    ),
  },
];

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [, setLocation] = useLocation();

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setLocation("/");
    }
  };

  const handleSkip = () => {
    setLocation("/");
  };

  const step = steps[currentStep];
  const Icon = step.icon;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-2xl">
        <CardContent className="p-8 space-y-6">
          <div className="flex items-center justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <Icon className="w-10 h-10 text-primary" />
            </div>
          </div>

          <div className="text-center space-y-2">
            <h2 className="text-3xl font-semibold">{step.title}</h2>
            <p className="text-xl text-muted-foreground">{step.description}</p>
          </div>

          <div className="py-6">
            {typeof step.content === "string" ? (
              <p className="text-lg text-center leading-relaxed">{step.content}</p>
            ) : (
              step.content
            )}
          </div>

          <div className="flex items-center justify-center gap-2 py-4">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all ${
                  index === currentStep
                    ? "w-8 bg-primary"
                    : "w-2 bg-muted"
                }`}
                data-testid={`indicator-step-${index}`}
              />
            ))}
          </div>

          <div className="flex gap-4">
            <Button
              variant="outline"
              className="flex-1 h-14 text-xl"
              onClick={handleSkip}
              data-testid="button-skip"
            >
              Skip Tutorial
            </Button>
            <Button
              className="flex-1 h-14 text-xl"
              onClick={handleNext}
              data-testid="button-next"
            >
              {currentStep < steps.length - 1 ? "Next" : "Get Started"}
            </Button>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Step {currentStep + 1} of {steps.length}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
