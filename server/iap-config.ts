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
  daily: {
    name: "Daily",
    price: 0.49,
    interval: "day",
    dailyLimit: 10,
    monthlyLimit: null, // unlimited monthly, just daily cap
    features: ["10 analyses per day", "All languages", "Safety alerts", "Premium intents"],
  },
  weekly: {
    name: "Weekly",
    price: 2.99,
    interval: "week",
    dailyLimit: 10,
    monthlyLimit: null, // unlimited monthly, just daily cap
    features: ["10 analyses per day", "All languages", "Safety alerts", "Premium intents", "Save answers"],
  },
  premium: {
    name: "Monthly",
    price: 12.99,
    interval: "month",
    dailyLimit: 10,
    monthlyLimit: null,
    features: ["10 analyses per day", "Save answers", "All languages", "Premium intents", "Priority support"],
  },
  pro: {
    name: "Pro",
    price: 25.99,
    interval: "month",
    dailyLimit: 20,
    monthlyLimit: null,
    features: ["20 analyses per day", "Save answers", "All languages", "Premium intents", "Priority support", "Advanced features"],
  },
  annual: {
    name: "Annual",
    price: 144.99,
    interval: "year",
    dailyLimit: 10,
    monthlyLimit: null,
    features: ["10 analyses per day", "Save answers", "All languages", "Premium intents", "Priority support", "Best value"],
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
