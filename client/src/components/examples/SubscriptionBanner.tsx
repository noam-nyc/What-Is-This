import SubscriptionBanner from "../SubscriptionBanner";

export default function SubscriptionBannerExample() {
  return (
    <div className="p-4">
      <SubscriptionBanner
        onUpgrade={() => {
          console.log("Upgrade clicked");
        }}
      />
    </div>
  );
}
