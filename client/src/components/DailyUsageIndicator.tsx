import { Activity, RefreshCw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface DailyUsageIndicatorProps {
  currentCount: number;
  dailyLimit: number;
  subscriptionTier: string;
  resetsAt?: string;
}

export default function DailyUsageIndicator({
  currentCount,
  dailyLimit,
  subscriptionTier,
  resetsAt,
}: DailyUsageIndicatorProps) {
  // Don't show for free tier (they have monthly quota, not daily)
  if (subscriptionTier === "free") {
    return null;
  }

  const percentage = (currentCount / dailyLimit) * 100;
  const remaining = Math.max(0, dailyLimit - currentCount);
  
  const tierNames: Record<string, string> = {
    weekly: "Weekly Plan",
    premium: "Premium Plan",
    pro: "Pro Plan",
    annual: "Annual Plan",
  };

  const resetTime = resetsAt ? new Date(resetsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "midnight";

  return (
    <Card className="p-4 space-y-3" data-testid="card-daily-usage">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          <span className="font-semibold text-lg">Daily Usage</span>
        </div>
        <span className="text-sm text-muted-foreground" data-testid="text-tier">
          {tierNames[subscriptionTier] || subscriptionTier}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-bold" data-testid="text-usage-count">
            {currentCount} / {dailyLimit}
          </span>
          <span className="text-sm text-muted-foreground">
            analyses today
          </span>
        </div>
        
        <Progress value={percentage} className="h-2" data-testid="progress-usage" />
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground" data-testid="text-remaining">
            {remaining} remaining
          </span>
          <div className="flex items-center gap-1 text-muted-foreground">
            <RefreshCw className="h-3 w-3" />
            <span data-testid="text-reset-time">Resets at {resetTime}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
