import { Coins, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface TokenPackage {
  tokens: number;
  price: number;
  popular?: boolean;
}

interface TokenPurchaseProps {
  onPurchase: (packageIndex: number) => void;
  onClose: () => void;
}

const packages: TokenPackage[] = [
  { tokens: 1000, price: 5 },
  { tokens: 2500, price: 10, popular: true },
  { tokens: 5000, price: 18 },
  { tokens: 10000, price: 30 },
];

export default function TokenPurchase({ onPurchase, onClose }: TokenPurchaseProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-3xl p-8 space-y-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center gap-3">
          <Coins className="h-10 w-10 text-primary" />
          <h2 className="text-3xl font-bold">Buy Tokens</h2>
        </div>

        <p className="text-xl text-muted-foreground">
          Choose a token package to continue using Xplain This
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          {packages.map((pkg, index) => (
            <Card
              key={index}
              className={`p-6 space-y-4 hover-elevate cursor-pointer relative ${
                pkg.popular ? "border-primary border-2" : ""
              }`}
              onClick={() => onPurchase(index)}
              data-testid={`card-package-${index}`}
            >
              {pkg.popular && (
                <div className="absolute -top-3 right-4">
                  <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold">
                    {pkg.tokens.toLocaleString()}
                  </span>
                  <span className="text-xl text-muted-foreground">tokens</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-primary">
                    ${pkg.price}
                  </span>
                  <span className="text-lg text-muted-foreground">USD</span>
                </div>
                <p className="text-base text-muted-foreground">
                  ${(pkg.price / pkg.tokens * 1000).toFixed(2)} per 1,000 tokens
                </p>
              </div>
              <Button
                size="lg"
                className="w-full min-h-14 text-lg"
                onClick={(e) => {
                  e.stopPropagation();
                  onPurchase(index);
                }}
              >
                <CreditCard className="h-5 w-5 mr-2" />
                Purchase
              </Button>
            </Card>
          ))}
        </div>

        <div className="bg-muted/30 rounded-xl p-4 space-y-2">
          <p className="text-lg font-semibold">About Tokens</p>
          <ul className="text-base space-y-1 list-disc list-inside">
            <li>Tokens never expire</li>
            <li>Use tokens for unlimited explanations</li>
            <li>Different questions use different amounts of tokens</li>
            <li>You'll see the cost before each analysis</li>
          </ul>
        </div>

        <Button
          size="lg"
          variant="outline"
          onClick={onClose}
          className="w-full min-h-14 text-lg"
          data-testid="button-close"
        >
          Cancel
        </Button>
      </Card>
    </div>
  );
}
