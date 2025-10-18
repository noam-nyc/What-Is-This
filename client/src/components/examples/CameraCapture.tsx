import CameraCapture from "../CameraCapture";

export default function CameraCaptureExample() {
  return (
    <div className="p-4">
      <CameraCapture
        onCapture={(imageData) => {
          console.log("Photo captured:", imageData.substring(0, 50) + "...");
        }}
        onUploadClick={() => {
          console.log("Upload clicked");
        }}
      />
    </div>
  );
}
