import InputMethodSelector from "../InputMethodSelector";

export default function InputMethodSelectorExample() {
  return (
    <div className="p-4">
      <InputMethodSelector
        onMethodSelect={(method) => {
          console.log("Method selected:", method);
        }}
      />
    </div>
  );
}
