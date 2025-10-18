import LoadingState from "../LoadingState";

export default function LoadingStateExample() {
  return (
    <div className="p-4">
      <LoadingState message="Analyzing your photo..." />
    </div>
  );
}
