import { Volume2, AlertTriangle, Wrench, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ExplanationSection {
  title: string;
  content: string;
  icon: "info" | "wrench" | "warning";
}

interface ExplanationDisplayProps {
  photo: string;
  productName: string;
  sections: ExplanationSection[];
  textSize: "small" | "medium" | "large";
  onTextToSpeech: () => void;
  isSpeaking: boolean;
}

const iconMap = {
  info: Info,
  wrench: Wrench,
  warning: AlertTriangle,
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

export default function ExplanationDisplay({
  photo,
  productName,
  sections,
  textSize,
  onTextToSpeech,
  isSpeaking,
}: ExplanationDisplayProps) {
  return (
    <div className="space-y-6">
      <img
        src={photo}
        alt="Product"
        className="w-full max-h-48 object-cover rounded-2xl shadow-lg"
        data-testid="img-product"
      />

      <h1
        className={`${titleSizeMap[textSize]} font-bold text-center`}
        data-testid="text-product-name"
      >
        {productName}
      </h1>

      <div className="space-y-4">
        {sections.map((section, index) => {
          const Icon = iconMap[section.icon];
          return (
            <Card
              key={index}
              className="p-6 space-y-3"
              data-testid={`card-section-${index}`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`h-6 w-6 flex-shrink-0 ${
                    section.icon === "warning"
                      ? "text-destructive"
                      : "text-primary"
                  }`}
                />
                <h2
                  className={`${sizeMap[textSize]} font-semibold`}
                  data-testid={`text-section-title-${index}`}
                >
                  {section.title}
                </h2>
              </div>
              <p
                className={`${sizeMap[textSize]} leading-relaxed`}
                style={{ lineHeight: "1.8" }}
                data-testid={`text-section-content-${index}`}
              >
                {section.content}
              </p>
            </Card>
          );
        })}
      </div>

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
