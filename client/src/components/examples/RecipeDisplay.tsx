import { useState } from "react";
import RecipeDisplay from "../RecipeDisplay";

export default function RecipeDisplayExample() {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const mockPhoto = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200'%3E%3Crect width='400' height='200' fill='%23e5e7eb'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='20' fill='%239ca3af'%3EFood Photo%3C/text%3E%3C/svg%3E";

  const mockRecipes = [
    {
      name: "Easy Tomato Pasta",
      prepTime: "20 minutes",
      servings: "2 people",
      ingredients: [
        "200g pasta (any kind)",
        "2 cups tomato sauce",
        "1 tablespoon olive oil",
        "Salt and pepper to taste",
        "Fresh basil leaves (optional)",
      ],
      instructions: [
        "Boil water in a large pot. Add a pinch of salt.",
        "Add pasta to boiling water. Cook for 8-10 minutes until soft.",
        "While pasta cooks, heat tomato sauce in a pan with olive oil.",
        "Drain the pasta when done. Mix with the warm tomato sauce.",
        "Add salt and pepper. Top with fresh basil if you have it.",
        "Serve hot and enjoy!",
      ],
      tips: [
        "You can add cheese on top for extra flavor.",
        "Any pasta shape works well with this recipe.",
      ],
    },
  ];

  return (
    <div className="p-4 max-w-2xl">
      <RecipeDisplay
        photo={mockPhoto}
        foodName="Tomato Pasta"
        recipes={mockRecipes}
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
