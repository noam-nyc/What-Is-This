import { useState } from "react";
import TextSizeControl from "../TextSizeControl";

export default function TextSizeControlExample() {
  const [size, setSize] = useState<"small" | "medium" | "large">("medium");

  return (
    <div className="p-4">
      <TextSizeControl
        size={size}
        onSizeChange={(newSize) => {
          console.log("Text size changed to:", newSize);
          setSize(newSize);
        }}
      />
      <p className="mt-4 text-muted-foreground">Current size: {size}</p>
    </div>
  );
}
