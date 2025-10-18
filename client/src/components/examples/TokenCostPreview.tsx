import TokenCostPreview from "../TokenCostPreview";

export default function TokenCostPreviewExample() {
  return (
    <div className="p-4">
      <TokenCostPreview
        estimatedTokens={250}
        currentBalance={1500}
        freeAnswersRemaining={0}
        onProceed={() => {
          console.log("Proceeding with analysis");
        }}
        onCancel={() => {
          console.log("Cancelled");
        }}
        textSize="medium"
      />
    </div>
  );
}
