import { 
  type User, 
  type InsertUser,
  type Subscription,
  type InsertSubscription,
  type TokenPurchase,
  type InsertTokenPurchase,
  type SavedAnswer,
  type InsertSavedAnswer,
  type UsageLog,
  type InsertUsageLog,
  users,
  subscriptions,
  tokenPurchases,
  savedAnswers,
  usageLogs,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;
  updateUserTokenBalance(id: string, newBalance: number): Promise<void>;
  updateUserFreeAnswers(id: string, remaining: number): Promise<void>;
  
  // Subscription operations
  getActiveSubscription(userId: string): Promise<Subscription | undefined>;
  createSubscription(subscription: InsertSubscription): Promise<Subscription>;
  updateSubscription(id: string, updates: Partial<Subscription>): Promise<Subscription | undefined>;
  getSubscriptionByStripeId(stripeSubscriptionId: string): Promise<Subscription | undefined>;
  
  // Token purchase operations
  createTokenPurchase(purchase: InsertTokenPurchase): Promise<TokenPurchase>;
  getTokenPurchasesByUser(userId: string): Promise<TokenPurchase[]>;
  getTokenPurchaseByStripeId(stripePaymentIntentId: string): Promise<TokenPurchase | undefined>;
  updateTokenPurchaseStatus(id: string, status: string): Promise<void>;
  
  // Saved answers operations
  createSavedAnswer(answer: InsertSavedAnswer): Promise<SavedAnswer>;
  getSavedAnswersByUser(userId: string): Promise<SavedAnswer[]>;
  deleteSavedAnswer(id: string, userId: string): Promise<boolean>;
  
  // Usage logs operations
  createUsageLog(log: InsertUsageLog): Promise<UsageLog>;
  getUsageLogsByUser(userId: string, limit?: number): Promise<UsageLog[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  async updateUserTokenBalance(id: string, newBalance: number): Promise<void> {
    await db
      .update(users)
      .set({ tokenBalance: newBalance })
      .where(eq(users.id, id));
  }

  async updateUserFreeAnswers(id: string, remaining: number): Promise<void> {
    await db
      .update(users)
      .set({ 
        freeAnswersRemaining: remaining,
        lastFreeAnswerReset: new Date()
      })
      .where(eq(users.id, id));
  }

  // Subscription operations
  async getActiveSubscription(userId: string): Promise<Subscription | undefined> {
    const [subscription] = await db
      .select()
      .from(subscriptions)
      .where(
        and(
          eq(subscriptions.userId, userId),
          eq(subscriptions.status, "active")
        )
      )
      .orderBy(desc(subscriptions.createdAt));
    return subscription || undefined;
  }

  async createSubscription(insertSubscription: InsertSubscription): Promise<Subscription> {
    const [subscription] = await db
      .insert(subscriptions)
      .values(insertSubscription)
      .returning();
    return subscription;
  }

  async updateSubscription(id: string, updates: Partial<Subscription>): Promise<Subscription | undefined> {
    const [subscription] = await db
      .update(subscriptions)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(subscriptions.id, id))
      .returning();
    return subscription || undefined;
  }

  async getSubscriptionByStripeId(stripeSubscriptionId: string): Promise<Subscription | undefined> {
    const [subscription] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.stripeSubscriptionId, stripeSubscriptionId));
    return subscription || undefined;
  }

  // Token purchase operations
  async createTokenPurchase(purchase: InsertTokenPurchase): Promise<TokenPurchase> {
    const [tokenPurchase] = await db
      .insert(tokenPurchases)
      .values(purchase)
      .returning();
    return tokenPurchase;
  }

  async getTokenPurchasesByUser(userId: string): Promise<TokenPurchase[]> {
    return await db
      .select()
      .from(tokenPurchases)
      .where(eq(tokenPurchases.userId, userId))
      .orderBy(desc(tokenPurchases.createdAt));
  }

  async getTokenPurchaseByStripeId(stripePaymentIntentId: string): Promise<TokenPurchase | undefined> {
    const [purchase] = await db
      .select()
      .from(tokenPurchases)
      .where(eq(tokenPurchases.stripePaymentIntentId, stripePaymentIntentId));
    return purchase || undefined;
  }

  async updateTokenPurchaseStatus(id: string, status: string): Promise<void> {
    await db
      .update(tokenPurchases)
      .set({ status })
      .where(eq(tokenPurchases.id, id));
  }

  // Saved answers operations
  async createSavedAnswer(answer: InsertSavedAnswer): Promise<SavedAnswer> {
    const [savedAnswer] = await db
      .insert(savedAnswers)
      .values(answer)
      .returning();
    return savedAnswer;
  }

  async getSavedAnswersByUser(userId: string): Promise<SavedAnswer[]> {
    return await db
      .select()
      .from(savedAnswers)
      .where(eq(savedAnswers.userId, userId))
      .orderBy(desc(savedAnswers.createdAt));
  }

  async deleteSavedAnswer(id: string, userId: string): Promise<boolean> {
    const result = await db
      .delete(savedAnswers)
      .where(
        and(
          eq(savedAnswers.id, id),
          eq(savedAnswers.userId, userId)
        )
      )
      .returning();
    return result.length > 0;
  }

  // Usage logs operations
  async createUsageLog(log: InsertUsageLog): Promise<UsageLog> {
    const [usageLog] = await db
      .insert(usageLogs)
      .values(log)
      .returning();
    return usageLog;
  }

  async getUsageLogsByUser(userId: string, limit: number = 100): Promise<UsageLog[]> {
    return await db
      .select()
      .from(usageLogs)
      .where(eq(usageLogs.userId, userId))
      .orderBy(desc(usageLogs.createdAt))
      .limit(limit);
  }
}

export const storage = new DatabaseStorage();
