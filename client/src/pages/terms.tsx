import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Shield, Scale } from "lucide-react";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6 py-8">
        <h1 className="text-4xl font-bold">Terms of Service</h1>
        <p className="text-lg text-muted-foreground">
          Last updated: October 19, 2025
        </p>

        <Alert className="border-destructive bg-destructive/10">
          <AlertTriangle className="w-6 h-6" />
          <AlertDescription className="text-base ml-3">
            <strong>IMPORTANT:</strong> Please read these terms carefully. By using this service,
            you agree to be bound by these terms and acknowledge the limitations and disclaimers below.
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-6 h-6" />
              AI Technology Notice
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base">
            <p>
              <strong>EXPERIMENTAL TECHNOLOGY:</strong> This Service uses experimental artificial
              intelligence technology. You acknowledge and agree that:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>ACCURACY NOT GUARANTEED:</strong> AI-generated content may contain errors,
                inaccuracies, hallucinations, or outdated information.
              </li>
              <li>
                <strong>INDEPENDENT VERIFICATION REQUIRED:</strong> You MUST independently verify all
                AI outputs before relying on them for any important decisions.
              </li>
              <li>
                <strong>NOT A SUBSTITUTE:</strong> AI outputs are NOT a substitute for professional
                advice (legal, medical, financial, etc.), human judgment and expertise, or qualified
                professional consultation.
              </li>
              <li>
                <strong>USE AT YOUR SOLE RISK:</strong> Any reliance on AI outputs is strictly AT YOUR
                OWN RISK. You assume full responsibility for evaluating accuracy, completeness, and
                suitability.
              </li>
              <li>
                <strong>NO GUARANTEE OF RESULTS:</strong> We do not guarantee that AI outputs will meet
                your needs or produce desired outcomes.
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-6 h-6" />
              Safety Intent Specific Warning
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base">
            <Alert className="border-warning bg-warning/10">
              <AlertDescription className="text-base">
                <strong>CRITICAL SAFETY DISCLAIMER:</strong> The "Is it safe?" analysis feature provides
                GENERAL INFORMATIONAL guidance only and should NEVER be relied upon as the sole basis for
                safety-critical decisions.
              </AlertDescription>
            </Alert>

            <p className="font-semibold">Safety Analysis Limitations:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>AI cannot detect all hazards, toxins, allergens, or safety risks</li>
              <li>AI cannot assess structural integrity, chemical composition, or hidden dangers</li>
              <li>AI may not have access to current safety recalls or regulatory warnings</li>
              <li>Safety standards vary by jurisdiction and AI cannot account for all local regulations</li>
            </ul>

            <p className="font-semibold mt-4">For Safety-Critical Decisions, You MUST:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Consult qualified professionals (doctors, engineers, safety inspectors, etc.)</li>
              <li>Follow manufacturer instructions and safety labels</li>
              <li>Check official regulatory databases (FDA, CPSC, EPA, etc.)</li>
              <li>Use appropriate testing equipment and safety gear</li>
              <li>Never rely solely on AI analysis for health, safety, or compliance matters</li>
            </ul>

            <p className="mt-4 font-semibold text-destructive">
              We accept NO LIABILITY for injuries, illnesses, damages, or harm resulting from reliance
              on AI safety assessments.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="w-6 h-6" />
              Limitation of Liability
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base">
            <p className="font-semibold">TO THE MAXIMUM EXTENT PERMITTED BY LAW:</p>

            <div className="space-y-3">
              <p>1. We shall NOT be liable for ANY:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Direct, indirect, incidental, consequential, or punitive damages</li>
                <li>Special or exemplary damages</li>
                <li>Loss of profits, data, goodwill, or business opportunities</li>
                <li>Damages arising from use of the Service or reliance on AI outputs</li>
                <li>Personal injury, property damage, or economic losses</li>
              </ul>

              <p>2. Our AGGREGATE LIABILITY under these Terms will NOT EXCEED the GREATER of:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>The amount you paid for the Service in the 12 months before the claim, OR</li>
                <li>$100 USD</li>
              </ul>

              <p>
                3. These limitations apply regardless of legal theory (contract, tort, negligence,
                strict liability, or otherwise).
              </p>

              <p>
                4. Some jurisdictions do not allow certain warranty disclaimers or liability
                limitations. In such cases, these Terms limit our liability to the maximum extent
                permitted by applicable law.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>"AS IS" Warranty Disclaimer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base">
            <p>
              The Service is provided on an "AS IS" and "AS AVAILABLE" basis. We make no warranties
              or representations (express, implied, statutory, or otherwise) with respect to the
              Service, including but not limited to:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Warranties of MERCHANTABILITY</li>
              <li>Fitness for a PARTICULAR PURPOSE</li>
              <li>Satisfactory quality</li>
              <li>Non-infringement</li>
              <li>Quiet enjoyment</li>
              <li>Warranties arising from course of dealing or trade usage</li>
            </ul>

            <p className="mt-4">We do not warrant that:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>The Service will be UNINTERRUPTED, ACCURATE, or ERROR-FREE</li>
              <li>Any content will be SECURE or NOT LOST OR ALTERED</li>
              <li>AI-generated outputs will be complete, reliable, or suitable for any purpose</li>
              <li>Defects will be corrected</li>
              <li>The Service is free from viruses or harmful components</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Content Limitations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base">
            <p>
              The information provided by the Service is intended for GENERAL INFORMATIONAL PURPOSES
              ONLY. The Company:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Makes NO GUARANTEES regarding accuracy, completeness, or usefulness</li>
              <li>
                Assumes NO LIABILITY for reliance on AI-generated materials by you, other users, or
                any third parties informed of its contents
              </li>
              <li>Does NOT verify the truthfulness or reliability of AI outputs</li>
              <li>Cannot control or predict all AI system behaviors</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Acceptable Use</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base">
            <p>You agree NOT to use the Service to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Generate or distribute illegal, harmful, or dangerous content</li>
              <li>Create deepfakes, misleading content, or misinformation</li>
              <li>Infringe intellectual property rights or violate third-party rights</li>
              <li>Attempt to reverse-engineer, exploit, or manipulate AI systems</li>
              <li>Use outputs for professional advice without qualified human review</li>
              <li>Engage in automated scraping or abuse of the Service</li>
              <li>Violate any applicable laws or regulations</li>
            </ul>

            <p className="mt-4 font-semibold">You acknowledge that YOU ARE RESPONSIBLE FOR:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>All content you input into the Service</li>
              <li>All uses of AI outputs generated for you</li>
              <li>Compliance with applicable laws in your jurisdiction</li>
              <li>Obtaining necessary rights/permissions for your inputs</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Indemnification</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base">
            <p>
              You agree to indemnify, defend, and hold harmless the Company, its affiliates, and
              personnel from any claims, damages, losses, liabilities, and expenses (including
              attorneys' fees) arising from:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Your use or misuse of the Service</li>
              <li>Your reliance on AI-generated outputs</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of third-party rights</li>
              <li>Any harm caused by content you generate or distribute using the Service</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data Usage & Privacy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base">
            <p className="font-semibold">Third-Party AI Providers:</p>
            <p>
              We use third-party AI providers (including OpenAI). Your data may be processed by these
              providers subject to their privacy policies.
            </p>

            <p className="font-semibold mt-4">Training Data:</p>
            <p>
              Your inputs are NOT used for AI training. AI-generated outputs and your prompts may be
              retained for quality assurance and safety monitoring in accordance with our Privacy Policy.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Modifications & Termination</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base">
            <p>We reserve the right to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                Modify, suspend, or discontinue any AI feature or the Service at any time without
                notice
              </li>
              <li>Change these Terms with 30 days' notice</li>
              <li>Terminate your access for violation of these Terms without prior notice</li>
              <li>Update AI models, which may change outputs and functionality</li>
            </ul>
            <p className="mt-4">
              We do NOT warrant the results of any changes or guarantee uninterrupted service.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base">
            <p>
              For questions about these Terms, please contact us through the Help section of the
              application.
            </p>
          </CardContent>
        </Card>

        <div className="text-sm text-muted-foreground">
          <p>
            By using this Service, you acknowledge that you have read, understood, and agree to be
            bound by these Terms of Service.
          </p>
        </div>
      </div>
    </div>
  );
}
