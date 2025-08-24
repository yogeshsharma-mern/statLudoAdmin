// "use client";

// import { useState } from "react";
// import { FiUploadCloud } from "react-icons/fi";
// import {axiosApiInstance} from "@/library/helper";
// import toast from "react-hot-toast";
// export default function Page() {
//   const [upiId, setUpiId] = useState("");
//   const [file, setFile] = useState(null);
//   const [preview, setPreview] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files[0];
//     if (selectedFile) {
//       setFile(selectedFile);
//       setPreview(URL.createObjectURL(selectedFile));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!upiId || !file) {
//       alert("Please enter UPI ID and upload QR code");
//       return;
//     }

//     setLoading(true);
    
//     try {
//       const formData = new FormData();
//       formData.append("upiId", upiId);
//       formData.append("scanner", file);

//       const res = await axiosApiInstance.post("/upload-scanner",formData);
// console.log("resupi",res);
//       if (res.data.status===200) {
//       toast.success(res.data.message);
//         setUpiId("");
//         setFile(null);
//         setPreview(null);
//       } else {
//        toast.error(res.data.status);
//       }
//     } catch (err) {
//       console.error(err);
//       alert("⚠️ Something went wrong!");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center  p-6">
//       <div className="w-full max-w-xl bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-8">
//         <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
//           📲 Upload UPI QR Code
//         </h1>

//         <form
//           onSubmit={handleSubmit}
//           className="space-y-6 flex flex-col items-center"
//         >
//           {/* UPI ID Input */}
//           <div className="w-full">
//             <label className="block text-sm font-medium text-gray-600 mb-1">
//               Enter UPI ID
//             </label>
//             <input
//               type="text"
//               value={upiId}
//               onChange={(e) => setUpiId(e.target.value)}
//               placeholder="example@upi"
//               className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
//               required
//             />
//           </div>

//           {/* QR Upload */}
//           <div className="w-full border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-indigo-500 transition">
//             <input
//               type="file"
//               accept="image/*"
//               onChange={handleFileChange}
//               className="hidden"
//               id="qrUpload"
//             />
//             <label htmlFor="qrUpload" className="cursor-pointer flex flex-col items-center">
//               {preview ? (
//                 <img
//                   src={preview}
//                   alt="QR Preview"
//                   className="w-40 h-40 object-contain mb-3 rounded-lg shadow"
//                 />
//               ) : (
//                 <FiUploadCloud size={48} className="text-indigo-500 mb-2" />
//               )}
//               <span className="text-gray-600 text-sm">
//                 {preview ? "Change QR Code" : "Click to Upload QR Code"}
//               </span>
//             </label>
//           </div>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition shadow-lg disabled:opacity-50"
//           >
//             {loading ? "Uploading..." : "🚀 Upload Now"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }
"use client";

import { useState } from "react";
import { FiUploadCloud } from "react-icons/fi";
import axios from "axios";
import toast from "react-hot-toast";
import { IoIosAdd } from "react-icons/io";
import { IoIosArrowRoundBack } from "react-icons/io";
import {axiosApiInstance} from "@/library/helper";
import { FaEdit } from "react-icons/fa";


export default function Page() {
  // Dummy scanners for demo
  const [scanners, setScanners] = useState([
    {
      id: 1,
      upiId: "demo@upi",
      url: "https://plus.unsplash.com/premium_photo-1755612015739-942bd6de858c?w=300",
    },
  ]);

  const [mode, setMode] = useState("view"); // view | add | edit
  const [currentScanner, setCurrentScanner] = useState(null);

  // Form states
  const [upiId, setUpiId] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // file select
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  // Add / Edit submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!upiId) {
      alert("Please enter UPI ID");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("upiId", upiId);
      if (file) formData.append("scanner", file);

      let res;
      if (mode === "add") {
        // ADD API
        res = await axiosApiInstance.post("/admin/upload-scanner", formData);
        if (res.data.status === 200) {
          toast.success("Scanner Added!");
          setScanners([
            ...scanners,
            { id: Date.now(), upiId, url: preview || "" },
          ]);
        }
      } else if (mode === "edit" && currentScanner) {
        // EDIT API
        res = await axios.put(`/admin/update-scanner/${currentScanner.id}`, formData);
        if (res.data.status === 200) {
          toast.success("Scanner Updated!");
          setScanners(
            scanners.map((s) =>
              s.id === currentScanner.id
                ? { ...s, upiId, url: preview || s.url }
                : s
            )
          );
        }
      }

      // reset form
      setUpiId("");
      setFile(null);
      setPreview(null);
      setCurrentScanner(null);
      setMode("view");
    } catch (err) {
      console.error(err);
      toast.error("⚠️ Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  // open edit form
  const handleEdit = (scanner) => {
    setCurrentScanner(scanner);
    setUpiId(scanner.upiId);
    setPreview(scanner.url);
    setMode("edit");
  };

  return (
    <div className="w-full p-10">
      {/* Top buttons */}
      <div className="flex justify-end w-full mr-5 gap-2">
        {mode !== "view" && (
          <button
            onClick={() => {
              setMode("view");
              setCurrentScanner(null);
              setUpiId("");
              setPreview(null);
              setFile(null);
            }}
            className="px-3 mt-3 py-2 bg-blue-500 cursor-pointer rounded-md text-white"
          >
            <div className="flex gap-1 items-center">
 <IoIosArrowRoundBack />
            Back
            </div>
           
          </button>
        )}
        {mode === "view" && (
          <button
            onClick={() => setMode("add")}
            className="px-3 mt-3 py-2 bg-blue-500 cursor-pointer rounded-md text-white"
          >
            <div className="flex gap-1 items-center">
  <IoIosAdd />
             Add Scanner
            </div>
          
          </button>
        )}
      </div>

      {/* Conditional Rendering */}
      {mode === "view" && (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center md:p-6">
          {scanners.map((s) => (
            <div
              key={s.id}
              className="bg-white w-full shadow-md rounded-2xl p-6 max-w-md w-full text-center mb-4"
            >
              <h1 className="text-2xl font-bold mb-4">📷 Scanner</h1>
              <img
                src={s.url}
                alt="Scanner QR"
                className="w-60 h-60 object-cover rounded-lg mx-auto mb-4 border"
              />
              <p className="text-lg font-medium text-gray-700">
                <span className="font-semibold">UPI ID:</span> {s.upiId}
              </p>
              <button
                onClick={() => handleEdit(s)}
                className="mt-4 px-3 py-2 bg-blue-500 cursor-pointer rounded-md text-white"
              >
                <div className="flex items-center gap-1">
 <FaEdit />
                 Edit
                </div>
               
              </button>
            </div>
          ))}
        </div>
      )}

      {(mode === "add" || mode === "edit") && (
        <div className=" flex justify-center md:p-6">
          <div className="w-full max-w-xl bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-8">
            <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
              {mode === "add" ? "📲 Upload UPI QR Code" : "✏ Edit Scanner"}
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
                <label
                  htmlFor="qrUpload"
                  className="cursor-pointer flex flex-col items-center"
                >
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
                {loading
                  ? "Saving..."
                  : mode === "add"
                  ? "🚀 Upload Now"
                  : "💾 Save Changes"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
