import { useState } from "react";
import ExplanationDisplay from "../ExplanationDisplay";

export default function ExplanationDisplayExample() {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const mockPhoto = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200'%3E%3Crect width='400' height='200' fill='%23e5e7eb'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='20' fill='%239ca3af'%3EProduct Photo%3C/text%3E%3C/svg%3E";

  const mockSections = [
    {
      title: "What is this?",
      content: "This is a water bottle. You use it to carry water when you go out.",
      icon: "info" as const,
    },
    {
      title: "How to use",
      content: "Open the lid by twisting it. Fill with water. Close the lid tightly. Press the button to drink.",
      icon: "wrench" as const,
    },
    {
      title: "Safety",
      content: "Do not use hot water. Clean every day. Keep away from fire.",
      icon: "warning" as const,
    },
  ];

  return (
    <div className="p-4 max-w-2xl">
      <ExplanationDisplay
        photo={mockPhoto}
        productName="Water Bottle"
        sections={mockSections}
        textSize="medium"
        onTextToSpeech={() => {
          console.log("Text to speech clicked");
          setIsSpeaking(!isSpeaking);
        }}
        isSpeaking={isSpeaking}
      />
    </div>
  );
}
