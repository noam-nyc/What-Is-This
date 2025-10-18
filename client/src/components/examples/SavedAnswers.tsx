import { useState } from "react";
import SavedAnswers from "../SavedAnswers";

export default function SavedAnswersExample() {
  const [answers, setAnswers] = useState([
    {
      id: "1",
      type: "product" as const,
      title: "Smart Water Bottle",
      date: new Date().toISOString(),
      preview: "This is a smart water bottle. It helps you remember to drink water throughout the day...",
    },
    {
      id: "2",
      type: "food" as const,
      title: "Fresh Tomatoes",
      date: new Date(Date.now() - 86400000).toISOString(),
      preview: "Simple Tomato Salad - A fresh and easy recipe using ripe tomatoes...",
    },
  ]);

  return (
    <SavedAnswers
      answers={answers}
      onAnswerClick={(id) => {
        console.log("Clicked answer:", id);
      }}
      onDelete={(id) => {
        console.log("Deleting answer:", id);
        setAnswers(answers.filter(a => a.id !== id));
      }}
      onClose={() => {
        console.log("Closed");
      }}
    />
  );
}
