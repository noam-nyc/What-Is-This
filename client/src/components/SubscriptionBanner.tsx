import { Crown, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface SubscriptionBannerProps {
  onUpgrade: () => void;
}

export default function SubscriptionBanner({ onUpgrade }: SubscriptionBannerProps) {
  return (
    <Card className="p-6 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <Crown className="h-8 w-8 text-primary" />
          <div>
            <p className="text-xl font-semibold">Save Your Answers</p>
            <p className="text-base text-muted-foreground">
              Upgrade to Premium for $4.99/month to save unlimited answers
            </p>
          </div>
        </div>
        <Button
          size="lg"
          onClick={onUpgrade}
          className="min-h-12"
          data-testid="button-upgrade"
        >
          <Crown className="h-5 w-5 mr-2" />
          Upgrade to Premium
        </Button>
      </div>
    </Card>
  );
}
