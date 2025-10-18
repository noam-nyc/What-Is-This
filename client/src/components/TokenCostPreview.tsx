import { Coins, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface TokenCostPreviewProps {
  estimatedTokens: number;
  currentBalance: number;
  freeAnswersRemaining: number;
  onProceed: () => void;
  onCancel: () => void;
  textSize: "small" | "medium" | "large";
}

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

export default function TokenCostPreview({
  estimatedTokens,
  currentBalance,
  freeAnswersRemaining,
  onProceed,
  onCancel,
  textSize,
}: TokenCostPreviewProps) {
  const willUseFreeAnswer = freeAnswersRemaining > 0;
  const hasEnoughTokens = currentBalance >= estimatedTokens;
  const canProceed = willUseFreeAnswer || hasEnoughTokens;

  return (
    <div className="flex items-center justify-center min-h-[400px] p-4">
      <Card className="w-full max-w-2xl p-8 space-y-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <Coins className="h-16 w-16 text-primary" />
          <h2 className={`${titleSizeMap[textSize]} font-bold`}>
            Token Cost Estimate
          </h2>
        </div>

        {willUseFreeAnswer ? (
          <div className="bg-chart-2/10 border-2 border-chart-2 rounded-xl p-6 space-y-3">
            <p className={`${sizeMap[textSize]} font-semibold text-center`}>
              Using Free Answer
            </p>
            <p className={`${sizeMap[textSize]} text-center`} style={{ lineHeight: "1.8" }}>
              You have {freeAnswersRemaining} free answer{freeAnswersRemaining !== 1 ? "s" : ""} remaining this month.
              This analysis will use one free answer.
            </p>
          </div>
        ) : (
          <>
            <div className="bg-muted/30 rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className={`${sizeMap[textSize]} font-semibold`}>
                  Estimated Cost:
                </span>
                <div className="flex items-center gap-2">
                  <Coins className="h-6 w-6 text-primary" />
                  <span className={`${titleSizeMap[textSize]} font-bold text-primary`}>
                    {estimatedTokens.toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className={`${sizeMap[textSize]}`}>Your Balance:</span>
                <span className={`${sizeMap[textSize]} font-semibold`}>
                  {currentBalance.toLocaleString()} tokens
                </span>
              </div>
              {hasEnoughTokens && (
                <div className="flex items-center justify-between pt-3 border-t">
                  <span className={`${sizeMap[textSize]} font-semibold`}>
                    After Analysis:
                  </span>
                  <span className={`${sizeMap[textSize]} font-semibold`}>
                    {(currentBalance - estimatedTokens).toLocaleString()} tokens
                  </span>
                </div>
              )}
            </div>

            {!hasEnoughTokens && (
              <div className="bg-destructive/10 border-2 border-destructive rounded-xl p-6 space-y-3">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-6 w-6 text-destructive flex-shrink-0" />
                  <p className={`${sizeMap[textSize]} font-semibold text-destructive`}>
                    Not Enough Tokens
                  </p>
                </div>
                <p className={`${sizeMap[textSize]}`} style={{ lineHeight: "1.8" }}>
                  You need {(estimatedTokens - currentBalance).toLocaleString()} more tokens.
                  Please purchase tokens to continue.
                </p>
              </div>
            )}
          </>
        )}

        <div className="space-y-3">
          <Button
            size="lg"
            onClick={onProceed}
            disabled={!canProceed}
            className="w-full min-h-16 text-xl"
            data-testid="button-proceed"
          >
            {willUseFreeAnswer ? "Use Free Answer" : "Proceed with Analysis"}
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={onCancel}
            className="w-full min-h-16 text-xl"
            data-testid="button-cancel"
          >
            Cancel
          </Button>
        </div>
      </Card>
    </div>
  );
}
