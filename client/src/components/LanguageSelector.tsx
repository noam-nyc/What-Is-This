import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const SUPPORTED_LANGUAGES = [
  { code: "en", name: "English", nativeName: "English", flag: "🇺🇸" },
  { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸" },
  { code: "zh", name: "Chinese", nativeName: "中文", flag: "🇨🇳" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳" },
  { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇸🇦" },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷" },
  { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪" },
  { code: "ja", name: "Japanese", nativeName: "日本語", flag: "🇯🇵" },
];

interface LanguageSelectorProps {
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
}

export default function LanguageSelector({
  selectedLanguage,
  onLanguageChange,
}: LanguageSelectorProps) {
  const currentLanguage = SUPPORTED_LANGUAGES.find(
    (lang) => lang.code === selectedLanguage
  );

  return (
    <Select value={selectedLanguage} onValueChange={onLanguageChange}>
      <SelectTrigger
        className="min-h-14 text-lg gap-3 border-2"
        data-testid="button-language-selector"
      >
        <Globe className="h-6 w-6 flex-shrink-0" />
        <SelectValue>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{currentLanguage?.flag}</span>
            <span className="font-semibold">{currentLanguage?.nativeName}</span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {SUPPORTED_LANGUAGES.map((language) => (
          <SelectItem
            key={language.code}
            value={language.code}
            className="min-h-14 text-lg cursor-pointer"
            data-testid={`option-language-${language.code}`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{language.flag}</span>
              <span className="font-semibold">{language.nativeName}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
