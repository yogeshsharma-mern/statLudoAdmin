"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { loginAdmin } from "@/redux/features/adminSlice";
import { useDispatch } from "react-redux";
import { FaRegEye } from "react-icons/fa";
import { GrHide } from "react-icons/gr";
import {connectSocket} from "@/library/socket";



export default function AdminLoginPage() {
  const router = useRouter();
  const dispatcher = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [toggle, setToggle] = useState(false);

  // Run once for connection + game listeners




  // ✅ React-only validation
  const validate = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validate()) return;

//     try {
//       setLoading(true); // start loader

//       const res = await dispatcher(loginAdmin({ email, password }));
     
// // const Id = res.payload?.data?.admin?._id; // ✅ correct path
// //   console.log("id", Id, res.payload);
//       if (loginAdmin.fulfilled.match(res)) {
//         toast.success("Login successful!");
//         const adminId = Cookies.get("adminId");
// console.log("Admin ID from cookies:", adminId);
//         connectSocket(adminId);
//          socket.emit("register_admin", adminId);

//         // handleLogin(Id);
//         router.push("/admin/dashboard");
//       } else {
//         toast.error(res.payload || "Login failed");
//       }
//     } catch (error) {
//       toast.error("Something went wrong!");
//       // console.error("Login error:", error);
//     } finally {
//       setLoading(false); // stop loader in all cases
//     }
//   };

  // try {
  //   setLoading(true);
  //   const response = await axios.post("http://10.40.54.177:5000/api/admin/login", {
  //     email,
  //     password,
  //   });

  //   if (response.data.success === true) {
  //     Cookies.set("adminToken", response.data.data.token, { expires: 7 });
  //     toast.success(response.data.message);
  //     router.push("/dashboard");
  //   } else {
  //     toast.error(response.data.message || "Login failed");
  //   }
  // } catch (err) {
  //   toast.error("Internal Server Error");
  // } finally {
  //   setLoading(false);
  // }
const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validate()) return;

  setLoading(true);
  try {
    const res = await dispatcher(loginAdmin({ email, password }));

    if (loginAdmin.fulfilled.match(res)) {
      toast.success("Login successful!");

      const adminId = Cookies.get("adminId");
      console.log("Admin ID from cookies:", adminId);

      connectSocket(adminId); // ✅ ek hi baar connect hoga

      router.push("/admin/dashboard");
    } else {
      toast.error(res.payload || "Login failed");
    }
  } catch (error) {
    console.error("Login error:", error);
    toast.error("Something went wrong!");
  } finally {
    setLoading(false);
  }
};



  return (
    <div className="grid md:grid-cols-2 h-screen">
      <div className="my-auto ">
        <img src="https://img.freepik.com/free-vector/cyber-data-security-online-concept-illustration-internet-security-information-privacy-protection_1150-37328.jpg?t=st=1755620978~exp=1755624578~hmac=0d692ff39f72163a21a3ff96b72b78850f204e40cc458c21d344af44033c265b&w=2000" alt="" />
      </div>
      <div className="flex md:h-[720px] my-auto items-center justify-center bg-gray-100">
        <div className="w-full max-w-md rounded-2xl  p-8 ">
          <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">
            Admin Login
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                // ❌ no type="email"
                type="text"
                className={`mt-1 w-full text-[var( --color-text)] rounded-lg border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 ${errors.email
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  }`}
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div onClick={() => setToggle(!toggle)} className="absolute right-4 cursor-pointer top-9">
                {toggle ? <GrHide /> : <FaRegEye />}
              </div>


              <input
                type={`${toggle ? "text" : "password"}`}
                className={`mt-1 w-full rounded-lg text-[var( --color-text)] border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 ${errors.password
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  }`}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white shadow-md transition hover:bg-indigo-700 disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Only authorized admins can access this area.
          </p>
        </div>
      </div>
    </div>
  );
}
