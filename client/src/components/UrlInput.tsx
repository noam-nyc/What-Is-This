import { useState } from "react";
import { Link, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

interface UrlInputProps {
  onUrlSubmit: (url: string) => void;
}

export default function UrlInput({ onUrlSubmit }: UrlInputProps) {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      setIsLoading(true);
      onUrlSubmit(url.trim());
    }
  };

  return (
    <Card className="p-8">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Link className="h-8 w-8 text-primary flex-shrink-0" />
          <h2 className="text-2xl font-semibold">Enter Web Address</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/product-page"
            className="min-h-14 text-lg"
            disabled={isLoading}
            data-testid="input-url"
          />
          <Button
            type="submit"
            size="lg"
            disabled={!url.trim() || isLoading}
            className="w-full min-h-16 text-xl"
            data-testid="button-submit-url"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-6 w-6 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <Link className="h-6 w-6 mr-2" />
                Analyze Page
              </>
            )}
          </Button>
        </form>
        <p className="text-lg text-muted-foreground text-center">
          Paste a link to any product page or document
        </p>
      </div>
    </Card>
  );
}
