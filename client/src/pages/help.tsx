import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { HelpCircle, Camera, CreditCard, Globe, AlertTriangle, Save, Mail } from "lucide-react";

export default function Help() {
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <HelpCircle className="w-8 h-8" />
            Help & Documentation
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            Everything you need to know about using What Is This?
          </p>
        </div>

        {/* Quick Start */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Quick Start Guide</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-lg">
            <ol className="list-decimal pl-6 space-y-3">
              <li>Choose your preferred language from the language selector</li>
              <li>Upload a photo, take a picture, or paste an image URL</li>
              <li>Click "Analyze Image" to get your explanation</li>
              <li>Read the results in simple, easy-to-understand language</li>
              <li>(Premium only) Save answers you want to keep for later</li>
            </ol>
          </CardContent>
        </Card>

        {/* FAQs */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-lg">
                  <div className="flex items-center gap-3">
                    <Camera className="w-5 h-5" />
                    How do I analyze an image?
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-base leading-relaxed">
                  You have three options:
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li><strong>Upload:</strong> Click the "Upload" tab and choose an image from your device</li>
                    <li><strong>Camera:</strong> Use your device's camera to take a photo (mobile app only)</li>
                    <li><strong>URL:</strong> Paste a link to an image from the internet</li>
                  </ul>
                  <p className="mt-3">
                    After selecting your image, click the "Analyze Image" button to get your explanation.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger className="text-lg">
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5" />
                    What languages are supported?
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-base leading-relaxed">
                  We support 8 languages:
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>English</li>
                    <li>Spanish (Español)</li>
                    <li>Chinese (中文)</li>
                    <li>Arabic (العربية)</li>
                    <li>French (Français)</li>
                    <li>German (Deutsch)</li>
                    <li>Hindi (हिन्दी)</li>
                    <li>Portuguese (Português)</li>
                  </ul>
                  <p className="mt-3">
                    Select your language before analyzing an image. All explanations will be provided in your chosen language.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger className="text-lg">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5" />
                    How does pricing work?
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-base leading-relaxed">
                  We offer three ways to use What Is This?:
                  
                  <div className="mt-3 space-y-3">
                    <div>
                      <strong>Free Plan:</strong> Get 3 free analysis requests every month. Perfect for occasional use.
                    </div>
                    
                    <div>
                      <strong>Premium Subscription ($4.99/month):</strong>
                      <ul className="list-disc pl-6 mt-1">
                        <li>Unlimited analysis requests</li>
                        <li>Save answers for later reference</li>
                        <li>Priority processing</li>
                      </ul>
                    </div>
                    
                    <div>
                      <strong>Pay-as-you-go Tokens:</strong> Purchase tokens in packages (100, 250, 500, or 1000 tokens) for flexible usage beyond your free quota.
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger className="text-lg">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5" />
                    What is emergency detection?
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-base leading-relaxed">
                  Our AI automatically scans every image for potential emergencies, including:
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>Medical emergencies (injuries, severe bleeding, unconsciousness)</li>
                    <li>Fires and smoke</li>
                    <li>Violence or dangerous situations</li>
                    <li>Accidents or disasters</li>
                  </ul>
                  
                  <Alert className="mt-4 border-destructive bg-destructive/10">
                    <AlertTriangle className="w-5 h-5 text-destructive" />
                    <AlertDescription className="text-base ml-2">
                      <strong>Important:</strong> If danger is detected, you'll see a red alert with a "Call Emergency Services" button. 
                      This feature is designed to help, but it's not perfect. If you're in immediate danger, always call 911 (or your local emergency number) right away.
                    </AlertDescription>
                  </Alert>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger className="text-lg">
                  <div className="flex items-center gap-3">
                    <Save className="w-5 h-5" />
                    Can I save my answers?
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-base leading-relaxed">
                  Saving answers is a premium feature available to subscribers ($4.99/month).
                  
                  <p className="mt-3">
                    When you have a premium subscription:
                  </p>
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>Click the "Save Answer" button after any analysis</li>
                    <li>Access all your saved answers from the "Saved Answers" page</li>
                    <li>Delete saved answers you no longer need</li>
                    <li>Keep your saved answers as long as your subscription is active</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6">
                <AccordionTrigger className="text-lg">
                  Is my data private?
                </AccordionTrigger>
                <AccordionContent className="text-base leading-relaxed">
                  <p>
                    We take your privacy seriously:
                  </p>
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>Images are sent to OpenAI for analysis but are not stored permanently</li>
                    <li>We only save analysis results (not images) for premium users who choose to save answers</li>
                    <li>We do not sell your data to third parties</li>
                    <li>Usage data is collected for analytics and improving the service</li>
                  </ul>
                  
                  <p className="mt-3">
                    For more details, please review our Privacy Policy in the Terms & Conditions.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-7">
                <AccordionTrigger className="text-lg">
                  How accurate are the explanations?
                </AccordionTrigger>
                <AccordionContent className="text-base leading-relaxed">
                  <p>
                    We use advanced AI (OpenAI's GPT-4 Vision) to analyze images, which is very accurate most of the time. However:
                  </p>
                  
                  <Alert className="mt-3 border-warning/50 bg-warning/10">
                    <AlertTriangle className="w-5 h-5 text-warning" />
                    <AlertDescription className="text-base ml-2">
                      AI can sometimes make mistakes. Do not rely on What Is This? for:
                      <ul className="list-disc pl-6 mt-2">
                        <li>Medical diagnosis or advice</li>
                        <li>Legal advice</li>
                        <li>Financial decisions</li>
                        <li>Safety-critical decisions</li>
                      </ul>
                      Always verify important information with qualified professionals.
                    </AlertDescription>
                  </Alert>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-8">
                <AccordionTrigger className="text-lg">
                  What types of content can I analyze?
                </AccordionTrigger>
                <AccordionContent className="text-base leading-relaxed">
                  What Is This? can analyze:
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li><strong>Products:</strong> Get information about items, with Wikipedia links when available</li>
                    <li><strong>Food:</strong> Identify dishes and get recipes with ingredients and instructions</li>
                    <li><strong>Documents:</strong> Summarize text in images with key points</li>
                    <li><strong>General images:</strong> Explain what's in any photo</li>
                  </ul>
                  
                  <p className="mt-3">
                    Some content is automatically blocked for safety:
                  </p>
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>Explicit or adult content</li>
                    <li>Violent or disturbing images (except for emergency detection)</li>
                    <li>Illegal content</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* Contact Support */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-3">
              <Mail className="w-6 h-6" />
              Need More Help?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg">
              If you can't find the answer to your question here, we're happy to help!
            </p>
            <Button className="h-12 text-lg" asChild data-testid="button-contact">
              <a href="mailto:support@xplainthis.com">
                <Mail className="w-5 h-5 mr-2" />
                Contact Support
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
