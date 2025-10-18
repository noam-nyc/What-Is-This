import { Volume2, FileText, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface FollowUpAction {
  action: string;
  priority: "low" | "medium" | "high";
}

interface DocumentDisplayProps {
  title: string;
  summary: string;
  followUpActions: FollowUpAction[];
  textSize: "small" | "medium" | "large";
  onTextToSpeech: () => void;
  isSpeaking: boolean;
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

const priorityColors = {
  low: "bg-secondary text-secondary-foreground",
  medium: "bg-chart-3 text-white",
  high: "bg-destructive text-destructive-foreground",
};

export default function DocumentDisplay({
  title,
  summary,
  followUpActions,
  textSize,
  onTextToSpeech,
  isSpeaking,
}: DocumentDisplayProps) {
  return (
    <div className="space-y-6 pb-24">
      <div className="flex items-center gap-3">
        <FileText className="h-10 w-10 text-primary flex-shrink-0" />
        <h1
          className={`${titleSizeMap[textSize]} font-bold`}
          data-testid="text-document-title"
        >
          {title}
        </h1>
      </div>

      <Card className="p-6 space-y-4">
        <h2 className={`${sizeMap[textSize]} font-semibold`}>
          Summary
        </h2>
        <p
          className={`${sizeMap[textSize]} leading-relaxed`}
          style={{ lineHeight: "1.8" }}
          data-testid="text-document-summary"
        >
          {summary}
        </p>
      </Card>

      {followUpActions.length > 0 && (
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0" />
            <h2 className={`${sizeMap[textSize]} font-semibold`}>
              What to do next
            </h2>
          </div>
          <div className="space-y-3">
            {followUpActions.map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-4 bg-muted/30 rounded-xl"
                data-testid={`action-${index}`}
              >
                <Badge
                  className={`${priorityColors[item.priority]} text-sm px-3 py-1 min-h-8`}
                  data-testid={`badge-priority-${index}`}
                >
                  {item.priority.toUpperCase()}
                </Badge>
                <p className={`${sizeMap[textSize]} flex-1 leading-relaxed`}>
                  {item.action}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Button
        size="lg"
        onClick={onTextToSpeech}
        className={`fixed bottom-6 right-6 min-h-16 min-w-16 rounded-full shadow-2xl ${
          isSpeaking ? "bg-destructive hover:bg-destructive/90" : ""
        }`}
        data-testid="button-text-to-speech"
      >
        <Volume2 className="h-7 w-7" />
      </Button>
    </div>
  );
}
