import { useRef, useState } from "react";
import { Camera, SwitchCamera, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CameraCaptureProps {
  onCapture: (imageData: string) => void;
  onUploadClick: () => void;
}

export default function CameraCapture({
  onCapture,
  onUploadClick,
}: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">(
    "environment"
  );
  const [cameraError, setCameraError] = useState<string | null>(null);

  const startCamera = async () => {
    try {
      setCameraError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode },
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error("Camera access error:", error);
      setCameraError("Camera access denied. Please use upload instead.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const switchCamera = async () => {
    stopCamera();
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
    setTimeout(startCamera, 100);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const imageData = canvas.toDataURL("image/jpeg");
        onCapture(imageData);
        stopCamera();
      }
    }
  };

  if (cameraError) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 p-8 bg-muted/30 rounded-2xl min-h-[400px]">
        <Camera className="h-20 w-20 text-muted-foreground" />
        <p className="text-xl text-center text-muted-foreground max-w-md">
          {cameraError}
        </p>
        <Button
          size="lg"
          onClick={onUploadClick}
          className="min-h-16 text-xl px-8"
          data-testid="button-upload-instead"
        >
          <ImageIcon className="h-6 w-6 mr-2" />
          Upload Photo Instead
        </Button>
      </div>
    );
  }

  if (!stream) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 p-8 bg-muted/30 rounded-2xl min-h-[400px]">
        <Camera className="h-20 w-20 text-muted-foreground" />
        <Button
          size="lg"
          onClick={startCamera}
          className="min-h-16 text-xl px-8"
          data-testid="button-start-camera"
        >
          <Camera className="h-6 w-6 mr-2" />
          Start Camera
        </Button>
        <Button
          size="lg"
          variant="outline"
          onClick={onUploadClick}
          className="min-h-16 text-xl px-8"
          data-testid="button-upload-photo"
        >
          <ImageIcon className="h-6 w-6 mr-2" />
          Upload Photo
        </Button>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full rounded-2xl bg-black"
        data-testid="video-camera-preview"
      />

      <div className="absolute bottom-6 left-0 right-0 flex items-center justify-center gap-4 px-4">
        <Button
          size="icon"
          variant="secondary"
          onClick={onUploadClick}
          className="min-h-16 min-w-16 rounded-full shadow-lg"
          data-testid="button-gallery"
        >
          <ImageIcon className="h-7 w-7" />
        </Button>

        <Button
          size="icon"
          onClick={capturePhoto}
          className="min-h-20 min-w-20 rounded-full shadow-lg bg-primary hover:bg-primary/90"
          data-testid="button-capture"
        >
          <div className="h-16 w-16 rounded-full border-4 border-white" />
        </Button>

        <Button
          size="icon"
          variant="secondary"
          onClick={switchCamera}
          className="min-h-16 min-w-16 rounded-full shadow-lg"
          data-testid="button-switch-camera"
        >
          <SwitchCamera className="h-7 w-7" />
        </Button>
      </div>
    </div>
  );
}
