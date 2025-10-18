import { Crown, Check, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface SubscriptionPurchaseProps {
  onSubscribe: () => void;
  onClose: () => void;
}

const features = [
  "Save unlimited answers",
  "Access your history anytime",
  "Download explanations as PDF",
  "Priority support",
  "Cancel anytime",
];

export default function SubscriptionPurchase({
  onSubscribe,
  onClose,
}: SubscriptionPurchaseProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Crown className="h-7 w-7 text-primary" />
          </div>
          <div>
            <h2 className="text-3xl font-bold">Upgrade to Premium</h2>
            <p className="text-lg text-muted-foreground">
              Save and access your answers anytime
            </p>
          </div>
        </div>

        <Card className="p-8 bg-gradient-to-br from-primary/5 to-primary/10 border-2 border-primary/20">
          <div className="space-y-6">
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-bold text-primary">$4.99</span>
              <span className="text-2xl text-muted-foreground">/month</span>
            </div>

            <ul className="space-y-3">
              {features.map((feature, index) => (
                <li
                  key={index}
                  className="flex items-center gap-3 text-lg"
                  data-testid={`feature-${index}`}
                >
                  <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <Check className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </Card>

        <div className="space-y-3">
          <Button
            size="lg"
            onClick={onSubscribe}
            className="w-full min-h-16 text-xl"
            data-testid="button-subscribe"
          >
            <CreditCard className="h-6 w-6 mr-2" />
            Subscribe for $4.99/month
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={onClose}
            className="w-full min-h-14 text-lg"
            data-testid="button-close-subscription"
          >
            Not Now
          </Button>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Cancel anytime. No long-term commitment required.
        </p>
      </Card>
    </div>
  );
}
