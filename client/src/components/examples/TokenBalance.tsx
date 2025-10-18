import TokenBalance from "../TokenBalance";

export default function TokenBalanceExample() {
  return (
    <div className="p-4">
      <TokenBalance
        tokens={1500}
        freeAnswersRemaining={2}
        onBuyTokens={() => {
          console.log("Buy tokens clicked");
        }}
      />
    </div>
  );
}
