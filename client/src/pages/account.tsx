import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { User, CreditCard, Coins, Package, CheckCircle2, LogOut, ShoppingCart } from "lucide-react";
import type { User as UserType } from "@shared/schema";

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
    setPurchasingTokens(true);
    try {
      const response = await apiRequest("POST", "/api/stripe/create-token-checkout", {
        packageId,
      });
      const { url } = await response.json();
      window.location.href = url;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Checkout failed",
        description: error.message,
      });
      setPurchasingTokens(false);
    }
  };

  const handleSubscribe = async () => {
    setSubscribing(true);
    try {
      const response = await apiRequest("POST", "/api/stripe/create-subscription-checkout");
      const { url } = await response.json();
      window.location.href = url;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Checkout failed",
        description: error.message,
      });
      setSubscribing(false);
    }
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

        {/* Subscription Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-3">
              <CreditCard className="w-6 h-6" />
              Subscription
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isPremium ? (
              <>
                <div className="flex items-center gap-3">
                  <Badge className="text-base px-4 py-2" data-testid="badge-premium-active">
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Premium Active
                  </Badge>
                  <span className="text-lg text-muted-foreground">
                    $4.99/month
                  </span>
                </div>
                {subscription?.currentPeriodEnd && (
                  <p className="text-base text-muted-foreground">
                    Renews on {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                  </p>
                )}
                <Alert>
                  <CheckCircle2 className="w-5 h-5 text-success" />
                  <AlertDescription className="text-base ml-2">
                    You have unlimited analysis requests and can save answers
                  </AlertDescription>
                </Alert>
              </>
            ) : (
              <>
                <p className="text-lg text-muted-foreground mb-4">
                  Upgrade to Premium for unlimited analysis and saved answers
                </p>
                <div className="border rounded-lg p-4 space-y-3">
                  <h4 className="font-semibold text-xl">Premium - $4.99/month</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-base">
                      <CheckCircle2 className="w-5 h-5 text-success" />
                      Unlimited analysis requests
                    </li>
                    <li className="flex items-center gap-2 text-base">
                      <CheckCircle2 className="w-5 h-5 text-success" />
                      Save answers for later
                    </li>
                    <li className="flex items-center gap-2 text-base">
                      <CheckCircle2 className="w-5 h-5 text-success" />
                      Priority processing
                    </li>
                  </ul>
                  <Button
                    onClick={handleSubscribe}
                    disabled={subscribing}
                    className="w-full h-14 text-xl mt-4"
                    data-testid="button-subscribe"
                  >
                    {subscribing ? "Processing..." : "Subscribe to Premium"}
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Token Balance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-3">
              <Coins className="w-6 h-6" />
              Token Balance
            </CardTitle>
            <CardDescription className="text-lg">
              Use tokens for pay-as-you-go analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-xl px-5 py-2" data-testid="badge-token-balance">
                {tokenBalance?.balance ?? 0} tokens
              </Badge>
            </div>

            <Separator />

            <div>
              <h4 className="font-semibold text-lg mb-3">Purchase Tokens</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {TOKEN_PACKAGES.map((pkg) => (
                  <Button
                    key={pkg.id}
                    variant="outline"
                    onClick={() => handlePurchaseTokens(pkg.id)}
                    disabled={purchasingTokens}
                    className="h-auto py-4 flex-col items-start hover-elevate"
                    data-testid={`button-buy-${pkg.tokens}-tokens`}
                  >
                    <div className="flex items-center justify-between w-full mb-2">
                      <span className="text-xl font-semibold">{pkg.tokens.toLocaleString()} tokens</span>
                      <ShoppingCart className="w-5 h-5" />
                    </div>
                    <span className="text-2xl font-bold text-primary">${pkg.price}</span>
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Purchase History */}
        {purchases && purchases.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-3">
                <Package className="w-6 h-6" />
                Purchase History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {purchases.map((purchase) => (
                  <div
                    key={purchase.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                    data-testid={`purchase-${purchase.id}`}
                  >
                    <div>
                      <p className="font-medium text-lg">
                        {purchase.tokensReceived} tokens
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(purchase.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="text-lg font-semibold">
                      ${(purchase.amount / 100).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
