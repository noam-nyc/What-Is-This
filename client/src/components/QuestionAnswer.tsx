import { useState, useRef } from "react";
import { Send, Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  text: string;
  sender: "user" | "assistant";
}

interface QuestionAnswerProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  textSize: "small" | "medium" | "large";
}

const sizeMap = {
  small: "text-lg",
  medium: "text-xl",
  large: "text-2xl",
};

export default function QuestionAnswer({
  messages,
  onSendMessage,
  textSize,
}: QuestionAnswerProps) {
  const [inputText, setInputText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      onSendMessage(inputText.trim());
      setInputText("");
    }
  };

  const handleVoiceInput = () => {
    setIsRecording(!isRecording);
    console.log("Voice input:", isRecording ? "stopped" : "started");
    // TODO: remove mock functionality - implement real speech recognition
    if (!isRecording) {
      setTimeout(() => {
        setIsRecording(false);
        setInputText("How do I use this product?");
      }, 2000);
    }
  };

  return (
    <Card className="p-6 space-y-4">
      <h2 className={`${sizeMap[textSize]} font-semibold`}>Ask Questions</h2>
      
      {messages.length > 0 && (
        <ScrollArea className="h-96 pr-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
                data-testid={`message-${message.id}`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-2xl ${
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p className={`${sizeMap[textSize]} leading-relaxed`}>
                    {message.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          ref={inputRef}
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type your question here..."
          className="min-h-14 text-lg flex-1"
          data-testid="input-question"
        />
        <Button
          type="button"
          size="icon"
          variant={isRecording ? "destructive" : "outline"}
          onClick={handleVoiceInput}
          className="min-h-14 min-w-14"
          data-testid="button-voice-input"
        >
          {isRecording ? (
            <MicOff className="h-6 w-6" />
          ) : (
            <Mic className="h-6 w-6" />
          )}
        </Button>
        <Button
          type="submit"
          size="icon"
          disabled={!inputText.trim()}
          className="min-h-14 min-w-14"
          data-testid="button-send-question"
        >
          <Send className="h-6 w-6" />
        </Button>
      </form>

      {messages.length === 0 && (
        <div className="text-center py-8">
          <p className={`${sizeMap[textSize]} text-muted-foreground`}>
            Ask any question about this item
          </p>
        </div>
      )}
    </Card>
  );
}
