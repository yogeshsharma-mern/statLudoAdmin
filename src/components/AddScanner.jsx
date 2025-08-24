"use client";

import { useState } from "react";
import { FiUploadCloud } from "react-icons/fi";
import {axiosApiInstance} from "@/library/helper";
import toast from "react-hot-toast";
export default function Page() {
  const [upiId, setUpiId] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!upiId || !file) {
      alert("Please enter UPI ID and upload QR code");
      return;
    }

    setLoading(true);
    
    try {
      const formData = new FormData();
      formData.append("upiId", upiId);
      formData.append("scanner", file);

      const res = await axiosApiInstance.post("/admin/upload-scanner",formData);
console.log("resupi",res);
      if (res.data.status===200) {
      toast.success(res.data.message);
        setUpiId("");
        setFile(null);
        setPreview(null);
      } else {
       toast.error(res.data.status);
      }
    } catch (err) {
      console.error(err);
      alert("⚠️ Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center  p-6">
      <div className="w-full max-w-xl bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          📲 Upload UPI QR Code
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 flex flex-col items-center"
        >
          {/* UPI ID Input */}
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Enter UPI ID
            </label>
            <input
              type="text"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              placeholder="example@upi"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              required
            />
          </div>

          {/* QR Upload */}
          <div className="w-full border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-indigo-500 transition">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="qrUpload"
            />
            <label htmlFor="qrUpload" className="cursor-pointer flex flex-col items-center">
              {preview ? (
                <img
                  src={preview}
                  alt="QR Preview"
                  className="w-40 h-40 object-contain mb-3 rounded-lg shadow"
                />
              ) : (
                <FiUploadCloud size={48} className="text-indigo-500 mb-2" />
              )}
              <span className="text-gray-600 text-sm">
                {preview ? "Change QR Code" : "Click to Upload QR Code"}
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition shadow-lg disabled:opacity-50"
          >
            {loading ? "Uploading..." : "🚀 Upload Now"}
          </button>
        </form>
      </div>
    </div>
  );
}
