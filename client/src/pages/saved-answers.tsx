import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Save, Trash2, CreditCard, AlertCircle, ArrowLeft, Calendar, ImageIcon, HelpCircle, MapPin, MessageCircle, BookOpen, Sparkles, Shield, Wrench, ShoppingCart } from "lucide-react";
import { useLocation } from "wouter";
import type { SavedAnswer } from "@shared/schema";

// Intent labels and icons
const INTENT_INFO: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  what_is_this: { label: "What is this?", icon: HelpCircle, color: "bg-blue-500/10 text-blue-700 border-blue-200" },
  where_from: { label: "Where is it from?", icon: MapPin, color: "bg-indigo-500/10 text-indigo-700 border-indigo-200" },
  general_info: { label: "General Info", icon: MessageCircle, color: "bg-slate-500/10 text-slate-700 border-slate-200" },
  how_to_use: { label: "How to use it", icon: BookOpen, color: "bg-green-500/10 text-green-700 border-green-200" },
  how_to_care: { label: "How to care for it", icon: Sparkles, color: "bg-purple-500/10 text-purple-700 border-purple-200" },
  is_safe: { label: "Is it safe?", icon: Shield, color: "bg-red-500/10 text-red-700 border-red-200" },
  how_to_fix: { label: "How to fix it", icon: Wrench, color: "bg-orange-500/10 text-orange-700 border-orange-200" },
  where_to_buy: { label: "Where to buy one", icon: ShoppingCart, color: "bg-pink-500/10 text-pink-700 border-pink-200" },
};

export default function SavedAnswers() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [answerToDelete, setAnswerToDelete] = useState<SavedAnswer | null>(null);

  const { data: subscription, isLoading: loadingSubscription } = useQuery<{ isPremium: boolean }>({
    queryKey: ["/api/subscription/check-premium"],
  });

  const { data: savedAnswers, isLoading: loadingAnswers } = useQuery<SavedAnswer[]>({
    queryKey: ["/api/saved-answers"],
    enabled: subscription?.isPremium === true,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/saved-answers/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/saved-answers"] });
      toast({
        title: "Answer Deleted",
        description: "The saved answer has been removed",
      });
      setDeleteDialogOpen(false);
      setAnswerToDelete(null);
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Deletion Failed",
        description: error.message || "Failed to delete saved answer",
      });
    },
  });

  const handleDeleteClick = (answer: SavedAnswer) => {
    setAnswerToDelete(answer);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (answerToDelete) {
      deleteMutation.mutate(answerToDelete.id);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
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
              const isExpanded = expandedId === answer.id;
              const data = typeof answer.data === 'string' ? JSON.parse(answer.data) : answer.data;

              return (
                <Card key={answer.id} data-testid={`card-answer-${answer.id}`} className="hover-elevate">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">
                          {answer.title}
                        </CardTitle>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDate(answer.createdAt.toString())}
                          </div>
                          {answer.imageUrl && (
                            <div className="flex items-center gap-1">
                              <ImageIcon className="h-4 w-4" />
                              Image
                            </div>
                          )}
                          {answer.analysisIntent && INTENT_INFO[answer.analysisIntent] && (() => {
                            const IntentIcon = INTENT_INFO[answer.analysisIntent].icon;
                            return (
                              <Badge variant="outline" className={`text-xs ${INTENT_INFO[answer.analysisIntent].color}`}>
                                <IntentIcon className="h-3 w-3 mr-1" />
                                {INTENT_INFO[answer.analysisIntent].label}
                              </Badge>
                            );
                          })()}
                          {data.tokensUsed && (
                            <Badge variant="outline" className="text-xs">
                              {data.tokensUsed.toLocaleString()} tokens
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClick(answer)}
                        className="h-10 w-10 text-destructive hover:bg-destructive/10"
                        data-testid={`button-delete-${answer.id}`}
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {answer.imageUrl && (
                      <div className="rounded-lg overflow-hidden border">
                        <img
                          src={answer.imageUrl}
                          alt="Analysis subject"
                          className="w-full h-auto max-h-64 object-contain bg-muted"
                          data-testid={`img-answer-${answer.id}`}
                        />
                      </div>
                    )}

                    <div className={isExpanded ? "" : "line-clamp-3"}>
                      <p className="text-lg leading-relaxed whitespace-pre-wrap">
                        {data.answer || answer.preview || "No answer available"}
                      </p>
                    </div>

                    {data.safetyAlert && (
                      <Alert className="border-orange-500 bg-orange-50">
                        <AlertCircle className="h-5 w-5 text-orange-600" />
                        <AlertDescription className="text-base ml-2">
                          <strong>Safety Alert:</strong> {data.safetyAlert}
                        </AlertDescription>
                      </Alert>
                    )}

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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl">Delete Saved Answer?</AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              This action cannot be undone. This will permanently delete this saved answer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="h-12 text-lg"
              onClick={() => {
                setDeleteDialogOpen(false);
                setAnswerToDelete(null);
              }}
              data-testid="button-cancel-delete"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="h-12 text-lg bg-destructive hover:bg-destructive/90"
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
              data-testid="button-confirm-delete"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
