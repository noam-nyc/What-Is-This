import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Info, BookOpen, Wrench, AlertTriangle, History, ShoppingCart, Shield } from "lucide-react";

export type AnalysisIntent = "general" | "use" | "maintain" | "fix" | "history" | "price" | "safety";

interface IntentOption {
  id: AnalysisIntent;
  icon: React.ElementType;
  title: string;
  description: string;
}

const INTENT_OPTIONS: IntentOption[] = [
  {
    id: "general",
    icon: Info,
    title: "General Information",
    description: "What is this? Basic identification and overview",
  },
  {
    id: "use",
    icon: BookOpen,
    title: "How to Use",
    description: "Instructions, tips, and proper usage",
  },
  {
    id: "maintain",
    icon: Wrench,
    title: "How to Maintain",
    description: "Care, cleaning, and maintenance tips",
  },
  {
    id: "fix",
    icon: AlertTriangle,
    title: "How to Fix / Troubleshoot",
    description: "Repair steps, common issues, and solutions",
  },
  {
    id: "history",
    icon: History,
    title: "History & Origin",
    description: "When and where it's from, background info",
  },
  {
    id: "price",
    icon: ShoppingCart,
    title: "Price & Where to Buy",
    description: "Cost, shopping options, and where to get it",
  },
  {
    id: "safety",
    icon: Shield,
    title: "Safety Check",
    description: "Is this safe? Warnings and precautions",
  },
];

interface IntentSelectorProps {
  selectedIntent: AnalysisIntent;
  onIntentChange: (intent: AnalysisIntent) => void;
}

export default function IntentSelector({ selectedIntent, onIntentChange }: IntentSelectorProps) {
  return (
    <div className="space-y-3">
      <Label className="text-lg font-semibold">What do you want to know?</Label>
      <p className="text-sm text-muted-foreground">
        Choose what information you need about this image
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {INTENT_OPTIONS.map((option) => {
          const Icon = option.icon;
          const isSelected = selectedIntent === option.id;
          
          return (
            <Card
              key={option.id}
              className={`cursor-pointer transition-all hover-elevate active-elevate-2 ${
                isSelected ? "ring-2 ring-primary bg-primary/5" : ""
              }`}
              onClick={() => onIntentChange(option.id)}
              data-testid={`intent-option-${option.id}`}
            >
              <CardContent className="p-4 flex items-start gap-3">
                <div className={`p-2 rounded-md ${
                  isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-base mb-1">{option.title}</h3>
                  <p className="text-sm text-muted-foreground leading-snug">
                    {option.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
