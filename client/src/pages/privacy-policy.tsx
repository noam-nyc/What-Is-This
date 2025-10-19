import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { ArrowLeft, Shield, Database, Eye, Lock, Globe, AlertTriangle } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function PrivacyPolicy() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6 pb-12">
        <Button
          variant="ghost"
          onClick={() => setLocation("/account")}
          className="h-12 text-lg"
          data-testid="button-back"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Account
        </Button>

        <div className="space-y-2">
          <h1 className="text-4xl font-bold">Privacy Policy</h1>
          <p className="text-xl text-muted-foreground">
            Last updated: October 19, 2025
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6" />
              <CardTitle>Our Commitment to Your Privacy</CardTitle>
            </div>
            <CardDescription className="text-base">
              What Is This? is designed with accessibility and privacy in mind. We are committed to protecting your personal information and being transparent about how we use it.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Information We Collect */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Database className="w-6 h-6" />
              <CardTitle>Information We Collect</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Account Information</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Email address (for account creation and password reset)</li>
                <li>Phone number and address (optional, if provided)</li>
                <li>Age verification status (13+ requirement)</li>
                <li>Preferred language for AI responses</li>
              </ul>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold mb-2">Images You Analyze</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Photos you take or upload for AI analysis</li>
                <li>URLs of images you provide for analysis</li>
                <li>Saved analyses (only if you choose to save them and have a premium subscription)</li>
              </ul>
              <p className="mt-2 text-base">
                <strong>Important:</strong> Images are sent to OpenAI for analysis. We do not permanently store your images unless you explicitly save them.
              </p>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold mb-2">Usage Data</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Number of analyses performed</li>
                <li>Daily usage counts</li>
                <li>Token usage and costs</li>
                <li>Subscription tier and status</li>
              </ul>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold mb-2">Apple In-App Purchase Data</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Apple transaction IDs</li>
                <li>Receipt data for subscription validation</li>
                <li>Subscription renewal and cancellation status</li>
              </ul>
              <p className="mt-2 text-base text-muted-foreground">
                Apple handles all payment processing. We do not collect or store credit card information.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* How We Use Your Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Eye className="w-6 h-6" />
              <CardTitle>How We Use Your Information</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li><strong>AI Analysis:</strong> Images are sent to OpenAI GPT-4 Vision API to generate explanations in your preferred language</li>
              <li><strong>Account Management:</strong> Email is used for login, password reset, and critical account notifications</li>
              <li><strong>Usage Limits:</strong> Track daily analyses to enforce subscription tier limits</li>
              <li><strong>Subscription Management:</strong> Validate Apple IAP receipts and manage subscription status</li>
              <li><strong>Safety Features:</strong> Content moderation to filter inappropriate or harmful content</li>
              <li><strong>Service Improvement:</strong> Aggregate usage data to improve the app (never shared with third parties)</li>
            </ul>
          </CardContent>
        </Card>

        {/* Third-Party Services */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Globe className="w-6 h-6" />
              <CardTitle>Third-Party Services</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">OpenAI</h3>
              <p className="text-muted-foreground">
                Your images and questions are sent to OpenAI's GPT-4 Vision API for analysis. OpenAI may process this data according to their privacy policy. We recommend reviewing <a href="https://openai.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary underline">OpenAI's Privacy Policy</a>.
              </p>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold mb-2">Apple In-App Purchases</h3>
              <p className="text-muted-foreground">
                Subscriptions are processed through Apple's App Store. Apple handles all payment information. We only receive transaction receipts for validation purposes.
              </p>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold mb-2">Neon Database</h3>
              <p className="text-muted-foreground">
                Your account data is stored securely in a Neon PostgreSQL database with industry-standard encryption.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Data Security */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lock className="w-6 h-6" />
              <CardTitle>Data Security</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Passwords are encrypted using bcrypt hashing</li>
              <li>All data transmitted over HTTPS</li>
              <li>Session data encrypted in PostgreSQL database</li>
              <li>Password reset tokens expire after 1 hour</li>
              <li>Images are not permanently stored unless you explicitly save them</li>
            </ul>
          </CardContent>
        </Card>

        {/* Age Requirements */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-6 h-6" />
              <CardTitle>Age Requirements and Parental Consent</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-base">
              <strong>Minimum Age:</strong> You must be at least 13 years old to use this service.
            </p>
            <p className="text-base text-muted-foreground">
              <strong>Ages 13-17:</strong> If you are under 18, you must have parental or guardian consent to use this app. By using this service, you confirm that you have obtained the necessary permission.
            </p>
            <p className="text-base text-muted-foreground">
              We implement content filtering and safety alerts to protect younger users, but parental supervision is always recommended.
            </p>
          </CardContent>
        </Card>

        {/* Your Rights */}
        <Card>
          <CardHeader>
            <CardTitle>Your Privacy Rights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Correction:</strong> Update incorrect account information through account settings</li>
              <li><strong>Deletion:</strong> Delete your account and all associated data at any time</li>
              <li><strong>Data Portability:</strong> Export your saved analyses</li>
              <li><strong>Opt-Out:</strong> Unsubscribe from non-essential communications</li>
            </ul>
            <p className="text-base mt-4">
              To exercise these rights, contact us through the in-app support or email us at support@whatisthisapp.com
            </p>
          </CardContent>
        </Card>

        {/* Data Retention */}
        <Card>
          <CardHeader>
            <CardTitle>Data Retention</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Account data is retained while your account is active</li>
              <li>Images sent for analysis are not permanently stored (unless you save them)</li>
              <li>Saved analyses are kept until you delete them or close your account</li>
              <li>Usage logs are retained for up to 12 months for analytics</li>
              <li>After account deletion, all data is permanently removed within 30 days</li>
            </ul>
          </CardContent>
        </Card>

        {/* AI Disclaimer */}
        <Card>
          <CardHeader>
            <CardTitle>AI Analysis Disclaimer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-base text-muted-foreground">
              This app uses artificial intelligence (OpenAI GPT-4 Vision) to analyze images and provide explanations. While we strive for accuracy:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>AI may make mistakes or provide incomplete information</li>
              <li>Results should not be used for medical, legal, or financial decisions</li>
              <li>Always verify important information with qualified professionals</li>
              <li>Safety alerts are automated and may not catch all concerning content</li>
            </ul>
          </CardContent>
        </Card>

        {/* Changes to Privacy Policy */}
        <Card>
          <CardHeader>
            <CardTitle>Changes to This Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-base text-muted-foreground">
              We may update this Privacy Policy from time to time. We will notify you of significant changes by posting a notice in the app or sending an email to your registered address. Your continued use of the service after changes constitutes acceptance of the updated policy.
            </p>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Us</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-base">
              If you have questions about this Privacy Policy or how we handle your data, please contact us:
            </p>
            <ul className="list-none space-y-1 text-muted-foreground">
              <li><strong>Email:</strong> privacy@whatisthisapp.com</li>
              <li><strong>Support:</strong> support@whatisthisapp.com</li>
            </ul>
          </CardContent>
        </Card>

        <Button
          variant="outline"
          onClick={() => setLocation("/account")}
          className="w-full h-12 text-lg"
          data-testid="button-back-bottom"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Account
        </Button>
      </div>
    </div>
  );
}
