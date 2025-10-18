import AgeVerification from "../AgeVerification";

export default function AgeVerificationExample() {
  return (
    <AgeVerification
      onAgeVerified={(isAdult) => {
        console.log("Age verified. Is adult:", isAdult);
      }}
    />
  );
}
