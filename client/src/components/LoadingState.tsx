import { Loader2, Camera } from "lucide-react";

interface LoadingStateProps {
  message?: string;
}

export default function LoadingState({
  message = "Analyzing image...",
}: LoadingStateProps) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-6 p-12"
      data-testid="loading-state"
    >
      <div className="relative">
        <Camera className="h-16 w-16 text-muted-foreground" />
        <Loader2 className="h-16 w-16 animate-spin text-primary absolute top-0 left-0" />
      </div>
      <p className="text-2xl font-semibold text-center">{message}</p>
    </div>
  );
}
