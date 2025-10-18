import PhotoUpload from "../PhotoUpload";

export default function PhotoUploadExample() {
  return (
    <div className="p-4">
      <PhotoUpload
        onPhotoSelect={(imageData) => {
          console.log("Photo selected:", imageData.substring(0, 50) + "...");
        }}
      />
    </div>
  );
}
