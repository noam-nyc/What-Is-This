import { useState } from "react";
import { Shield, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TermsAndConditionsProps {
  onAccept: () => void;
}

export default function TermsAndConditions({ onAccept }: TermsAndConditionsProps) {
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-3xl p-8 space-y-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <Shield className="h-16 w-16 text-primary" />
          <h1 className="text-3xl font-bold">Terms and Conditions</h1>
          <p className="text-xl text-muted-foreground">
            Please read and accept before using What Is This?
          </p>
        </div>

        <Card className="bg-muted/30">
          <ScrollArea className="h-96 p-6">
            <div className="space-y-4 text-lg leading-relaxed">
              <h2 className="text-2xl font-semibold">Agreement to Terms</h2>
              <p>
                By using What Is This?, you agree to these terms and conditions.
                If you do not agree, please do not use this application.
              </p>

              <h2 className="text-2xl font-semibold mt-6">Permitted Use</h2>
              <p>
                This application is designed to help you understand products,
                documents, and other everyday items through simple explanations
                in your language.
              </p>

              <h2 className="text-2xl font-semibold mt-6">Prohibited Use</h2>
              <p className="font-semibold text-destructive">
                You are strictly prohibited from using What Is This? for any
                illegal or illicit purposes, including but not limited to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Any activities that violate local, state, national, or international laws</li>
                <li>Planning, promoting, or engaging in illegal activities</li>
                <li>Identifying items for unlawful purposes</li>
                <li>Circumventing age restrictions or content filters</li>
                <li>Harassment, threats, or harmful behavior toward others</li>
                <li>Violating intellectual property rights</li>
                <li>Any form of fraud or deception</li>
              </ul>

              <h2 className="text-2xl font-semibold mt-6">User Responsibility</h2>
              <p>
                You are solely responsible for how you use the information
                provided by this application. The explanations are for
                educational and informational purposes only.
              </p>

              <h2 className="text-2xl font-semibold mt-6">Age Requirements</h2>
              <p>
                Users must provide accurate age information. Content filtering
                is applied based on age to protect minors from inappropriate
                content.
              </p>

              <h2 className="text-2xl font-semibold mt-6">Privacy</h2>
              <p>
                Your age preference is stored locally on your device. Images
                and questions are processed to provide explanations but are not
                permanently stored.
              </p>

              <h2 className="text-2xl font-semibold mt-6">No Warranty</h2>
              <p>
                The information provided is for general guidance only. Always
                verify important information from official sources. We make no
                guarantees about the accuracy or completeness of explanations.
              </p>

              <h2 className="text-2xl font-semibold mt-6">Termination</h2>
              <p>
                We reserve the right to restrict or terminate access to users
                who violate these terms.
              </p>

              <p className="mt-6 pt-6 border-t border-border">
                By checking the box below and clicking "I Agree", you
                acknowledge that you have read, understood, and agree to be
                bound by these terms and conditions.
              </p>
            </div>
          </ScrollArea>
        </Card>

        <div className="flex items-start gap-3 p-4 bg-muted/20 rounded-xl">
          <Checkbox
            id="terms"
            checked={agreed}
            onCheckedChange={(checked) => setAgreed(checked === true)}
            className="mt-1 h-6 w-6"
            data-testid="checkbox-agree"
          />
          <label
            htmlFor="terms"
            className="text-lg leading-relaxed cursor-pointer flex-1"
          >
            I have read and agree to the Terms and Conditions. I understand
            that I must not use this app for any illegal or illicit purposes.
          </label>
        </div>

        <Button
          size="lg"
          onClick={onAccept}
          disabled={!agreed}
          className="w-full min-h-16 text-xl"
          data-testid="button-accept-terms"
        >
          <CheckCircle2 className="h-6 w-6 mr-2" />
          I Agree - Continue
        </Button>
      </Card>
    </div>
  );
}
