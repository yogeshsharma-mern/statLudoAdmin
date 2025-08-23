"use client";
import { useEffect, useState } from "react";

export default function UserFormModal({ open, onClose, onSubmit, initial ,userDetail}) {
  console.log("initaildata",userDetail);
  const [form, setForm] = useState({
    fullName: "",
    username: "",
    phone: "",
    profile: "",
    isBanned: false,
    isActive: true,
    cashWon: "",
    battlePlayed: "",
    referralEarning: "",
    penalty: "",
    winningAmount: "",
    completedGames: "",
    referRank: "",
    isRegistered: true,
    credit: "",
    referCode: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open && initial?._id) {
      setForm(initial); // Prefill existing data
    }
  }, [initial, open]);

  if (!open) return null;

  // Validation rules
  const validateField = (name, value) => {
    switch (name) {
      case "fullName":
      case "username":
        return value.trim() ? "" : `${name} is required`;
      case "phone":
        return /^\d{10}$/.test(value) ? "" : "Phone must be 10 digits";
      case "profile":
        return value.startsWith("http") ? "" : "Profile must be a valid URL";
      case "cashWon":
      case "battlePlayed":
      case "referralEarning":
      case "penalty":
      case "winningAmount":
      case "completedGames":
      case "referRank":
      case "credit":
        return /^\d+$/.test(value) ? "" : "Must be a number";
      case "referCode":
        return value.trim() ? "" : "Refer code is required";
      default:
        return "";
    }
  };

  const validate = () => {
    const newErrors = {};
    Object.keys(form).forEach((key) => {
      const error = validateField(key, form[key]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({
      ...f,
      [name]: type === "checkbox" ? checked : value,
    }));

    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(form);
  };

  const errorClass = "text-red-600 text-sm mt-1";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-black">Edit User</h3>
          <button
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-gray-500 hover:bg-gray-100"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          {/* Full Name */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-black">Full Name</label>
            <input
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              className="w-full rounded-lg border px-3 py-2 text-black"
            />
            {errors.fullName && <p className={errorClass}>{errors.fullName}</p>}
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-black">Username</label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              className="w-full rounded-lg border px-3 py-2 text-black"
            />
            {errors.username && <p className={errorClass}>{errors.username}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-black">Phone</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full rounded-lg border px-3 py-2 text-black"
              maxLength={10}
            />
            {errors.phone && <p className={errorClass}>{errors.phone}</p>}
          </div>

          {/* Profile */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-black">Profile URL</label>
            <input
              name="profile"
              value={form.profile}
              onChange={handleChange}
              className="w-full rounded-lg border px-3 py-2 text-black"
            />
            {errors.profile && <p className={errorClass}>{errors.profile}</p>}
          </div>

          {/* Numeric fields */}
          {[
            "cashWon",
            "battlePlayed",
            "referralEarning",
            "penalty",
            "winningAmount",
            "completedGames",
            "referRank",
            "credit",
          ].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-black">
                {field}
              </label>
              <input
                name={field}
                value={form[field]}
                onChange={handleChange}
                className="w-full rounded-lg border px-3 py-2 text-black"
              />
              {errors[field] && <p className={errorClass}>{errors[field]}</p>}
            </div>
          ))}

          {/* Refer Code */}
          <div>
            <label className="block text-sm font-medium text-black">Refer Code</label>
            <input
              name="referCode"
              value={form.referCode}
              onChange={handleChange}
              className="w-full rounded-lg border px-3 py-2 text-black"
            />
            {errors.referCode && <p className={errorClass}>{errors.referCode}</p>}
          </div>

          {/* Status */}
          <div className="col-span-2 flex gap-6">
            <label className="flex items-center gap-2 text-black">
              <input
                type="radio"
                name="status"
                value="Active"
                checked={form.isActive}
                onChange={() =>
                  setForm((f) => ({ ...f, isActive: true, isBanned: false }))
                }
              />
              Active
            </label>
            <label className="flex items-center gap-2 text-black">
              <input
                type="radio"
                name="status"
                value="Banned"
                checked={form.isBanned}
                onChange={() =>
                  setForm((f) => ({ ...f, isActive: false, isBanned: true }))
                }
              />
              Banned
            </label>
            <label className="flex items-center gap-2 text-black">
              <input
                type="checkbox"
                name="isRegistered"
                checked={form.isRegistered}
                onChange={handleChange}
              />
              Registered
            </label>
          </div>

          {/* Buttons */}
          <div className="col-span-2 flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-black hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
