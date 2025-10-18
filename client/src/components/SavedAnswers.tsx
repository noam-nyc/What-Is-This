import { History, Trash2, FileText, ChefHat, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SavedAnswer {
  id: string;
  type: "product" | "document" | "food";
  title: string;
  date: string;
  preview: string;
}

interface SavedAnswersProps {
  answers: SavedAnswer[];
  onAnswerClick: (answerId: string) => void;
  onDelete: (answerId: string) => void;
  onClose: () => void;
}

const iconMap = {
  product: Package,
  document: FileText,
  food: ChefHat,
};

export default function SavedAnswers({
  answers,
  onAnswerClick,
  onDelete,
  onClose,
}: SavedAnswersProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl h-[90vh] flex flex-col">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <History className="h-8 w-8 text-primary" />
              <h2 className="text-3xl font-bold">Saved Answers</h2>
            </div>
            <Button
              variant="outline"
              onClick={onClose}
              className="min-h-12"
              data-testid="button-close-history"
            >
              Close
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1 p-6">
          {answers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <History className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-2xl font-semibold mb-2">No Saved Answers Yet</p>
              <p className="text-lg text-muted-foreground max-w-md">
                Your saved explanations will appear here. Start analyzing items to build your history!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {answers.map((answer) => {
                const Icon = iconMap[answer.type];
                return (
                  <Card
                    key={answer.id}
                    className="p-6 hover-elevate cursor-pointer"
                    onClick={() => onAnswerClick(answer.id)}
                    data-testid={`saved-answer-${answer.id}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-semibold mb-1">{answer.title}</h3>
                        <p className="text-base text-muted-foreground mb-2">
                          {new Date(answer.date).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                        <p className="text-base text-muted-foreground line-clamp-2">
                          {answer.preview}
                        </p>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(answer.id);
                        }}
                        className="min-h-12 min-w-12"
                        data-testid={`button-delete-${answer.id}`}
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </Card>
    </div>
  );
}
