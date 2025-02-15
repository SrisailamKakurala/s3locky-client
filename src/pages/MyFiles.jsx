import { useEffect, useState } from "react";
import axios from "axios";
import { FaDownload, FaTrash, FaFileAlt } from "react-icons/fa";

export default function MyFiles() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        console.error("No user ID found in localStorage");
        setLoading(false);
        return;
      }

      const { data } = await axios.get(`http://localhost:5000/api/files/${userId}`);
      setFiles(data);
    } catch (error) {
      console.error("Error fetching files:", error);
    } finally {
      setLoading(false);
    }
  };

  // 📌 Delete file after confirmation
  const handleDelete = async (fileId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this file?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/files/${fileId}`);
      setFiles(files.filter(file => file._id !== fileId));
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  // 🔽🔽 Force File Download Function 🔽🔽
  const handleDownload = async (file) => {
    try {
      const response = await fetch(file.signedUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      // Create a temporary download link
      const a = document.createElement("a");
      a.href = url;
      a.download = file.filename; // Set the filename
      document.body.appendChild(a);
      a.click();

      // Clean up the URL object
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download file. Try again.");
    }
  };

  return (
    <div className="p-6 overflow-y-scroll max-h-[90%]">
      <h1 className="text-3xl font-bold mb-6">My Files</h1>

      {loading ? (
        <p>Loading...</p>
      ) : files.length === 0 ? (
        <p>No files uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {files.map((file) => (
            <div key={file._id} className="p-4 border rounded-lg shadow-md relative">
              {/* Preview Section */}
              <div className="h-40 flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
                {file.type?.startsWith("image/") ? (
                  <img src={file.signedUrl} alt={file.filename} className="w-full h-full object-cover" />
                ) : file.type === "application/pdf" ? (
                  <iframe src={file.signedUrl} className="w-full h-full" title={file.filename}></iframe>
                ) : file.type?.startsWith("video/") ? (
                  <video controls className="w-full h-full">
                    <source src={file.signedUrl} type={file.type} />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <FaFileAlt className="text-gray-500 text-5xl" />
                )}
              </div>

              {/* File Info */}
              <div className="mt-3 text-center">
                <p className="text-sm font-semibold truncate">{file.filename}</p>
                <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>

                {/* 🚀 Download Button */}
                {file.signedUrl ? (
                <button
                    onClick={() => handleDownload(file)}
                    className="mt-3 flex items-center justify-center text-blue-600 hover:text-blue-800 cursor-pointer"
                >
                    <FaDownload className="mr-2" /> Download
                </button>
                ) : (
                  <p className="text-red-500 text-xs">File not available</p>
                )}

                {/* 🚮 Delete Button */}
                <button
                  onClick={() => handleDelete(file._id)}
                  className="absolute bottom-4 right-2 text-red-600 hover:text-red-800"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
