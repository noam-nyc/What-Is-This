import { ShieldOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ContentBlockedProps {
  onGoBack: () => void;
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

export default function ContentBlocked({
  onGoBack,
  textSize,
}: ContentBlockedProps) {
  return (
    <div className="flex items-center justify-center min-h-[400px] p-4">
      <Card className="w-full max-w-2xl p-8 space-y-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
            <ShieldOff className="h-12 w-12 text-muted-foreground" />
          </div>
          <h2
            className={`${titleSizeMap[textSize]} font-bold`}
            data-testid="text-blocked-title"
          >
            Content Not Available
          </h2>
          <p
            className={`${sizeMap[textSize]} text-muted-foreground leading-relaxed max-w-md`}
            style={{ lineHeight: "1.8" }}
            data-testid="text-blocked-message"
          >
            This content has been blocked because it may not be appropriate for users under 18. This includes references to violence, self-harm, drugs, or offensive material.
          </p>
          <p className={`${sizeMap[textSize]} leading-relaxed max-w-md`}>
            Please try analyzing something else.
          </p>
        </div>

        <Button
          size="lg"
          onClick={onGoBack}
          className="w-full min-h-16 text-xl"
          data-testid="button-try-again"
        >
          Try Something Else
        </Button>
      </Card>
    </div>
  );
}
