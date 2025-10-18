import TokenPurchase from "../TokenPurchase";

export default function TokenPurchaseExample() {
  return (
    <TokenPurchase
      onPurchase={(packageIndex) => {
        console.log("Purchased package:", packageIndex);
      }}
      onClose={() => {
        console.log("Closed");
      }}
    />
  );
}
