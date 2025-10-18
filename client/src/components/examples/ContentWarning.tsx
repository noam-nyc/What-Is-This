import ContentWarning from "../ContentWarning";

export default function ContentWarningExample() {
  return (
    <div className="p-4">
      <ContentWarning
        warningType="general"
        onProceed={() => {
          console.log("User chose to proceed");
        }}
        onGoBack={() => {
          console.log("User chose to go back");
        }}
        textSize="medium"
      />
    </div>
  );
}
