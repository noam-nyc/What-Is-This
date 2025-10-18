import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is required");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-09-30.acacia" as any, // Using stable Acacia release
});

// Token package pricing (100% markup on OpenAI costs)
// OpenAI GPT-4 Vision costs approximately:
// - Input: $0.01 per 1000 tokens
// - Output: $0.03 per 1000 tokens
// These packages are priced with 100% markup
export const TOKEN_PACKAGES = [
  {
    id: "package_1",
    name: "Starter Pack",
    tokens: 50000, // ~50 basic analyses
    price: 499, // $4.99 in cents
  },
  {
    id: "package_2",
    name: "Value Pack",
    tokens: 150000, // ~150 basic analyses
    price: 1299, // $12.99 in cents (13% discount)
  },
  {
    id: "package_3",
    name: "Pro Pack",
    tokens: 300000, // ~300 basic analyses
    price: 2499, // $24.99 in cents (17% discount)
  },
  {
    id: "package_4",
    name: "Ultimate Pack",
    tokens: 1000000, // ~1000 basic analyses
    price: 7999, // $79.99 in cents (20% discount)
  },
];

export const PREMIUM_SUBSCRIPTION = {
  id: "premium_monthly",
  name: "Premium Unlimited",
  price: 499, // $4.99 in cents
  interval: "month" as const,
};
