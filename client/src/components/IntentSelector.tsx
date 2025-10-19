import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
      <Label id="intent-selector-label" className="text-lg font-semibold">
        What do you want to know?
      </Label>
      <p className="text-sm text-muted-foreground" id="intent-selector-description">
        Choose what information you need about this image
      </p>
      <RadioGroup 
        value={selectedIntent} 
        onValueChange={onIntentChange}
        aria-labelledby="intent-selector-label"
        aria-describedby="intent-selector-description"
        className="grid grid-cols-1 md:grid-cols-2 gap-3"
      >
        {INTENT_OPTIONS.map((option) => {
          const Icon = option.icon;
          const isSelected = selectedIntent === option.id;
          
          return (
            <label
              key={option.id}
              htmlFor={`intent-${option.id}`}
              className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all hover-elevate active-elevate-2 ${
                isSelected 
                  ? "border-primary bg-primary/5 ring-2 ring-primary ring-offset-2" 
                  : "border-border bg-card"
              }`}
              data-testid={`button-intent-${option.id}`}
            >
              <RadioGroupItem 
                value={option.id} 
                id={`intent-${option.id}`}
                className="mt-1"
              />
              <div className={`p-2 rounded-md shrink-0 ${
                isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
              }`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-base mb-1">{option.title}</div>
                <div className="text-sm text-muted-foreground leading-snug">
                  {option.description}
                </div>
              </div>
            </label>
          );
        })}
      </RadioGroup>
    </div>
  );
}
