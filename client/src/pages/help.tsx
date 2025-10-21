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
                    <li>French (Français)</li>
                    <li>German (Deutsch)</li>
                    <li>Portuguese (Português)</li>
                    <li>Japanese (日本語)</li>
                    <li>Korean (한국어)</li>
                  </ul>
                  <p className="mt-3">
                    Select your language from your account settings or before analyzing an image. All explanations will be provided in your chosen language.
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
                  We offer several subscription options through the iOS App Store:
                  
                  <div className="mt-3 space-y-3">
                    <div>
                      <strong>Free Plan:</strong> Get 3 free analyses every month. Perfect for occasional use.
                    </div>
                    
                    <div>
                      <strong>Weekly Subscription ($2.99/week):</strong>
                      <ul className="list-disc pl-6 mt-1">
                        <li>10 analyses per day</li>
                        <li>All languages supported</li>
                        <li>Safety alerts included</li>
                      </ul>
                    </div>

                    <div>
                      <strong>Premium Subscription ($5.99/month):</strong>
                      <ul className="list-disc pl-6 mt-1">
                        <li>40 analyses per day</li>
                        <li>Save answers for later reference</li>
                        <li>All languages supported</li>
                        <li>Most popular choice</li>
                      </ul>
                    </div>
                    
                    <div>
                      <strong>Pro Subscription ($12.99/month):</strong>
                      <ul className="list-disc pl-6 mt-1">
                        <li>75 analyses per day</li>
                        <li>Save answers for later reference</li>
                        <li>All languages supported</li>
                        <li>Advanced features</li>
                      </ul>
                    </div>

                    <div>
                      <strong>Annual Subscription ($99.99/year):</strong>
                      <ul className="list-disc pl-6 mt-1">
                        <li>75 analyses per day</li>
                        <li>Save answers for later reference</li>
                        <li>All languages supported</li>
                        <li>Best value - save over 30%</li>
                      </ul>
                    </div>
                  </div>
                  
                  <Alert className="mt-4 border-primary/50 bg-primary/10">
                    <AlertDescription className="text-base">
                      All subscriptions are managed through the Apple App Store. Daily limits reset at midnight UTC.
                    </AlertDescription>
                  </Alert>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger className="text-lg">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5" />
                    What are safety alerts?
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-base leading-relaxed">
                  Our AI provides helpful information when it detects potentially concerning content, including:
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>Injuries or medical situations</li>
                    <li>Hazardous materials or situations</li>
                    <li>Safety concerns that need attention</li>
                  </ul>
                  
                  <Alert className="mt-4 border-warning/50 bg-warning/10">
                    <AlertTriangle className="w-5 h-5 text-warning" />
                    <AlertDescription className="text-base ml-2">
                      <strong>Important:</strong> Safety alerts are informational and educational. This app is not a substitute for professional medical advice or emergency services. If you're in immediate danger, always call 911 (or your local emergency number) right away.
                    </AlertDescription>
                  </Alert>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger className="text-lg">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5" />
                    Is the AI always accurate?
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-base leading-relaxed">
                  <Alert className="mb-4 border-warning/50 bg-warning/10">
                    <AlertTriangle className="w-5 h-5 text-warning" />
                    <AlertDescription className="text-base ml-2">
                      <strong>Important:</strong> Our AI is very helpful but not perfect. It can make mistakes when analyzing images.
                    </AlertDescription>
                  </Alert>
                  
                  <p>
                    What Is This? uses advanced AI technology, but like all AI, it has limitations:
                  </p>
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>It can misidentify products or objects</li>
                    <li>Information provided may be incorrect</li>
                    <li>Important details might be missed</li>
                    <li>Translations may contain errors</li>
                  </ul>
                  
                  <p className="mt-3 font-semibold">
                    Always verify important information from reliable sources. Never rely solely on AI for medical, legal, or safety-critical decisions.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6">
                <AccordionTrigger className="text-lg">
                  <div className="flex items-center gap-3">
                    <Save className="w-5 h-5" />
                    Can I save my answers?
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-base leading-relaxed">
                  Saving answers is a premium feature available to Premium, Pro, and Annual subscribers.
                  
                  <p className="mt-3">
                    When you have a premium subscription ($5.99/month or higher):
                  </p>
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>Click the "Save Answer" button after any analysis</li>
                    <li>Access all your saved answers from the "Saved" tab</li>
                    <li>View full analysis results with images</li>
                    <li>Delete saved answers you no longer need</li>
                    <li>Keep your saved answers as long as your subscription is active</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-7">
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
                    <li>Extremely violent or disturbing images</li>
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
              <a href="mailto:info@what-is-this.app">
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
