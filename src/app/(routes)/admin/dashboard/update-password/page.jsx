"use client";
import { useState } from "react";
import { RiLockPasswordLine } from "react-icons/ri";
// import ToggleButton from "@/components/ToggleButton";

export default function UpdatePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [error, setError] = useState("");

  const validatePassword = (password) => {
    const minLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[^A-Za-z0-9]/.test(password);
    return minLength && hasUpper && hasLower && hasNumber && hasSymbol;
  };
// const handleToggleChange=(state)=>
// {
// console.log("seconoddddd",state);
// }
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validatePassword(newPassword)) {
      setError(
        "Password must be at least 8 characters, with uppercase, lowercase, number, and symbol."
      );
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Confirm password must match the new password.");
      return;
    }
    setError("");
    alert("✅ Password updated successfully!");
    // 👉 Call your API here
  };

  const toggleVisibility = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <div
      className="min-h-[90vh] flex items-center justify-center px-6"
      style={{ backgroundColor: "var(--color-neutral)" }}
    >
      {/* <ToggleButton initial={false} onChange={handleToggleChange}/> */}
      <div className="w-full max-w-md  backdrop-blur-lg rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Update Password
        </h1>

        {error && (
          <div className="bg-red-100 text-red-600 text-sm p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Current Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showPassword.current ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none pr-10"
                required
              />
              <button
                type="button"
                onClick={() => toggleVisibility("current")}
                className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700"
              >
                {showPassword.current ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword.new ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none pr-10"
                required
              />
              <button
                type="button"
                onClick={() => toggleVisibility("new")}
                className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700"
              >
                {showPassword.new ? "🙈" : "👁️"}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Must be at least 8 chars, include uppercase, lowercase, number, symbol.
            </p>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showPassword.confirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none pr-10"
                required
              />
              <button
                type="button"
                onClick={() => toggleVisibility("confirm")}
                className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700"
              >
                {showPassword.confirm ? "🙈" : "👁️"}
              </button>
            </div>
            {confirmPassword && confirmPassword !== newPassword && (
              <p className="text-xs text-red-500 mt-1">Passwords do not match.</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition shadow-lg"
          >
    <div className="flex items-center gap-2 justify-center">
          Update Password
     <div><RiLockPasswordLine /></div>
    </div>
          </button>
        </form>
      </div>
    </div>
  );
}
