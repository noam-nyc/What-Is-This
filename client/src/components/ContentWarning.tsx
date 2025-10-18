import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ContentWarningProps {
  warningType: "violence" | "self-harm" | "drugs" | "offensive" | "general";
  onProceed: () => void;
  onGoBack: () => void;
  textSize: "small" | "medium" | "large";
}

const warningMessages = {
  violence: "This content contains references to violence.",
  "self-harm": "This content contains references to self-harm.",
  drugs: "This content contains references to drug use.",
  offensive: "This content may contain offensive or derogatory language.",
  general: "This content may be sensitive or inappropriate for some users.",
};

const sizeMap = {
  small: "text-lg",
  medium: "text-xl",
  large: "text-2xl",
};

const titleSizeMap = {
  small: "text-xl",
  medium: "text-2xl",
  large: "text-3xl",
};

export default function ContentWarning({
  warningType,
  onProceed,
  onGoBack,
  textSize,
}: ContentWarningProps) {
  return (
    <div className="flex items-center justify-center min-h-[400px] p-4">
      <Card className="w-full max-w-2xl p-8 space-y-6 border-destructive/50">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="h-20 w-20 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="h-12 w-12 text-destructive" />
          </div>
          <h2
            className={`${titleSizeMap[textSize]} font-bold text-destructive`}
            data-testid="text-warning-title"
          >
            Sensitive Content Warning
          </h2>
          <p
            className={`${sizeMap[textSize]} text-muted-foreground leading-relaxed max-w-md`}
            data-testid="text-warning-message"
          >
            {warningMessages[warningType]}
          </p>
          <p className={`${sizeMap[textSize]} leading-relaxed max-w-md`}>
            Do you want to continue viewing this content?
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Button
            size="lg"
            onClick={onProceed}
            className="min-h-16 text-xl"
            data-testid="button-proceed"
          >
            Yes, Continue
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={onGoBack}
            className="min-h-16 text-xl"
            data-testid="button-go-back"
          >
            No, Go Back
          </Button>
        </div>
      </Card>
    </div>
  );
}
