import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

export default function Upload() {
  const { isAuthenticated, setShowLogin, user } = useContext(AuthContext);
  const [dragging, setDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);

    if (!isAuthenticated) {
      setShowLogin(true);
      return;
    }

    if (e.dataTransfer.files.length > 0) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (!isAuthenticated) {
      setShowLogin(true);
      return;
    }

    if (e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
  
    setUploading(true);
  
    try {
      const userId = user?._id || localStorage.getItem("userId"); // ✅ Fallback to localStorage
  
      if (!userId) {
        alert("User not authenticated. Please log in again.");
        return;
      }
  
      // 1️⃣ Get Pre-Signed URL from backend
      const { data } = await axios.get("http://localhost:5000/api/upload/get-presigned-url", {
        params: {
          filename: selectedFile.name,
          fileType: encodeURIComponent(selectedFile.type), // ✅ Fix encoding issue
          userId,
        },
      });
  
      const { presignedUrl, fileKey } = data;
  
      // 2️⃣ Upload file directly to S3
      await axios.put(presignedUrl, selectedFile, {
        headers: { "Content-Type": selectedFile.type },
      });
  
      // 3️⃣ Save metadata in MongoDB
      await axios.post("http://localhost:5000/api/upload/save-file", {
        filename: selectedFile.name,
        fileType: selectedFile.type,
        fileKey,
        size: selectedFile.size,
        userId,
      });
  
      alert("File uploaded successfully!");
      setSelectedFile(null);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed!");
    } finally {
      setUploading(false);
    }
  };
  

  return (
    <div
      className={`relative flex flex-col items-center justify-center h-[90%] transition-all ${
        dragging ? "bg-orange-800 bg-opacity-80" : "bg-black"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="p-8 rounded-lg shadow-lg text-center border border-gray-700 bg-gray-900">
        {selectedFile ? (
          <div>
            <p className="text-lg font-semibold">Selected File:</p>
            <p className="mt-2 text-sm text-gray-400">{selectedFile.name}</p>

            {/* Show file preview if it's an image */}
            {selectedFile.type.startsWith("image/") && (
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="Preview"
                className="mt-2 max-w-full h-40 object-cover rounded-lg mx-auto"
              />
            )}

            {/* Upload button */}
            <button
              onClick={handleUpload}
              className={`mt-4 px-5 py-2 text-white rounded-md transition ${
                uploading ? "bg-gray-500 cursor-not-allowed" : "bg-orange-600 hover:bg-orange-700"
              }`}
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Upload to Cloud"}
            </button>
          </div>
        ) : (
          <div>
            <img
              src="/cloud.png"
              alt="Upload"
              className="mx-auto mb-4 w-24 h-24 opacity-80"
            />
            <p className="text-lg font-semibold text-gray-200">
              Drag & Drop Files Here
            </p>
            <p className="text-gray-400 text-sm">or</p>
            <label className="cursor-pointer inline-block bg-blue-600 text-white px-5 py-2 mt-3 rounded-md hover:bg-blue-700 transition">
              Select Files
              <input type="file" className="hidden" onChange={handleFileChange} />
            </label>
          </div>
        )}
      </div>
    </div>
  );
}
