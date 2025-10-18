import { useRef } from "react";
import { Upload, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PhotoUploadProps {
  onPhotoSelect: (imageData: string) => void;
}

export default function PhotoUpload({ onPhotoSelect }: PhotoUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result as string;
        onPhotoSelect(imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-12 border-2 border-dashed border-border rounded-2xl bg-muted/20 hover-elevate cursor-pointer min-h-[400px]"
      onClick={handleClick}
      data-testid="photo-upload-zone"
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        data-testid="input-file-upload"
      />
      <ImageIcon className="h-20 w-20 text-muted-foreground" />
      <div className="text-center space-y-2">
        <p className="text-2xl font-semibold">Upload a Photo</p>
        <p className="text-lg text-muted-foreground max-w-md">
          Tap to select a photo from your device
        </p>
      </div>
      <Button
        size="lg"
        className="min-h-16 text-xl px-8"
        data-testid="button-select-photo"
      >
        <Upload className="h-6 w-6 mr-2" />
        Select Photo
      </Button>
    </div>
  );
}
