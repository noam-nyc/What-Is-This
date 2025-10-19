import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { User, CreditCard, Coins, Package, CheckCircle2, LogOut, ShoppingCart } from "lucide-react";
import type { User as UserType } from "@shared/schema";
import LanguageSelector from "@/components/LanguageSelector";
import DailyUsageIndicator from "@/components/DailyUsageIndicator";

interface TokenPurchase {
  id: number;
  amount: number;
  tokensReceived: number;
  createdAt: string;
}

interface Subscription {
  status: string;
  currentPeriodEnd?: string;
}

const TOKEN_PACKAGES = [
  { id: "package_1", name: "Starter Pack", tokens: 50000, price: 4.99 },
  { id: "package_2", name: "Value Pack", tokens: 150000, price: 12.99 },
  { id: "package_3", name: "Pro Pack", tokens: 300000, price: 24.99 },
  { id: "package_4", name: "Ultimate Pack", tokens: 1000000, price: 79.99 },
];

export default function Account() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [purchasingTokens, setPurchasingTokens] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");

  const { data: user, isLoading: loadingUser } = useQuery<UserType>({
    queryKey: ["/api/auth/user"],
  });

  const { data: tokenBalance } = useQuery<{ balance: number }>({
    queryKey: ["/api/tokens/balance"],
  });

  const { data: purchases } = useQuery<TokenPurchase[]>({
    queryKey: ["/api/tokens/purchases"],
  });

  const { data: subscription } = useQuery<Subscription>({
    queryKey: ["/api/subscription"],
  });

  const { data: premiumStatus } = useQuery<{ isPremium: boolean }>({
    queryKey: ["/api/subscription/check-premium"],
  });

  const { data: dailyUsage } = useQuery<{
    currentCount: number;
    dailyLimit: number;
    subscriptionTier: string;
    resetsAt: string;
  }>({
    queryKey: ["/api/usage/daily"],
  });

  const handleLogout = async () => {
    try {
      await apiRequest("POST", "/api/auth/logout");
      // Clear all queries to ensure fresh state
      queryClient.clear();
      // Force navigate to login
      window.location.href = "/login";
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Logout failed",
        description: error.message,
      });
    }
  };

  const handlePurchaseTokens = async (packageId: string) => {
    // Note: Token purchases removed for iOS-only Apple IAP
    toast({
      title: "Use App Store",
      description: "Please purchase subscriptions through the iOS App Store",
    });
    setPurchasingTokens(false);
  };

  const handleSubscribe = async () => {
    // Note: Subscriptions managed through iOS App Store
    toast({
      title: "Use App Store",
      description: "Please purchase subscriptions through the iOS App Store",
    });
    setSubscribing(false);
  };

  const deleteAccountMutation = useMutation({
    mutationFn: async (password: string) => {
      const response = await apiRequest("DELETE", "/api/auth/account", {
        password,
      });
      return response;
    },
    onSuccess: () => {
      toast({
        title: "Account Deleted",
        description: "Your account and all data have been permanently deleted",
      });
      // Clear all queries and redirect to login
      queryClient.clear();
      window.location.href = "/login";
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Deletion Failed",
        description: error.message || "Failed to delete account",
      });
    },
  });

  const handleDeleteAccount = () => {
    if (!deletePassword) {
      toast({
        variant: "destructive",
        title: "Password Required",
        description: "Please enter your password to confirm account deletion",
      });
      return;
    }
    deleteAccountMutation.mutate(deletePassword);
  };

  if (loadingUser) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-12 w-64 mb-6" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  const isPremium = premiumStatus?.isPremium ?? false;

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h1 className="text-3xl font-bold">Account</h1>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="h-12 text-lg"
            data-testid="button-logout"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Sign Out
          </Button>
        </div>

        {/* User Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-3">
              <User className="w-6 h-6" />
              Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="text-lg font-medium" data-testid="text-email">{user?.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Free Answers Remaining</p>
              <p className="text-lg font-medium" data-testid="text-free-answers">
                {user?.freeAnswersRemaining ?? 0} / 3 this month
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Language Preference */}
        {user && <LanguageSelector user={user} />}

        {/* Daily Usage Indicator */}
        {dailyUsage && (
          <DailyUsageIndicator
            currentCount={dailyUsage.currentCount}
            dailyLimit={dailyUsage.dailyLimit}
            subscriptionTier={dailyUsage.subscriptionTier}
            resetsAt={dailyUsage.resetsAt}
          />
        )}

        {/* Subscription Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-3">
              <CreditCard className="w-6 h-6" />
              Subscription
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {subscription && subscription.status === "active" ? (
              <>
                <div className="flex items-center gap-3 flex-wrap">
                  <Badge className="text-base px-4 py-2" data-testid="badge-subscription-active">
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Subscription Active
                  </Badge>
                </div>
                {subscription.currentPeriodEnd && (
                  <p className="text-base text-muted-foreground">
                    Renews on {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                  </p>
                )}
                <Alert>
                  <CheckCircle2 className="w-5 h-5 text-success" />
                  <AlertDescription className="text-base ml-2">
                    Manage your subscription through the iOS App Store
                  </AlertDescription>
                </Alert>
              </>
            ) : (
              <>
                <p className="text-lg text-muted-foreground mb-4">
                  Choose from 4 subscription tiers to unlock daily analyses
                </p>
                <div className="space-y-3">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold text-lg">Weekly - $2.99/week</h4>
                    <p className="text-sm text-muted-foreground">10 analyses per day</p>
                  </div>
                  <div className="border rounded-lg p-4 border-primary">
                    <h4 className="font-semibold text-lg">Premium - $5.99/month</h4>
                    <p className="text-sm text-muted-foreground">40 analyses per day</p>
                    <Badge className="mt-2">Most Popular</Badge>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold text-lg">Pro - $12.99/month</h4>
                    <p className="text-sm text-muted-foreground">75 analyses per day</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold text-lg">Annual - $99.99/year</h4>
                    <p className="text-sm text-muted-foreground">75 analyses per day · Best value</p>
                  </div>
                </div>
                <Alert>
                  <AlertDescription className="text-base">
                    Subscribe through the iOS App Store when prompted in the app
                  </AlertDescription>
                </Alert>
              </>
            )}
          </CardContent>
        </Card>

        {/* Legal & Privacy Links */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-3">
              <Button
                variant="ghost"
                className="h-12 text-lg justify-start"
                onClick={() => setLocation("/privacy-policy")}
                data-testid="button-privacy-policy"
              >
                Privacy Policy
              </Button>
              <Button
                variant="ghost"
                className="h-12 text-lg justify-start text-destructive hover:text-destructive"
                onClick={() => setDeleteDialogOpen(true)}
                data-testid="button-delete-account"
              >
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete Account Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl">Delete Account Permanently?</AlertDialogTitle>
            <AlertDialogDescription className="text-base space-y-3">
              <p>This action cannot be undone. This will permanently delete your account and remove all your data including:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Your profile and account information</li>
                <li>All saved analyses</li>
                <li>Usage history and analytics</li>
                <li>Subscription data (you must cancel in App Store separately)</li>
              </ul>
              <p className="font-semibold mt-4">Please enter your password to confirm deletion:</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-2 py-4">
            <Label htmlFor="delete-password">Password</Label>
            <Input
              id="delete-password"
              type="password"
              placeholder="Enter your password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              className="h-12 text-lg"
              data-testid="input-delete-password"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="h-12 text-lg"
              onClick={() => {
                setDeletePassword("");
                setDeleteDialogOpen(false);
              }}
              data-testid="button-cancel-delete"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="h-12 text-lg bg-destructive hover:bg-destructive/90"
              onClick={handleDeleteAccount}
              disabled={deleteAccountMutation.isPending}
              data-testid="button-confirm-delete"
            >
              {deleteAccountMutation.isPending ? "Deleting..." : "Delete My Account"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
