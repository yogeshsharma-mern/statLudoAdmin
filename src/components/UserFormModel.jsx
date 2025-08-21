"use client";
import { useEffect, useState } from "react";

export default function UserFormModal({ open, onClose, onSubmit, initial }) {
  const [form, setForm] = useState({
    fullName: "",
    dob: "",
    gender: "",
    aadhaarNumber: "",
    address: "",
    email: "",
    isBanned: false,
    isActive: true,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

useEffect(() => {
  if (open && initial?._id) {
    // fetch data if needed
    setForm(initial); // prefills with existing user
  }
}, [initial, open]);



  if (!open) return null;

  const validateField = (name, value) => {
    switch (name) {
      case "fullName":
        return value.trim() ? "" : "Full name is required";
      case "email":
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? "" : "Invalid email";
      case "dob":
        if (!value) return "Date of birth is required";
        if (value >= new Date().toISOString().split("T")[0])
          return "Date of birth cannot be today or in the future";
        return "";
      case "aadhaarNumber":
        return /^\d{12}$/.test(value) ? "" : "Aadhaar must be exactly 12 digits";
      case "gender":
        return value ? "" : "Gender is required";
      case "address":
        return value.trim() ? "" : "Address is required";
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
    const newValue = type === "checkbox" ? checked : value;

    setForm((f) => ({
      ...f,
      [name]: newValue,
    }));

    // Live error removal
    const error = validateField(name, newValue);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(form);
  };
  if (!open) return null;

if (loading) {
  return (
    <div className="fixed  inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="rounded-2xl bg-white p-6 shadow-xl">
        <p>Loading user data...</p>
      </div>
    </div>
  );
}


  const errorClass = "text-red-600 text-sm mt-1";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl text-black font-semibold">Edit User</h3>
          <button
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-gray-500 hover:bg-gray-100"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-black">Full Name</label>
            <input
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
              placeholder="Amit Sharma"
            />
            {errors.fullName && <p className={errorClass}>{errors.fullName}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-black">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
              placeholder="amit.sharma@example.com"
            />
            {errors.email && <p className={errorClass}>{errors.email}</p>}
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium text-black">Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={form.dob}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
              max={new Date().toISOString().split("T")[0]}
            />
            {errors.dob && <p className={errorClass}>{errors.dob}</p>}
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-black">Gender</label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
            >
              <option value="">Select</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
            {errors.gender && <p className={errorClass}>{errors.gender}</p>}
          </div>

          {/* Aadhaar Number */}
          <div>
            <label className="block text-sm font-medium text-black">Aadhaar Number</label>
            <input
              name="aadhaarNumber"
              value={form.aadhaarNumber}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
              placeholder="123456789012"
              maxLength={12}
            />
            {errors.aadhaarNumber && <p className={errorClass}>{errors.aadhaarNumber}</p>}
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-black">Address</label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
              placeholder="456 Rose Garden Colony, Kota"
            />
            {errors.address && <p className={errorClass}>{errors.address}</p>}
          </div>

          {/* Status Radio */}
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-black">
              <input
                type="radio"
                name="status"
                value="Active"
                checked={form.isActive === true}
                onChange={() => setForm((f) => ({ ...f, isActive: true, isBanned: false }))}
              />
              Active
            </label>
            <label className="flex items-center gap-2 text-black">
              <input
                type="radio"
                name="status"
                value="Banned"
                checked={form.isActive === false}
                onChange={() => setForm((f) => ({ ...f, isActive: false, isBanned: true }))}
              />
              Banned
            </label>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-2">
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
