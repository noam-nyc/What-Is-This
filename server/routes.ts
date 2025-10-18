import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import bcrypt from "bcrypt";
import { insertUserSchema } from "@shared/schema";
import type { AuthenticatedRequest } from "./types";
import { stripe, TOKEN_PACKAGES, PREMIUM_SUBSCRIPTION } from "./stripe";
import Stripe from "stripe";

// Middleware to check if user is authenticated
function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authReq = req as AuthenticatedRequest;
  if (!authReq.session.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  
  // POST /api/auth/register - Create new user account
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const { email, password, phone, address } = req.body;

      // Validate input
      const validation = insertUserSchema.safeParse({ email, password, phone, address });
      if (!validation.success) {
        return res.status(400).json({ 
          message: "Invalid input",
          errors: validation.error.errors 
        });
      }

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "Email already registered" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = await storage.createUser({
        email,
        password: hashedPassword,
        phone: phone || null,
        address: address || null,
      });

      // Create session
      const authReq = req as AuthenticatedRequest;
      authReq.session.userId = user.id;

      // Return user (without password)
      const { password: _, ...userWithoutPassword } = user;
      res.status(201).json({ user: userWithoutPassword });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Failed to register user" });
    }
  });

  // POST /api/auth/login - Login with email and password
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Email and password required" });
      }

      // Get user by email
      let user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Check password
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Check if free answers need to be reset (monthly)
      const now = new Date();
      const lastReset = user.lastFreeAnswerReset ? new Date(user.lastFreeAnswerReset) : null;
      const shouldReset = !lastReset || 
        lastReset.getMonth() !== now.getMonth() || 
        lastReset.getFullYear() !== now.getFullYear();

      if (shouldReset) {
        await storage.updateUserFreeAnswers(user.id, 3);
        // Refetch user to get updated free answer count
        const updatedUser = await storage.getUser(user.id);
        if (updatedUser) {
          user = updatedUser;
        }
      }

      // Create session
      const authReq = req as AuthenticatedRequest;
      authReq.session.userId = user.id;

      // Return user (without password)
      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Failed to login" });
    }
  });

  // POST /api/auth/logout - Logout current user
  app.post("/api/auth/logout", requireAuth, async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    authReq.session.destroy((err: any) => {
      if (err) {
        return res.status(500).json({ message: "Failed to logout" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  // GET /api/auth/user - Get current authenticated user
  app.get("/api/auth/user", requireAuth, async (req: Request, res: Response) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const user = await storage.getUser(authReq.session.userId!);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Return user (without password)
      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  // PUT /api/auth/profile - Update user profile
  app.put("/api/auth/profile", requireAuth, async (req: Request, res: Response) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const { email, phone, address, currentPassword, newPassword } = req.body;

      const user = await storage.getUser(authReq.session.userId!);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const updates: any = {};

      // Update email (if provided and different)
      if (email && email !== user.email) {
        const existingUser = await storage.getUserByEmail(email);
        if (existingUser) {
          return res.status(400).json({ message: "Email already in use" });
        }
        updates.email = email;
      }

      // Update phone and address
      if (phone !== undefined) updates.phone = phone;
      if (address !== undefined) updates.address = address;

      // Update password (if provided)
      if (newPassword) {
        if (!currentPassword) {
          return res.status(400).json({ message: "Current password required" });
        }

        const validPassword = await bcrypt.compare(currentPassword, user.password);
        if (!validPassword) {
          return res.status(401).json({ message: "Current password is incorrect" });
        }

        updates.password = await bcrypt.hash(newPassword, 10);
      }

      // Update user
      const updatedUser = await storage.updateUser(user.id, updates);
      if (!updatedUser) {
        return res.status(500).json({ message: "Failed to update profile" });
      }

      // Return updated user (without password)
      const { password: _, ...userWithoutPassword } = updatedUser;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      console.error("Update profile error:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  // Token & Subscription Management Routes

  // GET /api/tokens/balance - Get current token balance
  app.get("/api/tokens/balance", requireAuth, async (req: Request, res: Response) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const user = await storage.getUser(authReq.session.userId!);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ 
        balance: user.tokenBalance,
        freeAnswersRemaining: user.freeAnswersRemaining 
      });
    } catch (error) {
      console.error("Get token balance error:", error);
      res.status(500).json({ message: "Failed to get token balance" });
    }
  });

  // GET /api/tokens/purchases - Get token purchase history
  app.get("/api/tokens/purchases", requireAuth, async (req: Request, res: Response) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const purchases = await storage.getTokenPurchasesByUser(authReq.session.userId!);
      res.json({ purchases });
    } catch (error) {
      console.error("Get token purchases error:", error);
      res.status(500).json({ message: "Failed to get token purchases" });
    }
  });

  // POST /api/tokens/deduct - Deduct tokens from user balance
  app.post("/api/tokens/deduct", requireAuth, async (req: Request, res: Response) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const { amount } = req.body;

      if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Invalid token amount" });
      }

      const user = await storage.getUser(authReq.session.userId!);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.tokenBalance < amount) {
        return res.status(400).json({ message: "Insufficient token balance" });
      }

      const updatedUser = await storage.updateUser(user.id, { 
        tokenBalance: user.tokenBalance - amount 
      });

      res.json({ balance: updatedUser?.tokenBalance || 0 });
    } catch (error) {
      console.error("Deduct tokens error:", error);
      res.status(500).json({ message: "Failed to deduct tokens" });
    }
  });

  // GET /api/subscription - Get current subscription
  app.get("/api/subscription", requireAuth, async (req: Request, res: Response) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const subscription = await storage.getActiveSubscription(authReq.session.userId!);
      
      if (!subscription) {
        return res.json({ subscription: null, isPremium: false });
      }

      res.json({ 
        subscription,
        isPremium: subscription.status === 'active' 
      });
    } catch (error) {
      console.error("Get subscription error:", error);
      res.status(500).json({ message: "Failed to get subscription" });
    }
  });

  // GET /api/subscription/check-premium - Check if user has premium
  app.get("/api/subscription/check-premium", requireAuth, async (req: Request, res: Response) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const subscription = await storage.getActiveSubscription(authReq.session.userId!);
      
      const isPremium = subscription && subscription.status === 'active';
      res.json({ isPremium });
    } catch (error) {
      console.error("Check premium error:", error);
      res.status(500).json({ message: "Failed to check premium status" });
    }
  });

  // Stripe Checkout & Payment Routes

  // POST /api/stripe/create-token-checkout - Create checkout session for token purchase
  app.post("/api/stripe/create-token-checkout", requireAuth, async (req: Request, res: Response) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const { packageId } = req.body;

      const pkg = TOKEN_PACKAGES.find(p => p.id === packageId);
      if (!pkg) {
        return res.status(400).json({ message: "Invalid package ID" });
      }

      const user = await storage.getUser(authReq.session.userId!);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Create Stripe checkout session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: pkg.name,
                description: `${pkg.tokens.toLocaleString()} tokens for Xplain This`,
              },
              unit_amount: pkg.price,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${process.env.REPLIT_DEV_DOMAIN || "http://localhost:5000"}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.REPLIT_DEV_DOMAIN || "http://localhost:5000"}/`,
        metadata: {
          userId: user.id,
          packageId: pkg.id,
          tokens: pkg.tokens.toString(),
        },
      });

      res.json({ sessionId: session.id, url: session.url });
    } catch (error) {
      console.error("Create token checkout error:", error);
      res.status(500).json({ message: "Failed to create checkout session" });
    }
  });

  // POST /api/stripe/create-subscription-checkout - Create checkout session for premium subscription
  app.post("/api/stripe/create-subscription-checkout", requireAuth, async (req: Request, res: Response) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const user = await storage.getUser(authReq.session.userId!);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if user already has an active subscription
      const existingSubscription = await storage.getActiveSubscription(user.id);
      if (existingSubscription) {
        return res.status(400).json({ message: "User already has an active subscription" });
      }

      // Create Stripe checkout session for subscription
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: PREMIUM_SUBSCRIPTION.name,
                description: "Unlimited answer saving and priority support",
              },
              unit_amount: PREMIUM_SUBSCRIPTION.price,
              recurring: {
                interval: PREMIUM_SUBSCRIPTION.interval,
              },
            },
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: `${process.env.REPLIT_DEV_DOMAIN || "http://localhost:5000"}/subscription-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.REPLIT_DEV_DOMAIN || "http://localhost:5000"}/`,
        metadata: {
          userId: user.id,
        },
      });

      res.json({ sessionId: session.id, url: session.url });
    } catch (error) {
      console.error("Create subscription checkout error:", error);
      res.status(500).json({ message: "Failed to create subscription checkout" });
    }
  });

  // POST /api/stripe/webhook - Handle Stripe webhooks
  app.post("/api/stripe/webhook", async (req: Request, res: Response) => {
    const sig = req.headers["stripe-signature"];

    if (!sig) {
      return res.status(400).send("Missing stripe-signature header");
    }

    let event: Stripe.Event;

    try {
      // For webhook verification, we need the raw body
      // This is handled by express.raw() middleware in index.ts for this route
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
      
      if (webhookSecret) {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
      } else {
        // For development without webhook secret
        event = JSON.parse(req.body.toString());
      }
    } catch (err: any) {
      console.error("Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
      // Handle the event
      switch (event.type) {
        case "checkout.session.completed": {
          const session = event.data.object as Stripe.Checkout.Session;
          
          if (session.mode === "payment") {
            // Token purchase completed
            const userId = session.metadata?.userId;
            const packageId = session.metadata?.packageId;
            const tokens = parseInt(session.metadata?.tokens || "0");
            const paymentIntentId = session.payment_intent as string || session.id;

            if (!userId || !packageId || !tokens) {
              console.error("Missing metadata in checkout session");
              break;
            }

            // Check for idempotency - don't process duplicate webhooks
            const existingPurchase = await storage.getTokenPurchaseByStripeId(paymentIntentId);
            if (existingPurchase) {
              console.log(`Payment ${paymentIntentId} already processed, skipping`);
              break;
            }

            const pkg = TOKEN_PACKAGES.find(p => p.id === packageId);
            if (!pkg) {
              console.error("Invalid package ID in metadata");
              break;
            }

            // Record token purchase
            await storage.createTokenPurchase({
              userId,
              amount: tokens,
              priceUsd: pkg.price / 100,
              stripePaymentIntentId: paymentIntentId,
            });

            // Add tokens to user balance
            const user = await storage.getUser(userId);
            if (user) {
              await storage.updateUser(userId, {
                tokenBalance: user.tokenBalance + tokens,
              });
            }

            console.log(`Token purchase completed for user ${userId}: ${tokens} tokens`);
          } else if (session.mode === "subscription") {
            // Subscription created
            const userId = session.metadata?.userId;
            const subscriptionId = session.subscription as string;

            if (!userId || !subscriptionId) {
              console.error("Missing metadata in subscription session");
              break;
            }

            // Check for idempotency - don't process duplicate webhooks
            const existingSubscription = await storage.getSubscriptionByStripeId(subscriptionId);
            if (existingSubscription) {
              console.log(`Subscription ${subscriptionId} already created, skipping`);
              break;
            }

            // Fetch the actual subscription from Stripe to get accurate period data
            const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId);

            // Create subscription record with accurate period data
            await storage.createSubscription({
              userId,
              stripeSubscriptionId: subscriptionId,
              status: stripeSubscription.status as "active" | "canceled" | "past_due" | "trialing" | "incomplete",
              plan: "premium_monthly",
              currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
              currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
            });

            console.log(`Subscription created for user ${userId} (${stripeSubscription.status})`);
          }
          break;
        }

        case "customer.subscription.updated": {
          const subscription = event.data.object as Stripe.Subscription;
          
          // Update subscription status
          const dbSubscription = await storage.getSubscriptionByStripeId(subscription.id);
          if (dbSubscription) {
            await storage.updateSubscription(dbSubscription.id, {
              status: subscription.status as "active" | "canceled" | "past_due" | "trialing" | "incomplete",
              currentPeriodStart: new Date(subscription.current_period_start * 1000),
              currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            });
            console.log(`Subscription ${subscription.id} updated to status: ${subscription.status}`);
          }
          break;
        }

        case "customer.subscription.deleted": {
          const subscription = event.data.object as Stripe.Subscription;
          
          // Cancel subscription
          const dbSubscription = await storage.getSubscriptionByStripeId(subscription.id);
          if (dbSubscription) {
            await storage.updateSubscription(dbSubscription.id, {
              status: "canceled",
            });
            console.log(`Subscription ${subscription.id} canceled`);
          }
          break;
        }

        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      res.json({ received: true });
    } catch (error) {
      console.error("Webhook handler error:", error);
      res.status(500).json({ message: "Webhook handler failed" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
