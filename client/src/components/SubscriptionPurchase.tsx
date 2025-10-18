import { Crown, Check, Zap, Trophy, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SubscriptionPurchaseProps {
  onSubscribe: (tier: string) => void;
  onClose: () => void;
}

const SUBSCRIPTION_TIERS = [
  {
    id: "weekly",
    name: "Weekly",
    price: "$2.99",
    interval: "/week",
    dailyLimit: 10,
    icon: Zap,
    color: "text-blue-500",
    features: [
      "10 analyses per day",
      "All 8 languages",
      "Safety alerts",
      "7-day access",
    ],
    popular: false,
  },
  {
    id: "premium",
    name: "Premium",
    price: "$5.99",
    interval: "/month",
    dailyLimit: 40,
    icon: Crown,
    color: "text-purple-500",
    features: [
      "40 analyses per day",
      "Save unlimited answers",
      "All 8 languages",
      "Priority support",
    ],
    popular: true,
  },
  {
    id: "pro",
    name: "Pro",
    price: "$12.99",
    interval: "/month",
    dailyLimit: 75,
    icon: Trophy,
    color: "text-amber-500",
    features: [
      "75 analyses per day",
      "Save unlimited answers",
      "Priority support",
      "Advanced features",
    ],
    popular: false,
  },
  {
    id: "annual",
    name: "Annual",
    price: "$99.99",
    interval: "/year",
    dailyLimit: 75,
    icon: Star,
    color: "text-green-500",
    features: [
      "75 analyses per day",
      "Save unlimited answers",
      "Best value - save $44",
      "1 year access",
    ],
    popular: false,
  },
];

export default function SubscriptionPurchase({
  onSubscribe,
  onClose,
}: SubscriptionPurchaseProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="w-full max-w-6xl py-8">
        <Card className="p-8 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-4xl font-bold">Choose Your Plan</h2>
            <p className="text-xl text-muted-foreground">
              Select the plan that fits your needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SUBSCRIPTION_TIERS.map((tier) => {
              const Icon = tier.icon;
              return (
                <Card
                  key={tier.id}
                  className={`p-6 space-y-6 relative ${
                    tier.popular ? "border-2 border-primary" : ""
                  }`}
                  data-testid={`card-tier-${tier.id}`}
                >
                  {tier.popular && (
                    <Badge
                      className="absolute -top-3 left-1/2 -translate-x-1/2"
                      data-testid="badge-popular"
                    >
                      Most Popular
                    </Badge>
                  )}

                  <div className="space-y-4">
                    <div className={`h-12 w-12 rounded-full bg-card flex items-center justify-center border ${tier.color}`}>
                      <Icon className={`h-7 w-7 ${tier.color}`} />
                    </div>

                    <div>
                      <h3 className="text-2xl font-bold">{tier.name}</h3>
                      <div className="flex items-baseline gap-1 mt-2">
                        <span className="text-3xl font-bold">{tier.price}</span>
                        <span className="text-lg text-muted-foreground">
                          {tier.interval}
                        </span>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <p className="text-sm font-semibold text-muted-foreground mb-3">
                        {tier.dailyLimit} analyses/day
                      </p>
                      <ul className="space-y-2">
                        {tier.features.map((feature, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-2 text-sm"
                            data-testid={`feature-${tier.id}-${index}`}
                          >
                            <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <Check className="h-3 w-3 text-primary" />
                            </div>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <Button
                    size="lg"
                    onClick={() => onSubscribe(tier.id)}
                    variant={tier.popular ? "default" : "outline"}
                    className="w-full"
                    data-testid={`button-subscribe-${tier.id}`}
                  >
                    Subscribe
                  </Button>
                </Card>
              );
            })}
          </div>

          <div className="flex justify-center pt-4">
            <Button
              size="lg"
              variant="ghost"
              onClick={onClose}
              className="min-w-48"
              data-testid="button-close-subscription"
            >
              Not Now
            </Button>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            All subscriptions managed through Apple App Store. Cancel anytime
            from your iOS device settings.
          </p>
        </Card>
      </div>
    </div>
  );
}
