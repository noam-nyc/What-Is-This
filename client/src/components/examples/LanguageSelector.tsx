import { useState } from "react";
import LanguageSelector from "../LanguageSelector";

export default function LanguageSelectorExample() {
  const [language, setLanguage] = useState("en");

  return (
    <div className="p-4">
      <LanguageSelector
        selectedLanguage={language}
        onLanguageChange={(lang) => {
          console.log("Language changed to:", lang);
          setLanguage(lang);
        }}
      />
    </div>
  );
}
