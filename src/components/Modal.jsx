"use client";

import { Fragment, useEffect } from "react";
import { createPortal } from "react-dom";
import { FiX } from "react-icons/fi";

export default function Modal({ open, onClose, children, title }) {
  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50  transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative z-50 w-full max-w-lg rounded-2xl bg-white p-6  transition-all transform scale-100 animate-fadeIn">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between border-b pb-2">
          {title && <h3 className="text-lg font-semibold">{title}</h3>}
          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[70vh] overflow-y-auto">{children}</div>
      </div>
    </div>,
    document.body
  );
}
