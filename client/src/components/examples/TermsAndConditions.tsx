import TermsAndConditions from "../TermsAndConditions";

export default function TermsAndConditionsExample() {
  return (
    <TermsAndConditions
      onAccept={() => {
        console.log("Terms accepted");
      }}
    />
  );
}
