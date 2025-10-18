import ContentBlocked from "../ContentBlocked";

export default function ContentBlockedExample() {
  return (
    <div className="p-4">
      <ContentBlocked
        onGoBack={() => {
          console.log("User going back to try again");
        }}
        textSize="medium"
      />
    </div>
  );
}
