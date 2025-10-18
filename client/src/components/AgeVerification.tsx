import { useState } from "react";
import { Shield, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface AgeVerificationProps {
  onAgeVerified: (isAdult: boolean) => void;
}

export default function AgeVerification({ onAgeVerified }: AgeVerificationProps) {
  const [age, setAge] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ageNum = parseInt(age);
    
    if (isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
      setError("Please enter a valid age");
      return;
    }

    const isAdult = ageNum >= 18;
    onAgeVerified(isAdult);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-2xl p-8 space-y-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <Shield className="h-16 w-16 text-primary" />
          <h1 className="text-3xl font-bold">Welcome to Xplain This</h1>
          <p className="text-xl text-muted-foreground max-w-lg">
            To keep you safe, please tell us your age
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <label htmlFor="age" className="text-xl font-semibold flex items-center gap-2">
              <Calendar className="h-6 w-6 text-primary" />
              How old are you?
            </label>
            <Input
              id="age"
              type="number"
              value={age}
              onChange={(e) => {
                setAge(e.target.value);
                setError("");
              }}
              placeholder="Enter your age"
              className="min-h-16 text-2xl text-center"
              min="1"
              max="120"
              data-testid="input-age"
            />
            {error && (
              <p className="text-lg text-destructive" data-testid="text-error">
                {error}
              </p>
            )}
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={!age}
            className="w-full min-h-16 text-xl"
            data-testid="button-submit-age"
          >
            Continue
          </Button>
        </form>

        <div className="bg-muted/30 rounded-xl p-4 space-y-2">
          <p className="text-lg font-semibold">Why we ask:</p>
          <p className="text-lg leading-relaxed">
            We protect users under 18 by filtering sensitive content. Adults receive warnings before viewing potentially sensitive information.
          </p>
        </div>
      </Card>
    </div>
  );
}
