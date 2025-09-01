"use client";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { disconnectSocket } from "@/library/socket";


export default function Header() {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);

  const handleLogout = () => {
    Cookies.remove("adminToken");
    Cookies.remove("adminId");
    router.push("/admin/login");
    disconnectSocket();

  };

  // Detect system theme and set default
  useEffect(() => {
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme) {
      setDarkMode(savedTheme === "dark");
    } else {
      setDarkMode(systemPrefersDark);
    }
  }, []);

  // Apply theme whenever darkMode changes
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <header className="w-full bg-white dark:bg-gray-900 shadow-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <div className="flex-shrink-0 text-2xl font-bold text-gray-800 dark:text-white">
            {/* StarLudo */}
            <img src={'/images/image.png'} alt="" width={100} />
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">

            {/* Theme Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full cursor-pointer text-gray-800 dark:text-gray-200 transition-colors duration-300"
            >
              {darkMode ? "🌙" : "☀️"}
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center md:flex hidden cursor-pointer gap-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors duration-300"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
