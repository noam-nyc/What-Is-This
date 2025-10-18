import ProductLinks from "../ProductLinks";

export default function ProductLinksExample() {
  const mockPrice = {
    amount: "29.99",
    currency: "$",
    range: "Typical price range: $25-35",
  };

  const mockPurchaseLinks = [
    { name: "Amazon", url: "https://amazon.com", type: "online" as const },
    { name: "Best Buy", url: "https://bestbuy.com", type: "online" as const },
    { name: "Walmart", url: "https://walmart.com/store-finder", type: "nearby" as const },
    { name: "Target", url: "https://target.com/store-locator", type: "nearby" as const },
  ];

  return (
    <div className="p-4 max-w-2xl">
      <ProductLinks
        wikipediaUrl="https://en.wikipedia.org/wiki/Water_bottle"
        manufacturerUrl="https://example.com/manufacturer"
        price={mockPrice}
        purchaseLinks={mockPurchaseLinks}
        textSize="medium"
      />
    </div>
  );
}
