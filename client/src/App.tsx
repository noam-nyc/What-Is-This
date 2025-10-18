import { Switch, Route, Redirect } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Home, Save, User as UserIcon, HelpCircle, Menu, X } from "lucide-react";
import { useState } from "react";
import type { User } from "@shared/schema";

// Pages
import Login from "@/pages/login";
import Register from "@/pages/register";
import Onboarding from "@/pages/onboarding";
import Analyze from "@/pages/analyze";
import SavedAnswers from "@/pages/saved-answers";
import Account from "@/pages/account";
import Help from "@/pages/help";
import NotFound from "@/pages/not-found";
import { useLocation } from "wouter";

function Navigation() {
  const [location, setLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: "/", label: "Analyze", icon: Home },
    { path: "/saved", label: "Saved", icon: Save },
    { path: "/account", label: "Account", icon: UserIcon },
    { path: "/help", label: "Help", icon: HelpCircle },
  ];

  const isActive = (path: string) => location === path;

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="sm:hidden fixed top-4 right-4 z-50">
        <Button
          size="icon"
          variant="outline"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="h-12 w-12 bg-background shadow-lg"
          data-testid="button-mobile-menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </Button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="sm:hidden fixed inset-0 bg-background/95 backdrop-blur-sm z-40"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div className="flex flex-col items-center justify-center h-full gap-4 p-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.path}
                  variant={isActive(item.path) ? "default" : "outline"}
                  className="w-full max-w-xs h-16 text-xl"
                  onClick={() => {
                    setLocation(item.path);
                    setMobileMenuOpen(false);
                  }}
                  data-testid={`nav-${item.label.toLowerCase()}`}
                >
                  <Icon className="w-6 h-6 mr-3" />
                  {item.label}
                </Button>
              );
            })}
          </div>
        </div>
      )}

      {/* Desktop Navigation */}
      <nav className="hidden sm:block fixed bottom-0 left-0 right-0 bg-card border-t shadow-lg z-40">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-around h-20">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.path}
                  variant={isActive(item.path) ? "default" : "ghost"}
                  className="flex-col h-16 w-24 gap-1"
                  onClick={() => setLocation(item.path)}
                  data-testid={`nav-${item.label.toLowerCase()}`}
                >
                  <Icon className="w-6 h-6" />
                  <span className="text-sm">{item.label}</span>
                </Button>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
}

function AuthenticatedApp() {
  return (
    <div className="pb-24 sm:pb-24">
      <Navigation />
      <Switch>
        <Route path="/" component={Analyze} />
        <Route path="/onboarding" component={Onboarding} />
        <Route path="/saved" component={SavedAnswers} />
        <Route path="/account" component={Account} />
        <Route path="/help" component={Help} />
        <Route path="/:rest*" component={NotFound} />
      </Switch>
    </div>
  );
}

function Router() {
  const { data: user, isLoading } = useQuery<User>({
    queryKey: ["/api/auth/user"],
    queryFn: async () => {
      const res = await fetch("/api/auth/user", {
        credentials: "include",
      });
      
      if (res.status === 401) {
        return null;
      }
      
      if (!res.ok) {
        throw new Error("Failed to fetch user");
      }
      
      return res.json();
    },
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="space-y-4">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-32 w-64" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route>
          {() => <Redirect to="/login" />}
        </Route>
      </Switch>
    );
  }

  return <AuthenticatedApp />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
