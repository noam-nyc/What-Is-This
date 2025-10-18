import { ExternalLink, BookOpen, DollarSign, ShoppingCart, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface PriceInfo {
  amount: string;
  currency: string;
  range?: string;
}

interface PurchaseLink {
  name: string;
  url: string;
  type: "online" | "nearby";
}

interface ProductLinksProps {
  wikipediaUrl?: string;
  manufacturerUrl?: string;
  price?: PriceInfo;
  purchaseLinks: PurchaseLink[];
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

export default function ProductLinks({
  wikipediaUrl,
  manufacturerUrl,
  price,
  purchaseLinks,
  textSize,
}: ProductLinksProps) {
  const onlineLinks = purchaseLinks.filter((link) => link.type === "online");
  const nearbyLinks = purchaseLinks.filter((link) => link.type === "nearby");

  return (
    <div className="space-y-4">
      {(wikipediaUrl || manufacturerUrl) && (
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <BookOpen className="h-6 w-6 text-primary flex-shrink-0" />
            <h2 className={`${sizeMap[textSize]} font-semibold`}>
              Learn More
            </h2>
          </div>
          <div className="space-y-3">
            {wikipediaUrl && (
              <Button
                variant="outline"
                className="w-full min-h-14 text-lg justify-start"
                onClick={() => window.open(wikipediaUrl, "_blank")}
                data-testid="button-wikipedia"
              >
                <ExternalLink className="h-5 w-5 mr-3 flex-shrink-0" />
                <span>Read about this on Wikipedia</span>
              </Button>
            )}
            {manufacturerUrl && (
              <Button
                variant="outline"
                className="w-full min-h-14 text-lg justify-start"
                onClick={() => window.open(manufacturerUrl, "_blank")}
                data-testid="button-manufacturer"
              >
                <ExternalLink className="h-5 w-5 mr-3 flex-shrink-0" />
                <span>Visit manufacturer website</span>
              </Button>
            )}
          </div>
        </Card>
      )}

      {price && (
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <DollarSign className="h-6 w-6 text-primary flex-shrink-0" />
            <h2 className={`${sizeMap[textSize]} font-semibold`}>
              Price Information
            </h2>
          </div>
          <div className="space-y-2">
            <p className={`${titleSizeMap[textSize]} font-bold text-primary`} data-testid="text-price">
              {price.currency} {price.amount}
            </p>
            {price.range && (
              <p className={`${sizeMap[textSize]} text-muted-foreground`}>
                {price.range}
              </p>
            )}
          </div>
        </Card>
      )}

      {onlineLinks.length > 0 && (
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <ShoppingCart className="h-6 w-6 text-primary flex-shrink-0" />
            <h2 className={`${sizeMap[textSize]} font-semibold`}>
              Buy Online
            </h2>
          </div>
          <div className="space-y-3">
            {onlineLinks.map((link, index) => (
              <Button
                key={index}
                variant="default"
                className="w-full min-h-14 text-lg"
                onClick={() => {
                  console.log("Opening purchase link:", link.url);
                  window.open(link.url, "_blank");
                }}
                data-testid={`button-buy-online-${index}`}
              >
                <ShoppingCart className="h-5 w-5 mr-3 flex-shrink-0" />
                <span>Buy from {link.name}</span>
              </Button>
            ))}
          </div>
        </Card>
      )}

      {nearbyLinks.length > 0 && (
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <MapPin className="h-6 w-6 text-primary flex-shrink-0" />
            <h2 className={`${sizeMap[textSize]} font-semibold`}>
              Find Nearby
            </h2>
          </div>
          <div className="space-y-3">
            {nearbyLinks.map((link, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full min-h-14 text-lg justify-start"
                onClick={() => {
                  console.log("Opening nearby store link:", link.url);
                  window.open(link.url, "_blank");
                }}
                data-testid={`button-find-nearby-${index}`}
              >
                <MapPin className="h-5 w-5 mr-3 flex-shrink-0" />
                <span>Find at {link.name}</span>
              </Button>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
