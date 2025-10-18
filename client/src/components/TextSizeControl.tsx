import { Type, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TextSizeControlProps {
  size: "small" | "medium" | "large";
  onSizeChange: (size: "small" | "medium" | "large") => void;
}

export default function TextSizeControl({
  size,
  onSizeChange,
}: TextSizeControlProps) {
  const handleDecrease = () => {
    if (size === "large") onSizeChange("medium");
    else if (size === "medium") onSizeChange("small");
  };

  const handleIncrease = () => {
    if (size === "small") onSizeChange("medium");
    else if (size === "medium") onSizeChange("large");
  };

  return (
    <div className="flex items-center gap-2" data-testid="text-size-control">
      <Button
        size="icon"
        variant="outline"
        onClick={handleDecrease}
        disabled={size === "small"}
        className="min-h-12 min-w-12"
        data-testid="button-decrease-text"
      >
        <Minus className="h-5 w-5" />
      </Button>
      <div className="flex items-center gap-1 min-w-16 justify-center">
        <Type className="h-5 w-5" />
        <span className="font-semibold text-base uppercase">{size[0]}</span>
      </div>
      <Button
        size="icon"
        variant="outline"
        onClick={handleIncrease}
        disabled={size === "large"}
        className="min-h-12 min-w-12"
        data-testid="button-increase-text"
      >
        <Plus className="h-5 w-5" />
      </Button>
    </div>
  );
}
