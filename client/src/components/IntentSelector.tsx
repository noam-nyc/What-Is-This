import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { HelpCircle, MapPin, MessageCircle, BookOpen, Sparkles, Shield, Wrench, ShoppingCart } from "lucide-react";
import type { AnalysisIntent } from "@shared/schema";
import { FREE_INTENTS } from "@shared/schema";

interface IntentOption {
  id: AnalysisIntent;
  icon: React.ElementType;
  title: string;
  description: string;
  isFree: boolean;
}

const INTENT_OPTIONS: IntentOption[] = [
  {
    id: "what_is_this",
    icon: HelpCircle,
    title: "What is this?",
    description: "Basic ID: name, type, brand, category, species, file type",
    isFree: true,
  },
  {
    id: "where_from",
    icon: MapPin,
    title: "Where is it from?",
    description: "Origin, who made it, what it's made of, history",
    isFree: true,
  },
  {
    id: "general_info",
    icon: MessageCircle,
    title: "General Info",
    description: "Translation, plain-language explanation, definitions",
    isFree: true,
  },
  {
    id: "how_to_use",
    icon: BookOpen,
    title: "How to use it",
    description: "Setup, application, usage",
    isFree: false,
  },
  {
    id: "how_to_care",
    icon: Sparkles,
    title: "How to care for it",
    description: "Cleaning, maintenance, storage",
    isFree: false,
  },
  {
    id: "is_safe",
    icon: Shield,
    title: "Is it safe?",
    description: "Allergy, shock, injury, choking, health hazards",
    isFree: false,
  },
  {
    id: "how_to_fix",
    icon: Wrench,
    title: "How to fix it",
    description: "Troubleshooting, repair tips",
    isFree: false,
  },
  {
    id: "where_to_buy",
    icon: ShoppingCart,
    title: "Where to buy one",
    description: "Pricing, product links, marketplaces, alternatives",
    isFree: false,
  },
];

interface IntentSelectorProps {
  selectedIntent: AnalysisIntent;
  onIntentChange: (intent: AnalysisIntent) => void;
  isPremium?: boolean;
}

export default function IntentSelector({ selectedIntent, onIntentChange, isPremium = false }: IntentSelectorProps) {
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
          const isDisabled = !option.isFree && !isPremium;
          
          return (
            <label
              key={option.id}
              htmlFor={`intent-${option.id}`}
              className={`flex items-start gap-3 p-4 rounded-lg border-2 transition-all ${
                isDisabled
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer hover-elevate active-elevate-2"
              } ${
                isSelected 
                  ? "border-primary bg-primary/5 ring-2 ring-primary ring-offset-2" 
                  : "border-border bg-card"
              }`}
              data-testid={`button-intent-${option.id}`}
            >
              <RadioGroupItem 
                value={option.id} 
                id={`intent-${option.id}`}
                disabled={isDisabled}
                className="mt-1"
              />
              <div className={`p-2 rounded-md shrink-0 ${
                isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
              }`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-base">{option.title}</span>
                  <Badge 
                    variant={option.isFree ? "secondary" : "default"}
                    className="text-xs shrink-0"
                    data-testid={`badge-${option.isFree ? 'free' : 'premium'}-${option.id}`}
                  >
                    {option.isFree ? "Free" : "Premium"}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground leading-snug">
                  {option.description}
                </div>
                {isDisabled && (
                  <div className="text-xs text-muted-foreground mt-2 italic">
                    Subscribe to unlock this feature
                  </div>
                )}
              </div>
            </label>
          );
        })}
      </RadioGroup>
    </div>
  );
}
