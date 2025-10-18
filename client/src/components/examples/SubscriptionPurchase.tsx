import SubscriptionPurchase from "../SubscriptionPurchase";

export default function SubscriptionPurchaseExample() {
  return (
    <SubscriptionPurchase
      onSubscribe={() => {
        console.log("Subscribed");
      }}
      onClose={() => {
        console.log("Closed");
      }}
    />
  );
}
