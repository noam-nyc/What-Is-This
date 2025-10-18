import { Coins, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface TokenBalanceProps {
  tokens: number;
  freeAnswersRemaining: number;
  onBuyTokens: () => void;
}

export default function TokenBalance({
  tokens,
  freeAnswersRemaining,
  onBuyTokens,
}: TokenBalanceProps) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      {freeAnswersRemaining > 0 && (
        <Badge className="min-h-10 text-base px-4 bg-chart-2 text-white">
          {freeAnswersRemaining} Free Answer{freeAnswersRemaining !== 1 ? "s" : ""} Left
        </Badge>
      )}
      
      <div className="flex items-center gap-2">
        <Coins className="h-5 w-5 text-primary" />
        <span className="text-lg font-semibold" data-testid="text-token-balance">
          {tokens.toLocaleString()} Tokens
        </span>
      </div>
      
      <Button
        size="sm"
        variant="outline"
        onClick={onBuyTokens}
        className="min-h-10"
        data-testid="button-buy-tokens"
      >
        <Plus className="h-4 w-4 mr-1" />
        Buy Tokens
      </Button>
    </div>
  );
}
