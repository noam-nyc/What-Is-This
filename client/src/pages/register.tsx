import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { UserPlus, Eye, EyeOff, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const registerSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  ageConfirmed: z.boolean().refine((val) => val === true, "You must be 18 or older"),
  termsAccepted: z.boolean().refine((val) => val === true, "You must accept the terms"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function Register() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      ageConfirmed: false,
      termsAccepted: false,
    },
  });

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    try {
      await apiRequest("POST", "/api/auth/register", {
        email: data.email,
        password: data.password,
      });

      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });

      toast({
        title: "Account created!",
        description: "Welcome to Xplain This. Let's get started!",
      });

      setLocation("/onboarding");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error.message || "Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-2">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                <UserPlus className="w-8 h-8 text-primary-foreground" />
              </div>
            </div>
            <CardTitle className="text-3xl text-center">Create Account</CardTitle>
            <CardDescription className="text-lg text-center">
              Join Xplain This to understand the world around you
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg">Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="your@email.com"
                          className="h-12 text-lg"
                          data-testid="input-email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg">Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            placeholder="At least 8 characters"
                            className="h-12 text-lg pr-12"
                            data-testid="input-password"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-12 w-12"
                            onClick={() => setShowPassword(!showPassword)}
                            data-testid="button-toggle-password"
                          >
                            {showPassword ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg">Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          placeholder="Re-enter your password"
                          className="h-12 text-lg"
                          data-testid="input-confirm-password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Alert className="border-warning/50 bg-warning/10">
                  <AlertCircle className="h-5 w-5 text-warning-foreground" />
                  <AlertDescription className="text-base ml-2">
                    You must be 18 years or older to use this service
                  </AlertDescription>
                </Alert>

                <FormField
                  control={form.control}
                  name="ageConfirmed"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="h-6 w-6 mt-1"
                          data-testid="checkbox-age-verification"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-lg font-normal cursor-pointer">
                          I confirm that I am 18 years of age or older
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="termsAccepted"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="h-6 w-6 mt-1"
                          data-testid="checkbox-terms"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-lg font-normal cursor-pointer">
                          I agree to the{" "}
                          <button
                            type="button"
                            onClick={() => setShowTerms(true)}
                            className="text-primary underline hover:no-underline"
                            data-testid="button-view-terms"
                          >
                            Terms & Conditions
                          </button>
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full h-14 text-xl"
                  disabled={isLoading}
                  data-testid="button-register"
                >
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>
              </form>
            </Form>

            <div className="text-center space-y-2">
              <p className="text-lg text-muted-foreground">
                Already have an account?
              </p>
              <Button
                variant="outline"
                className="w-full h-14 text-xl"
                onClick={() => setLocation("/login")}
                data-testid="button-go-to-login"
              >
                Sign In
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showTerms} onOpenChange={setShowTerms}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Terms & Conditions</DialogTitle>
            <DialogDescription className="text-lg">
              Please read these terms carefully before using Xplain This
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 text-base leading-relaxed">
            <section>
              <h3 className="font-semibold text-lg mb-2">1. Service Description</h3>
              <p>
                Xplain This is an AI-powered image analysis service that provides explanations,
                product information, and recipes in multiple languages. The service uses artificial
                intelligence and may not always be 100% accurate.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-lg mb-2">2. Age Requirement</h3>
              <p>
                You must be at least 18 years old to use this service. By creating an account,
                you confirm that you meet this age requirement.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-lg mb-2">3. Emergency Situations</h3>
              <p>
                This service can detect potential emergencies in images (medical, fire, violence).
                However, this is not a substitute for emergency services. If you are in immediate
                danger, call your local emergency number (911 in the US) immediately.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-lg mb-2">4. Content Filtering</h3>
              <p>
                We use AI to filter inappropriate content. Some content may be blocked for your
                safety. This service is designed for general use and educational purposes.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-lg mb-2">5. Usage Limits & Pricing</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Free users receive 3 analysis requests per month</li>
                <li>Additional requests require purchasing tokens or a premium subscription</li>
                <li>Token prices include a 100% markup on OpenAI processing costs</li>
                <li>Premium subscriptions cost $4.99/month and include unlimited saved answers</li>
                <li>All sales are final; no refunds except as required by law</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-lg mb-2">6. Privacy & Data</h3>
              <p>
                Images you upload are sent to OpenAI for analysis. We do not store your images
                permanently. Usage data and saved answers (premium only) are stored in our database.
                We do not sell your data to third parties.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-lg mb-2">7. Accuracy Disclaimer</h3>
              <p>
                AI-generated explanations may contain errors. Do not rely on this service for
                medical, legal, or financial advice. Always verify important information with
                qualified professionals.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-lg mb-2">8. Account Termination</h3>
              <p>
                We reserve the right to terminate accounts that violate these terms or use the
                service inappropriately.
              </p>
            </section>

            <Button
              onClick={() => setShowTerms(false)}
              className="w-full h-12 text-lg mt-4"
              data-testid="button-close-terms"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
