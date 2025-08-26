// components/ToggleButton.jsx
import { useState } from "react";

export default function ToggleButton({ initial = false, onChange }) {
  const [enabled, setEnabled] = useState(initial);
  const handleToggle = () => {
    const newState = !enabled;
    setEnabled(newState);
    if (onChange) onChange(newState); // pass value to parent
  };

  return (
    <button
      onClick={handleToggle}
      className={`relative inline-flex  h-6 w-11 items-center rounded-full transition-colors ${
        enabled ? "bg-green-500" : "bg-gray-300"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform cursor-pointer rounded-full bg-white transition-transform ${
          enabled ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}
