import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Globe } from "lucide-react";
import type { User } from "@shared/schema";

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
];

interface LanguageSelectorProps {
  user: User;
}

export default function LanguageSelector({ user }: LanguageSelectorProps) {
  const { toast } = useToast();
  const [selectedLanguage, setSelectedLanguage] = useState(user.preferredLanguage || 'en');

  const updateLanguageMutation = useMutation({
    mutationFn: async (language: string) => {
      const response = await apiRequest("PUT", "/api/auth/profile", {
        preferredLanguage: language,
      });
      return response;
    },
    onSuccess: (_, language) => {
      // Only update local state after successful backend update
      setSelectedLanguage(language);
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "Language Updated",
        description: "Your preferred language has been changed successfully",
      });
    },
    onError: (error: any, language, context) => {
      // Revert to the user's actual language on error
      setSelectedLanguage(user.preferredLanguage || 'en');
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: error.message || "Failed to update language preference",
      });
    },
  });

  const handleLanguageChange = (language: string) => {
    // Optimistically update UI
    setSelectedLanguage(language);
    updateLanguageMutation.mutate(language);
  };

  const currentLanguage = SUPPORTED_LANGUAGES.find(lang => lang.code === selectedLanguage);

  return (
    <Card data-testid="card-language-selector">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5" />
          <CardTitle>Language Preference</CardTitle>
        </div>
        <CardDescription>
          Choose your preferred language for AI analysis and explanations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label htmlFor="language-select">Preferred Language</Label>
          <Select
            value={selectedLanguage}
            onValueChange={handleLanguageChange}
            disabled={updateLanguageMutation.isPending}
          >
            <SelectTrigger 
              id="language-select" 
              className="h-12 text-lg"
              data-testid="select-language"
            >
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              {SUPPORTED_LANGUAGES.map((lang) => (
                <SelectItem 
                  key={lang.code} 
                  value={lang.code}
                  data-testid={`option-language-${lang.code}`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{lang.nativeName}</span>
                    <span className="text-muted-foreground text-sm">({lang.name})</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">
            All image analyses will be explained in {currentLanguage?.nativeName}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
