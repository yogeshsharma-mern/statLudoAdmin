// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // 👈 ye zaroori hai
    "./app/**/*.{js,ts,jsx,tsx}", // 👈 app dir ke liye
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          light: "#E0F2FE",  // light blue background
          DEFAULT: "#3B82F6", // main blue
          dark: "#1E3A8A",    // dark blue
        },
        background: {
          light: "#F9FAFB",   // page bg
          sidebar: "#EFF6FF", // sidebar bg
        },
      },
    },
  },
  plugins: [],
}
