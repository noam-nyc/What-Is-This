import { useState } from "react";
import DocumentDisplay from "../DocumentDisplay";

export default function DocumentDisplayExample() {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const mockFollowUpActions = [
    { action: "Sign and return the form by next Friday", priority: "high" as const },
    { action: "Schedule a meeting with your doctor", priority: "medium" as const },
    { action: "Keep a copy for your records", priority: "low" as const },
  ];

  return (
    <div className="p-4 max-w-2xl">
      <DocumentDisplay
        title="Medical Insurance Form"
        summary="This is a form to renew your health insurance. You need to fill in your personal information like name, address, and date of birth. Then sign at the bottom and send it back to the insurance company before the deadline."
        followUpActions={mockFollowUpActions}
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
