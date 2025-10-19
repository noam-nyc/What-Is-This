import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import bcrypt from "bcrypt";
import { insertUserSchema } from "@shared/schema";
import type { AuthenticatedRequest } from "./types";
import { 
  openai, 
  calculateTokenCost, 
  calculateTokensFromCost, 
  SYSTEM_PROMPTS,
  type AnalysisResult 
} from "./openai";
import { getDailyLimit, shouldResetDailyLimit, getMidnightUTC, getNextMidnightUTC, type SubscriptionTier } from "./iap-config";

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

  // POST /api/auth/forgot-password - Request password reset
  app.post("/api/auth/forgot-password", async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      const user = await storage.getUserByEmail(email);
      
      // Always return success to prevent email enumeration
      // But only send email if user exists
      if (user) {
        // Generate reset token (crypto random string)
        const crypto = await import("crypto");
        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

        // Save reset token to user
        await storage.updateUser(user.id, {
          resetToken,
          resetTokenExpiry,
        });

        // Send password reset email
        const { sendPasswordResetEmail } = await import("./email");
        await sendPasswordResetEmail(email, resetToken, user.email);
      }

      // Always return success message
      res.json({ 
        message: "If an account exists with that email, a password reset link has been sent" 
      });
    } catch (error) {
      console.error("Forgot password error:", error);
      res.status(500).json({ message: "Failed to process password reset request" });
    }
  });

  // POST /api/auth/reset-password - Reset password with token
  app.post("/api/auth/reset-password", async (req: Request, res: Response) => {
    try {
      const { token, newPassword } = req.body;

      if (!token || !newPassword) {
        return res.status(400).json({ message: "Token and new password are required" });
      }

      if (newPassword.length < 8) {
        return res.status(400).json({ message: "Password must be at least 8 characters" });
      }

      // Find user by reset token
      const user = await storage.getUserByResetToken(token);

      if (!user || !user.resetTokenExpiry) {
        return res.status(400).json({ message: "Invalid or expired reset token" });
      }

      // Check if token is expired
      if (new Date() > new Date(user.resetTokenExpiry)) {
        return res.status(400).json({ message: "Reset token has expired" });
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update user password and clear reset token
      await storage.updateUser(user.id, {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      });

      res.json({ message: "Password reset successful" });
    } catch (error) {
      console.error("Reset password error:", error);
      res.status(500).json({ message: "Failed to reset password" });
    }
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
      const { email, phone, address, preferredLanguage, currentPassword, newPassword } = req.body;

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

      // Update phone, address, and language
      if (phone !== undefined) updates.phone = phone;
      if (address !== undefined) updates.address = address;
      if (preferredLanguage !== undefined) {
        const validLanguages = ['en', 'es', 'zh', 'fr', 'de', 'pt', 'ja', 'ko'];
        if (validLanguages.includes(preferredLanguage)) {
          updates.preferredLanguage = preferredLanguage;
        }
      }

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

  // DELETE /api/auth/account - Delete user account (GDPR requirement)
  app.delete("/api/auth/account", requireAuth, async (req: Request, res: Response) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const { password } = req.body;

      if (!password) {
        return res.status(400).json({ message: "Password confirmation required" });
      }

      const user = await storage.getUser(authReq.session.userId!);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Verify password before deletion
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ message: "Incorrect password" });
      }

      // Delete all user data
      const deleted = await storage.deleteUser(user.id);
      if (!deleted) {
        return res.status(500).json({ message: "Failed to delete account" });
      }

      // Destroy session
      authReq.session.destroy((err: any) => {
        if (err) {
          console.error("Session destruction error:", err);
        }
      });

      res.json({ message: "Account deleted successfully" });
    } catch (error) {
      console.error("Delete account error:", error);
      res.status(500).json({ message: "Failed to delete account" });
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

  // Saved Answers Routes

  // GET /api/saved-answers - Get user's saved answers
  app.get("/api/saved-answers", requireAuth, async (req: Request, res: Response) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const answers = await storage.getSavedAnswersByUser(authReq.session.userId!);
      res.json({ answers });
    } catch (error) {
      console.error("Get saved answers error:", error);
      res.status(500).json({ message: "Failed to get saved answers" });
    }
  });

  // POST /api/saved-answers - Save an answer (premium only)
  app.post("/api/saved-answers", requireAuth, async (req: Request, res: Response) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const { title, preview, type, data, imageUrl } = req.body;

      if (!title || !data) {
        return res.status(400).json({ message: "Title and data required" });
      }

      // Check if user has premium subscription
      const subscription = await storage.getActiveSubscription(authReq.session.userId!);
      const isPremium = subscription && subscription.status === 'active';

      if (!isPremium) {
        return res.status(403).json({ 
          message: "Premium subscription required to save answers" 
        });
      }

      // Save the answer
      const savedAnswer = await storage.createSavedAnswer({
        userId: authReq.session.userId!,
        type: type || "product",
        title,
        preview: preview || null,
        data,
        imageUrl: imageUrl || null,
      });

      res.status(201).json({ savedAnswer });
    } catch (error) {
      console.error("Save answer error:", error);
      res.status(500).json({ message: "Failed to save answer" });
    }
  });

  // DELETE /api/saved-answers/:id - Delete a saved answer
  app.delete("/api/saved-answers/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const { id } = req.params;

      // Delete the answer (storage layer handles ownership check)
      const deleted = await storage.deleteSavedAnswer(id, authReq.session.userId!);
      
      if (!deleted) {
        return res.status(404).json({ message: "Saved answer not found or not authorized" });
      }
      
      res.json({ message: "Answer deleted successfully" });
    } catch (error) {
      console.error("Delete saved answer error:", error);
      res.status(500).json({ message: "Failed to delete answer" });
    }
  });

  // OpenAI Vision Analysis Routes

  // POST /api/analyze - Analyze image with OpenAI Vision
  app.post("/api/analyze", requireAuth, async (req: Request, res: Response) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const { imageUrl, imageBase64, language = "en" } = req.body;

      if (!imageUrl && !imageBase64) {
        return res.status(400).json({ message: "Image URL or base64 data required" });
      }

      let user = await storage.getUser(authReq.session.userId!);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check and reset daily limit if needed
      if (shouldResetDailyLimit(user.dailyLimitResetDate)) {
        await storage.updateUser(user.id, {
          dailyAnalysisCount: 0,
          dailyLimitResetDate: getMidnightUTC(),
        });
        // Refresh user object
        user = await storage.getUser(user.id);
        if (!user) {
          return res.status(500).json({ message: "Failed to refresh user data" });
        }
      }

      // Check daily limit based on subscription tier (default to free if invalid)
      const userTier = (user.subscriptionTier || "free") as SubscriptionTier;
      const dailyLimit = getDailyLimit(userTier);
      if (user.dailyAnalysisCount >= dailyLimit) {
        return res.status(429).json({ 
          message: "Daily analysis limit reached",
          dailyLimit,
          currentCount: user.dailyAnalysisCount,
          subscriptionTier: user.subscriptionTier,
          resetsAt: getNextMidnightUTC().toISOString(),
        });
      }

      // Prepare image content for OpenAI
      const imageContent = imageUrl 
        ? { type: "image_url" as const, image_url: { url: imageUrl } }
        : { type: "image_url" as const, image_url: { url: `data:image/jpeg;base64,${imageBase64}` } };

      // Step 1: Detailed Content Analysis
      const contentResponse = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: SYSTEM_PROMPTS.general },
          { role: "user", content: [
            { type: "text", text: `Analyze this image and provide detailed information. Respond in ${language === "en" ? "English" : language}.` },
            imageContent,
          ]},
        ],
        max_tokens: 1500,
        response_format: { type: "json_object" },
      });

      const generalAnalysis: AnalysisResult = JSON.parse(
        contentResponse.choices[0].message.content || "{}"
      );

      // Step 3: Content-specific analysis based on detected type
      let detailedAnalysis: AnalysisResult = generalAnalysis;
      let detailedResponse;

      if (generalAnalysis.contentType === "product") {
        detailedResponse = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            { role: "system", content: SYSTEM_PROMPTS.product },
            { role: "user", content: [
              { type: "text", text: `Provide detailed product information. Respond in ${language === "en" ? "English" : language}.` },
              imageContent,
            ]},
          ],
          max_tokens: 1000,
          response_format: { type: "json_object" },
        });
        detailedAnalysis = { ...generalAnalysis, ...JSON.parse(detailedResponse.choices[0].message.content || "{}") };
      } else if (generalAnalysis.contentType === "document") {
        detailedResponse = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            { role: "system", content: SYSTEM_PROMPTS.document },
            { role: "user", content: [
              { type: "text", text: `Read and explain this document. Respond in ${language === "en" ? "English" : language}.` },
              imageContent,
            ]},
          ],
          max_tokens: 1500,
          response_format: { type: "json_object" },
        });
        detailedAnalysis = { ...generalAnalysis, ...JSON.parse(detailedResponse.choices[0].message.content || "{}") };
      } else if (generalAnalysis.contentType === "food") {
        detailedResponse = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            { role: "system", content: SYSTEM_PROMPTS.food },
            { role: "user", content: [
              { type: "text", text: `Provide food and recipe information. Respond in ${language === "en" ? "English" : language}.` },
              imageContent,
            ]},
          ],
          max_tokens: 1500,
          response_format: { type: "json_object" },
        });
        detailedAnalysis = { ...generalAnalysis, ...JSON.parse(detailedResponse.choices[0].message.content || "{}") };
      }

      // Calculate total token usage
      const totalInputTokens = 
        (contentResponse.usage?.prompt_tokens || 0) +
        (detailedResponse?.usage?.prompt_tokens || 0);

      const totalOutputTokens = 
        (contentResponse.usage?.completion_tokens || 0) +
        (detailedResponse?.usage?.completion_tokens || 0);

      const totalTokens = totalInputTokens + totalOutputTokens;
      const costUsd = calculateTokenCost(totalInputTokens, totalOutputTokens);
      const tokensToDeduct = calculateTokensFromCost(costUsd);

      // Check if user can afford this
      const subscription = await storage.getActiveSubscription(user.id);
      const isPremium = subscription && subscription.status === 'active';

      let paymentMethod: "free" | "tokens" | "premium" = "premium";

      if (!isPremium) {
        if (user.freeAnswersRemaining > 0) {
          // Use free answer
          await storage.updateUser(user.id, {
            freeAnswersRemaining: user.freeAnswersRemaining - 1,
          });
          paymentMethod = "free";
        } else if (user.tokenBalance >= tokensToDeduct) {
          // Use tokens
          await storage.updateUser(user.id, {
            tokenBalance: user.tokenBalance - tokensToDeduct,
          });
          paymentMethod = "tokens";
        } else {
          // Log failed attempt due to insufficient balance
          await storage.createUsageLog({
            userId: user.id,
            action: "analyze_image_failed",
            tokensUsed: totalTokens,
            cost: costUsd.toFixed(4),
          });

          return res.status(402).json({ 
            message: "Insufficient tokens or free answers",
            requiredTokens: tokensToDeduct,
            currentBalance: user.tokenBalance,
            freeAnswersRemaining: user.freeAnswersRemaining,
          });
        }
      }

      // Log successful usage
      await storage.createUsageLog({
        userId: user.id,
        action: "analyze_image",
        tokensUsed: totalTokens,
        cost: costUsd.toFixed(4),
      });

      // Increment daily analysis count (use refreshed user count to avoid race conditions)
      const refreshedUser = await storage.getUser(user.id);
      if (refreshedUser) {
        await storage.updateUser(user.id, {
          dailyAnalysisCount: refreshedUser.dailyAnalysisCount + 1,
        });
      }

      // Return analysis results
      res.json({
        analysis: detailedAnalysis,
        usage: {
          inputTokens: totalInputTokens,
          outputTokens: totalOutputTokens,
          totalTokens,
          costUsd,
          tokensDeducted: paymentMethod === "tokens" ? tokensToDeduct : 0,
          paymentMethod,
          remainingBalance: paymentMethod === "tokens" 
            ? user.tokenBalance - tokensToDeduct 
            : user.tokenBalance,
          freeAnswersRemaining: paymentMethod === "free"
            ? user.freeAnswersRemaining - 1
            : user.freeAnswersRemaining,
        },
      });
    } catch (error: any) {
      console.error("Analysis error:", error);
      
      // Log failed usage
      const authReq = req as AuthenticatedRequest;
      if (authReq.session.userId) {
        await storage.createUsageLog({
          userId: authReq.session.userId,
          action: "analyze_image_error",
          tokensUsed: 0,
          cost: "0",
        });
      }

      res.status(500).json({ 
        message: "Failed to analyze image",
        error: error.message 
      });
    }
  });

  // Apple In-App Purchase Routes

  // POST /api/iap/validate-receipt - Validate Apple IAP receipt and update subscription
  app.post("/api/iap/validate-receipt", requireAuth, async (req: Request, res: Response) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const { receiptData, transactionId, originalTransactionId, productId } = req.body;

      if (!receiptData || !transactionId || !productId) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const user = await storage.getUser(authReq.session.userId!);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Map Apple product IDs to subscription tiers
      const productTierMap: Record<string, SubscriptionTier> = {
        "com.whatisthis.weekly": "weekly",
        "com.whatisthis.premium": "premium",
        "com.whatisthis.pro": "pro",
        "com.whatisthis.annual": "annual",
      };

      const tier = productTierMap[productId];
      if (!tier) {
        return res.status(400).json({ message: "Invalid product ID" });
      }

      // Check for existing subscription with this transaction ID
      const existingSubscription = await storage.getSubscriptionByAppleTransactionId(
        originalTransactionId || transactionId
      );

      if (existingSubscription) {
        return res.json({ 
          message: "Receipt already processed",
          subscription: existingSubscription 
        });
      }

      // Create or update subscription
      const periodEnd = new Date();
      if (tier === "weekly") {
        periodEnd.setDate(periodEnd.getDate() + 7);
      } else if (tier === "annual") {
        periodEnd.setFullYear(periodEnd.getFullYear() + 1);
      } else {
        periodEnd.setMonth(periodEnd.getMonth() + 1);
      }

      await storage.createSubscription({
        userId: user.id,
        status: "active",
        plan: tier,
        currentPeriodStart: new Date(),
        currentPeriodEnd: periodEnd,
        appleTransactionId: transactionId,
        appleOriginalTransactionId: originalTransactionId || transactionId,
        appleReceiptData: receiptData,
      });

      // Update user's subscription tier
      await storage.updateUser(user.id, {
        subscriptionTier: tier,
        dailyAnalysisCount: 0,
        dailyLimitResetDate: getMidnightUTC(),
      });

      res.json({ 
        message: "Subscription activated successfully",
        tier,
        dailyLimit: getDailyLimit(tier),
      });
    } catch (error) {
      console.error("IAP validation error:", error);
      res.status(500).json({ message: "Failed to validate receipt" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
