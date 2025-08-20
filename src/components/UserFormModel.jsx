"use client";
import { useEffect, useState } from "react";

export default function UserFormModal({ open, onClose, onSubmit, initial }) {
  const [form, setForm] = useState({ id: "", name: "", email: "", role: "Player", status: "Active" });

  useEffect(() => {
    if (initial) setForm(initial);
    else setForm({ id: "", name: "", email: "", role: "Player", status: "Active" });
  }, [initial, open]);

  if (!open) return null;

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-semibold">{form.id ? "Edit User" : "Add User"}</h3>
          <button onClick={onClose} className="rounded-lg px-2 py-1 text-gray-500 hover:bg-gray-100">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input name="name" value={form.name} onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="John Doe" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="john@example.com" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <select name="role" value={form.role} onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option>Player</option>
                <option>Cashier</option>
                <option>Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select name="status" value={form.status} onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option>Active</option>
                <option>Blocked</option>
                <option>Pending</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="rounded-lg px-4 py-2 text-gray-600 hover:bg-gray-100">Cancel</button>
            <button type="submit" className="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
