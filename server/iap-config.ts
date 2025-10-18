// Apple In-App Purchase Configuration
// iOS subscription tiers and daily limits

export const SUBSCRIPTION_TIERS = {
  free: {
    name: "Free",
    price: 0,
    interval: "lifetime",
    dailyLimit: 999, // No daily limit for free tier, only monthly
    monthlyLimit: 3, // 3 analyses per month total
    features: ["3 analyses per month", "All languages supported", "Safety alerts"],
  },
  weekly: {
    name: "Weekly",
    price: 2.99,
    interval: "week",
    dailyLimit: 10,
    monthlyLimit: null, // unlimited monthly, just daily cap
    features: ["10 analyses per day", "All languages", "Safety alerts", "Priority support"],
  },
  premium: {
    name: "Premium",
    price: 5.99,
    interval: "month",
    dailyLimit: 40,
    monthlyLimit: null,
    features: ["40 analyses per day", "Save answers", "All languages", "Priority support"],
  },
  pro: {
    name: "Pro",
    price: 12.99,
    interval: "month",
    dailyLimit: 75,
    monthlyLimit: null,
    features: ["75 analyses per day", "Save answers", "All languages", "Priority support", "Advanced features"],
  },
  annual: {
    name: "Annual",
    price: 99.99,
    interval: "year",
    dailyLimit: 75,
    monthlyLimit: null,
    features: ["75 analyses per day", "Save answers", "All languages", "Priority support", "Advanced features", "Best value"],
  },
} as const;

export type SubscriptionTier = keyof typeof SUBSCRIPTION_TIERS;

// Helper function to get daily limit for a tier
export function getDailyLimit(tier: SubscriptionTier): number {
  return SUBSCRIPTION_TIERS[tier].dailyLimit;
}

// Helper function to check if daily limit should reset
export function shouldResetDailyLimit(lastResetDate: Date | null | undefined): boolean {
  if (!lastResetDate) return true;
  
  const now = new Date();
  const lastReset = new Date(lastResetDate);
  
  // Reset if it's a different day (UTC)
  return (
    now.getUTCFullYear() !== lastReset.getUTCFullYear() ||
    now.getUTCMonth() !== lastReset.getUTCMonth() ||
    now.getUTCDate() !== lastReset.getUTCDate()
  );
}

// Helper function to get midnight UTC for today
export function getMidnightUTC(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0));
}

// Helper function to get next midnight UTC
export function getNextMidnightUTC(): Date {
  const midnight = getMidnightUTC();
  midnight.setUTCDate(midnight.getUTCDate() + 1);
  return midnight;
}
