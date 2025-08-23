"use client";
import { useState } from "react";

export default function ConfirmBox({ isOpen, onClose, onConfirm, title, message }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white rounded-2xl shadow-lg w-96 p-6 border-t-4 border-blue-400">
        
        {/* Title */}
        <h2 className="text-xl font-semibold text-blue-600 mb-2">{title}</h2>
        
        {/* Message */}
        <p className="text-gray-700 mb-6">{message}</p>
        
        {/* Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
