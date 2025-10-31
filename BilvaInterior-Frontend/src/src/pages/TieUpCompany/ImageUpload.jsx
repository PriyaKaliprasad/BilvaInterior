import React, { useRef, useState } from "react";

export default function ImageUpload({ allowedTypes = [".jpg", ".jpeg", ".png"] }) {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState("");

  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();

    if (!allowedTypes.includes(ext)) {
      setError(`Only these file types are allowed: ${allowedTypes.join(", ")}`);
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    setError("");
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  // Example function to get FormData (for manual upload later)
  const getFormData = () => {
    if (!selectedFile) return null;
    const formData = new FormData();
    formData.append("profilePic", selectedFile);
    return formData;
  };

  // Example manual upload (if needed later)
  const upload = async () => {
    const formData = getFormData();
    if (!formData) return;

    try {
      await fetch("http://your-backend/api/upload", {
        method: "POST",
        body: formData,
      });
      alert("Uploaded!");
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        onClick={openFileDialog}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " " ? openFileDialog() : null)}
        style={{
          border: "2px dashed #999",
          borderRadius: 8,
          padding: 20,
          textAlign: "center",
          cursor: "pointer",
          background: "#fafafa",
        }}
      >
        <input
          type="file"
          accept={allowedTypes.join(",")}
          style={{ display: "none" }}
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Preview"
            style={{ maxWidth: "100px", borderRadius: 6 }}
          />
        ) : (
          <p>Click to select an image</p>
        )}
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {selectedFile && (
        <div style={{ marginTop: 10 }}>
          <p>File ready: {selectedFile.name}</p>
          {/* Optional manual upload button */}
          <button onClick={upload}>Upload Now</button>
        </div>
      )}
    </div>
  );
}
