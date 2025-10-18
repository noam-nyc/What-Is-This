import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean, jsonb, decimal } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table - stores user account information
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  phone: text("phone"),
  address: text("address"),
  tokenBalance: integer("token_balance").notNull().default(0),
  freeAnswersRemaining: integer("free_answers_remaining").notNull().default(3),
  lastFreeAnswerReset: timestamp("last_free_answer_reset").defaultNow(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Subscriptions table - tracks premium subscriptions
export const subscriptions = pgTable("subscriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  stripeSubscriptionId: text("stripe_subscription_id").unique(),
  stripeCustomerId: text("stripe_customer_id"),
  status: text("status").notNull().default("inactive"), // active, canceled, past_due, etc.
  plan: text("plan").notNull().default("premium"), // premium ($4.99/month)
  currentPeriodStart: timestamp("current_period_start"),
  currentPeriodEnd: timestamp("current_period_end"),
  cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Token purchases table - tracks token purchase history
export const tokenPurchases = pgTable("token_purchases", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  stripePaymentIntentId: text("stripe_payment_intent_id").unique(),
  tokensAdded: integer("tokens_added").notNull(),
  amountPaid: decimal("amount_paid", { precision: 10, scale: 2 }).notNull(), // in USD
  status: text("status").notNull().default("pending"), // pending, completed, failed
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Saved answers table - stores user's saved explanations (premium only)
export const savedAnswers = pgTable("saved_answers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  type: text("type").notNull(), // product, document, food
  title: text("title").notNull(),
  preview: text("preview"),
  data: jsonb("data").notNull(), // full explanation data
  imageUrl: text("image_url"), // optional - could store image URLs
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Usage logs table - tracks API usage for analytics
export const usageLogs = pgTable("usage_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  action: text("action").notNull(), // analyze_image, ask_question, etc.
  contentType: text("content_type"), // product, document, food
  tokensUsed: integer("tokens_used").default(0),
  openaiTokens: integer("openai_tokens").default(0), // actual OpenAI tokens
  cost: decimal("cost", { precision: 10, scale: 4 }).default("0"), // actual cost in USD
  wasFree: boolean("was_free").default(false), // used free answer
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  subscriptions: many(subscriptions),
  tokenPurchases: many(tokenPurchases),
  savedAnswers: many(savedAnswers),
  usageLogs: many(usageLogs),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(users, {
    fields: [subscriptions.userId],
    references: [users.id],
  }),
}));

export const tokenPurchasesRelations = relations(tokenPurchases, ({ one }) => ({
  user: one(users, {
    fields: [tokenPurchases.userId],
    references: [users.id],
  }),
}));

export const savedAnswersRelations = relations(savedAnswers, ({ one }) => ({
  user: one(users, {
    fields: [savedAnswers.userId],
    references: [users.id],
  }),
}));

export const usageLogsRelations = relations(usageLogs, ({ one }) => ({
  user: one(users, {
    fields: [usageLogs.userId],
    references: [users.id],
  }),
}));

// Insert schemas for validation
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  tokenBalance: true,
  freeAnswersRemaining: true,
  lastFreeAnswerReset: true,
  createdAt: true,
});

export const insertSubscriptionSchema = createInsertSchema(subscriptions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTokenPurchaseSchema = createInsertSchema(tokenPurchases).omit({
  id: true,
  createdAt: true,
});

export const insertSavedAnswerSchema = createInsertSchema(savedAnswers).omit({
  id: true,
  createdAt: true,
});

export const insertUsageLogSchema = createInsertSchema(usageLogs).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;

export type TokenPurchase = typeof tokenPurchases.$inferSelect;
export type InsertTokenPurchase = z.infer<typeof insertTokenPurchaseSchema>;

export type SavedAnswer = typeof savedAnswers.$inferSelect;
export type InsertSavedAnswer = z.infer<typeof insertSavedAnswerSchema>;

export type UsageLog = typeof usageLogs.$inferSelect;
export type InsertUsageLog = z.infer<typeof insertUsageLogSchema>;
