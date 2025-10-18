import { useState } from "react";
import QuestionAnswer from "../QuestionAnswer";

export default function QuestionAnswerExample() {
  const [messages, setMessages] = useState([
    { id: "1", text: "How do I clean this?", sender: "user" as const },
    { id: "2", text: "Wash with warm soapy water. Do not put in dishwasher. Dry completely before storing.", sender: "assistant" as const },
  ]);

  const handleSendMessage = (message: string) => {
    console.log("Sending message:", message);
    const newMessage = { id: Date.now().toString(), text: message, sender: "user" as const };
    setMessages([...messages, newMessage]);
    
    // TODO: remove mock functionality - simulate assistant response
    setTimeout(() => {
      const response = { 
        id: (Date.now() + 1).toString(), 
        text: "This is a helpful answer to your question.", 
        sender: "assistant" as const 
      };
      setMessages((prev) => [...prev, response]);
    }, 1000);
  };

  return (
    <div className="p-4 max-w-2xl">
      <QuestionAnswer
        messages={messages}
        onSendMessage={handleSendMessage}
        textSize="medium"
      />
    </div>
  );
}
