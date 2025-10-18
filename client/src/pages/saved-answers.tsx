import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Save, Trash2, CreditCard, AlertCircle } from "lucide-react";
import { useLocation } from "wouter";

interface SavedAnswer {
  id: number;
  imageUrl: string;
  analysis: string;
  language: string;
  createdAt: string;
}

export default function SavedAnswers() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const { data: subscription, isLoading: loadingSubscription } = useQuery<{ isPremium: boolean }>({
    queryKey: ["/api/subscription/check-premium"],
  });

  const { data: savedAnswers, isLoading: loadingAnswers } = useQuery<SavedAnswer[]>({
    queryKey: ["/api/saved-answers"],
    enabled: subscription?.isPremium === true,
  });

  const handleDelete = async (id: number) => {
    try {
      await apiRequest("DELETE", `/api/saved-answers/${id}`);
      queryClient.invalidateQueries({ queryKey: ["/api/saved-answers"] });
      
      toast({
        title: "Answer deleted",
        description: "The saved answer has been removed",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Delete failed",
        description: error.message,
      });
    }
  };

  if (loadingSubscription) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-12 w-64 mb-6" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (!subscription?.isPremium) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-3xl font-bold">Saved Answers</h1>
          
          <Alert className="border-warning/50 bg-warning/10">
            <AlertCircle className="w-6 h-6 text-warning" />
            <div className="ml-3 flex-1">
              <AlertDescription className="text-lg mb-4">
                Saving answers is a premium feature. Upgrade to save your analysis results for later.
              </AlertDescription>
              <Button
                onClick={() => setLocation("/account")}
                className="h-12 text-lg"
                data-testid="button-upgrade"
              >
                <CreditCard className="w-5 h-5 mr-2" />
                Upgrade to Premium
              </Button>
            </div>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold">Saved Answers</h1>
            <p className="text-lg text-muted-foreground mt-1">
              Your saved analysis results
            </p>
          </div>
          <Badge className="text-base px-4 py-2" data-testid="badge-premium">
            <CreditCard className="w-4 h-4 mr-2" />
            Premium Feature
          </Badge>
        </div>

        {loadingAnswers ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-48 w-full" />
            ))}
          </div>
        ) : !savedAnswers || savedAnswers.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Save className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No saved answers yet</h3>
              <p className="text-lg text-muted-foreground mb-6">
                When you analyze images, you can save the results here for later reference
              </p>
              <Button
                onClick={() => setLocation("/")}
                className="h-12 text-lg"
                data-testid="button-analyze-now"
              >
                Analyze an Image
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {savedAnswers.map((answer) => {
              const analysis = JSON.parse(answer.analysis);
              const isExpanded = expandedId === answer.id;

              return (
                <Card key={answer.id} data-testid={`card-answer-${answer.id}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">
                          {new Date(answer.createdAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </CardTitle>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="outline" className="text-sm">
                            {answer.language.toUpperCase()}
                          </Badge>
                          {analysis.contentType && (
                            <Badge variant="outline" className="text-sm">
                              {analysis.contentType}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(answer.id)}
                        className="h-10 w-10 text-destructive hover:bg-destructive/10"
                        data-testid={`button-delete-${answer.id}`}
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {answer.imageUrl && (
                      <img
                        src={answer.imageUrl}
                        alt="Analyzed image"
                        className="w-full max-h-48 object-contain rounded-lg border"
                        data-testid={`img-answer-${answer.id}`}
                      />
                    )}

                    <div className={isExpanded ? "" : "line-clamp-3"}>
                      <p className="text-lg leading-relaxed">
                        {analysis.explanation}
                      </p>
                    </div>

                    <Button
                      variant="outline"
                      onClick={() => setExpandedId(isExpanded ? null : answer.id)}
                      className="h-10 text-base"
                      data-testid={`button-toggle-${answer.id}`}
                    >
                      {isExpanded ? "Show Less" : "Show More"}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
