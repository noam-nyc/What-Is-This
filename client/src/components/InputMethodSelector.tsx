import { Camera, Upload, Link } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InputMethodSelectorProps {
  onMethodSelect: (method: "camera" | "upload" | "url") => void;
}

export default function InputMethodSelector({
  onMethodSelect,
}: InputMethodSelectorProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">Choose How to Start</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Take a photo, upload a file, or paste a web link
        </p>
      </div>

      <div className="grid gap-4 max-w-2xl mx-auto">
        <Button
          size="lg"
          onClick={() => onMethodSelect("camera")}
          className="min-h-24 text-xl justify-start px-8"
          data-testid="button-select-camera"
        >
          <Camera className="h-8 w-8 mr-4 flex-shrink-0" />
          <div className="text-left">
            <div className="font-semibold">Take Photo</div>
            <div className="text-sm opacity-90">Use your camera</div>
          </div>
        </Button>

        <Button
          size="lg"
          variant="outline"
          onClick={() => onMethodSelect("upload")}
          className="min-h-24 text-xl justify-start px-8"
          data-testid="button-select-upload"
        >
          <Upload className="h-8 w-8 mr-4 flex-shrink-0" />
          <div className="text-left">
            <div className="font-semibold">Upload File</div>
            <div className="text-sm opacity-90">Choose from your device</div>
          </div>
        </Button>

        <Button
          size="lg"
          variant="outline"
          onClick={() => onMethodSelect("url")}
          className="min-h-24 text-xl justify-start px-8"
          data-testid="button-select-url"
        >
          <Link className="h-8 w-8 mr-4 flex-shrink-0" />
          <div className="text-left">
            <div className="font-semibold">Enter Web Address</div>
            <div className="text-sm opacity-90">Paste a link</div>
          </div>
        </Button>
      </div>
    </div>
  );
}
