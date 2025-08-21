"use client";

import { useState } from "react";
import Cookies from "js-cookie";
import {
  FaTachometerAlt,
  FaUsers,
  FaChevronDown,
  FaExchangeAlt,
  FaList,
  FaHistory,
  FaSignOutAlt,
  FaLock,
} from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Sidebar({ activeTab, setActiveTab }) {
  const [openMenus, setOpenMenus] = useState({ users: false });
  const [opengameMangement, setOpenGameManagement] = useState({
    management: false,
  });
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove("adminToken");
    router.push("/admin/login");
  };

  const toggleMenu = (menu) => {
    setOpenMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };
  const toggleItems = (menu) => {
    setOpenGameManagement((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 text-black text-[20px] px-3 py-2 rounded-md"
      >
        {isMobileOpen ? "✖" : "☰"}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen  bg-(--color-neutral) border-r border-gray-200 flex flex-col p-5 space-y-4 transform transition-transform duration-300 z-40
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0 lg:static `}
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6">🎰 Admin Panel</h2>

        <nav className="space-y-2 ">
          <Link href="/admin/dashboard">
            <SidebarItem
              icon={<FaTachometerAlt />}
              label="Dashboard"
              active={activeTab === "dashboard"}
              onClick={() => setActiveTab("dashboard")}
            />
          </Link>

          {/* Users with submenu */}
          <div>
            <button
              onClick={() => toggleMenu("users")}
              className={`flex w-full items-center justify-between rounded-lg px-4 py-2 text-sm font-medium transition ${
                openMenus.users
                  ? "bg-blue-600 text-white"
                  : "text-gray-800 hover:bg-gray-100"
              }`}
            >
              <span className="flex items-center space-x-3">
                <FaUsers />
                <span>User Management</span>
              </span>
              <FaChevronDown
                className={`transition-transform ${
                  openMenus.users ? "rotate-180" : ""
                }`}
              />
            </button>

            {openMenus.users && (
              <div className="ml-8 mt-2 space-y-2">
                <Link href="/admin/dashboard/users">
                  <SubMenuItem
                    label="Ludo Users"
                    active={activeTab === "ludo-users"}
                    onClick={() => setActiveTab("ludo-users")}
                  />
                </Link>
              </div>
            )}
          </div>

          {/* Game Management */}
          <div>
            <button
              onClick={() => toggleItems("management")}
              className={`flex w-full items-center justify-between rounded-lg px-4 py-2 text-sm font-medium transition ${
                opengameMangement.management
                  ? "bg-blue-600 text-white"
                  : "text-gray-800 hover:bg-gray-100"
              }`}
            >
              <span className="flex items-center space-x-3">
                <FaUsers />
                <span>Game Management</span>
              </span>
              <FaChevronDown
                className={`transition-transform ${
                  opengameMangement.management ? "rotate-180" : ""
                }`}
              />
            </button>

            {opengameMangement.management && (
              <div className="ml-8 mt-2 space-y-2">
                <Link href="/dashboard/users">
                  <SubMenuItem
                    label="Active/completed Games"
                    active={activeTab === "Active/completed Games"}
                    onClick={() => setActiveTab("Active/completed Games")}
                  />
                </Link>
                <SubMenuItem
                  label="Game Logs"
                  active={activeTab === "Game-Logs"}
                  onClick={() => setActiveTab("Game-Logs")}
                />
              </div>
            )}
          </div>

          <SidebarItem
            icon={<FaExchangeAlt />}
            label="My Transfers"
            active={activeTab === "transfers"}
            onClick={() => setActiveTab("transfers")}
          />
          <SidebarItem
            icon={<FaList />}
            label="Bet History"
            active={activeTab === "bets"}
            onClick={() => setActiveTab("bets")}
          />
          <SidebarItem
            icon={<FaHistory />}
            label="Transactions"
            active={activeTab === "transactions"}
            onClick={() => setActiveTab("transactions")}
          />
        </nav>

        {/* Bottom buttons */}
        <div className="mt-auto space-y-2">
          <button className="flex w-full items-center space-x-2 rounded-lg px-4 py-2 bg-blue-600 text-white">
            <FaLock />
            <span>Change Password</span>
          </button>
          <button
            onClick={handleLogout}
            className="flex w-full items-center space-x-2 rounded-lg px-4 py-2 bg-red-500 text-white"
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}

function SidebarItem({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center space-x-3 rounded-lg px-4 py-2 text-sm font-medium transition ${
        active
          ? "bg-blue-600 text-white"
          : "text-gray-800 hover:bg-gray-100 cursor-pointer"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function SubMenuItem({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`block w-full text-left rounded-lg px-3 py-2 text-sm transition ${
        active
          ? "bg-blue-500 text-white"
          : "text-gray-700 hover:bg-gray-100 hover:text-black"
      }`}
    >
      {label}
    </button>
  );
}
