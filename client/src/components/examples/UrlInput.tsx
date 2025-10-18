import UrlInput from "../UrlInput";

export default function UrlInputExample() {
  return (
    <div className="p-4 max-w-2xl">
      <UrlInput
        onUrlSubmit={(url) => {
          console.log("URL submitted:", url);
        }}
      />
    </div>
  );
}
