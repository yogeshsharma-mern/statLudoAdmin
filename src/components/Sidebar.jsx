"use client";

import { useState } from "react";
import {
  FaTachometerAlt,
  FaUsers,
  FaChevronDown,
  FaSitemap,
  FaExchangeAlt,
  FaList,
  FaHistory,
  FaSignOutAlt,
  FaLock,
} from "react-icons/fa";
import Link from "next/link";

export default function Sidebar({ activeTab, setActiveTab }) {
  const [openMenus, setOpenMenus] = useState({ users: false });

  const toggleMenu = (menu) => {
    setOpenMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  return (
    <aside className="w-full h-screen bg-gray-800 flex flex-col p-5 space-y-4">
      <h2 className="text-2xl font-bold text-white mb-6">🎰 Admin Panel</h2>

      <nav className="space-y-2">
        <Link href="/dashboard">
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
                ? "bg-indigo-600 text-white"
                : "text-gray-300 hover:bg-gray-700 hover:text-white"
            }`}
          >
            <span className="flex items-center space-x-3">
              <FaUsers />
              <span>Users</span>
            </span>
            <FaChevronDown
              className={`transition-transform ${
                openMenus.users ? "rotate-180" : ""
              }`}
            />
          </button>

          {openMenus.users && (
            <div className="ml-8 mt-2 space-y-2">
          <Link href="/dashboard/users">
              <SubMenuItem
                label="Ludo Users"
                active={activeTab === "ludo-users"}
                onClick={() => setActiveTab("ludo-users")}
              />
          </Link>
              <SubMenuItem
                label="Snake Game Users"
                active={activeTab === "snake-users"}
                onClick={() => setActiveTab("snake-users")}
              />
              <SubMenuItem
                label="Poker Users"
                active={activeTab === "poker-users"}
                onClick={() => setActiveTab("poker-users")}
              />
            </div>
          )}
        </div>

        <SidebarItem
          icon={<FaSitemap />}
          label="Tree"
          active={activeTab === "tree"}
          onClick={() => setActiveTab("tree")}
        />
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

      <div className="mt-auto space-y-2">
        <button className="flex w-full items-center space-x-2 rounded-lg bg-gray-700 px-4 py-2 hover:bg-gray-600">
          <FaLock />
          <span>Change Password</span>
        </button>
        <button className="flex w-full items-center space-x-2 rounded-lg bg-red-600 px-4 py-2 hover:bg-red-500">
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

function SidebarItem({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center space-x-3 rounded-lg px-4 py-2 text-sm font-medium transition ${
        active
          ? "bg-indigo-600 text-white"
          : "text-gray-300 hover:bg-gray-700 hover:text-white"
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
          ? "bg-indigo-500 text-white"
          : "text-gray-400 hover:bg-gray-700 hover:text-white"
      }`}
    >
      {label}
    </button>
  );
}
