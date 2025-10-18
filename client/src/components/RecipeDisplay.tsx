import { Volume2, ChefHat, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Recipe {
  name: string;
  prepTime: string;
  servings: string;
  ingredients: string[];
  instructions: string[];
  tips?: string[];
}

interface RecipeDisplayProps {
  photo: string;
  foodName: string;
  recipes: Recipe[];
  textSize: "small" | "medium" | "large";
  onTextToSpeech: () => void;
  isSpeaking: boolean;
}

const sizeMap = {
  small: "text-lg",
  medium: "text-xl",
  large: "text-2xl",
};

const titleSizeMap = {
  small: "text-xl",
  medium: "text-2xl",
  large: "text-3xl",
};

export default function RecipeDisplay({
  photo,
  foodName,
  recipes,
  textSize,
  onTextToSpeech,
  isSpeaking,
}: RecipeDisplayProps) {
  return (
    <div className="space-y-6 pb-24">
      <img
        src={photo}
        alt="Food"
        className="w-full max-h-48 object-cover rounded-2xl shadow-lg"
        data-testid="img-food"
      />

      <div className="flex items-center gap-3">
        <ChefHat className="h-10 w-10 text-primary flex-shrink-0" />
        <h1
          className={`${titleSizeMap[textSize]} font-bold`}
          data-testid="text-food-name"
        >
          {foodName}
        </h1>
      </div>

      {recipes.map((recipe, recipeIndex) => (
        <Card key={recipeIndex} className="p-6 space-y-6">
          <div className="space-y-3">
            <h2 className={`${titleSizeMap[textSize]} font-bold`}>
              {recipe.name}
            </h2>
            <div className="flex flex-wrap gap-3">
              <Badge className="min-h-10 text-base px-4">
                <Clock className="h-4 w-4 mr-2" />
                {recipe.prepTime}
              </Badge>
              <Badge className="min-h-10 text-base px-4">
                <Users className="h-4 w-4 mr-2" />
                {recipe.servings}
              </Badge>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className={`${sizeMap[textSize]} font-semibold`}>
              Ingredients:
            </h3>
            <ul className="space-y-2">
              {recipe.ingredients.map((ingredient, idx) => (
                <li
                  key={idx}
                  className={`${sizeMap[textSize]} leading-relaxed flex items-start gap-2`}
                  data-testid={`ingredient-${recipeIndex}-${idx}`}
                >
                  <span className="text-primary">•</span>
                  <span style={{ lineHeight: "1.8" }}>{ingredient}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className={`${sizeMap[textSize]} font-semibold`}>
              How to make it:
            </h3>
            <ol className="space-y-3">
              {recipe.instructions.map((instruction, idx) => (
                <li
                  key={idx}
                  className={`${sizeMap[textSize]} leading-relaxed flex gap-3`}
                  data-testid={`instruction-${recipeIndex}-${idx}`}
                >
                  <span className="font-semibold text-primary min-w-8">
                    {idx + 1}.
                  </span>
                  <span style={{ lineHeight: "1.8" }}>{instruction}</span>
                </li>
              ))}
            </ol>
          </div>

          {recipe.tips && recipe.tips.length > 0 && (
            <div className="space-y-3 bg-muted/30 rounded-xl p-4">
              <h3 className={`${sizeMap[textSize]} font-semibold`}>
                Helpful tips:
              </h3>
              <ul className="space-y-2">
                {recipe.tips.map((tip, idx) => (
                  <li
                    key={idx}
                    className={`${sizeMap[textSize]} leading-relaxed`}
                    style={{ lineHeight: "1.8" }}
                  >
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Card>
      ))}

      <Button
        size="lg"
        onClick={onTextToSpeech}
        className={`fixed bottom-6 right-6 min-h-16 min-w-16 rounded-full shadow-2xl ${
          isSpeaking ? "bg-destructive hover:bg-destructive/90" : ""
        }`}
        data-testid="button-text-to-speech"
      >
        <Volume2 className="h-7 w-7" />
      </Button>
    </div>
  );
}
