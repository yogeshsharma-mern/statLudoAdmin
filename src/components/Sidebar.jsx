"use client";

import { useState, useRef, useEffect } from "react";
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
import { IoGameController } from "react-icons/io5";
import { FaWallet } from "react-icons/fa";
import { TbReport } from "react-icons/tb";

export default function Sidebar({ activeTab, setActiveTab }) {
  const sidebarRef = useRef(null);
  const [openMenus, setOpenMenus] = useState({ users: false });
  const [opengameMangement, setOpenGameManagement] = useState({
    management: false,
  });

  const [wallet, setwallet] = useState({
    wallet: false,
  })
  const [report, setReport] = useState({ report: false });
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        // Close all menus
        setOpenMenus({ users: false });
        setOpenGameManagement({ management: false });
        setwallet({ wallet: false })
        setIsMobileOpen(false);
        setReport({ report: false });
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
  const togglewallet = (menu) => {
    setwallet((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };
  const toggleReport = (menu) => {
    setReport((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 bg-white left-4 flex items-center justiy-center cursor-pointer z-50 w-[20px] h-[20px] rounded-full text-black text-[20px] p-3 rounded-md"
      >
        {isMobileOpen ? "✖" : "☰"}
      </button>

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-screen  bg-[var(--color-neutral)]  border-r border-gray-200 dark:border-black flex flex-col p-5 space-y-4 transform transition-transform duration-300 z-40
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0 lg:static `}
      >
        <h2 className="text-2xl font-bold text-[var( --color-text)] mb-6">🎰 Admin Panel</h2>

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
              className={`flex w-full items-center justify-between rounded-lg px-4 py-2 text-sm font-medium transition ${openMenus.users
                  ? "bg-gray-200 text-[var( --color-text)]"
                  : "text-[var( --color-text)] hover:bg-gray-100 dark:hover:bg-black"
                }`}
            >
              <span className="flex items-center space-x-3">
                <FaUsers />
                <span>User Management</span>
              </span>
              <FaChevronDown
                className={`transition-transform ${openMenus.users ? "rotate-180" : ""
                  }`}
              />
            </button>

            {openMenus.users && (
              <div className="ml-8 mt-2 space-y-2">
                <Link href="/admin/dashboard/users">
                  <SubMenuItem
                    label="Users"
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
              className={`flex w-full items-center justify-between rounded-lg px-4 py-2 text-sm font-medium transition ${opengameMangement.management
                  ? "bg-gray-200 text-[var( --color-text)]"
                  : "text-[var( --color-text)] hover:bg-gray-100 dark:hover:bg-black"
                }`}
            >
              <span className="flex items-center space-x-3">
                <IoGameController />
                <span>Game Management</span>
              </span>
              <FaChevronDown
                className={`transition-transform ${opengameMangement.management ? "rotate-180" : ""
                  }`}
              />
            </button>

            {opengameMangement.management && (
              <div className="ml-8 mt-2 space-y-2">
                <Link href="/dashboard/users">
                  <SubMenuItem
                    label="Active/Completed Games"
                    active={activeTab === "Active/completed Games"}
                    // onClick={() => setActiveTab("Active/completed Games")}
                  />
                </Link>
              <Link href="/admin/dashboard/game-logs">
                <SubMenuItem
                  label="Game Logs"
                  active={activeTab === "Game-Logs"}
                  // onClick={() => setActiveTab("Game-Logs")}
                />
              </Link>
              </div>
            )}
          </div>

          <div>
            <button
              onClick={() => togglewallet("wallet")}
              className={`flex w-full items-center justify-between rounded-lg px-4 py-2 text-sm font-medium transition ${wallet.wallet
                  ? "bg-blue-600 text-[var( --color-text)]"
                  : "text-[var( --color-text)] hover:bg-gray-100 dark:hover:bg-black"
                }`}
            >
              <span className="flex items-center space-x-3">
                <FaWallet />
                <span>Wallet & Transactions</span>
              </span>
              <FaChevronDown
                className={`transition-transform ${wallet.wallet ? "rotate-180" : ""
                  }`}
              />
            </button>

            {wallet.wallet && (
              <div className="ml-8 mt-2 space-y-2">
                <Link href="/dashboard/users">
                  <SubMenuItem
                    label="Coin Balance"
                    active={activeTab === "coin-balance"}
                    onClick={() => setActiveTab("coin-balance")}
                  />
                </Link>
                <SubMenuItem
                  label="Transactions"
                  active={activeTab === "Transactions"}
                  onClick={() => setActiveTab("Transactions")}
                />
                <SubMenuItem
                  label="Withdraw Request"
                  active={activeTab === "withdraw-request"}
                  onClick={() => setActiveTab("withdraw-request")}
                />
              </div>
            )}
          </div>
          {/* bet history */}
          <div>
            <button
              onClick={() => toggleReport("report")}
              className={`flex w-full items-center justify-between rounded-lg px-4 py-2 text-sm font-medium transition ${report.report
                  ? "bg-blue-600 text-[var( --color-text)]"
                  : "text-[var( --color-text)] hover:bg-gray-100 dark:hover:bg-black"
                }`}
            >
              <span className="flex items-center space-x-3">
                <TbReport />
                <span>Reports & Moderation</span>
              </span>
              <FaChevronDown
                className={`transition-transform ${report.report ? "rotate-180" : ""
                  }`}
              />
            </button>

            {report.report && (
              <div className="ml-8 mt-2 space-y-2">
                <Link href="/dashboard/users">
                  <SubMenuItem
                    label="Player Reports"
                    active={activeTab === "player-report"}
                    onClick={() => setActiveTab("player-report")}
                  />
                </Link>
                <SubMenuItem
                  label="Dispute Resolution"
                  active={activeTab === "dispute"}
                  onClick={() => setActiveTab("dispute")}
                />
              </div>
            )}
          </div>
          {/* <SidebarItem
            icon={<FaHistory />}
            label="Transactions"
            active={activeTab === "transactions"}
            onClick={() => setActiveTab("transactions")}
          /> */}
        </nav>

        {/* Bottom buttons */}
        <div className="mt-auto space-y-2">
          <button className="flex w-full items-center space-x-2 rounded-lg px-4 py-2 bg-blue-600 text-[var( --color-text)]">
            <FaLock />
            <span>Change Password</span>
          </button>
          <button
            onClick={handleLogout}
            className="flex w-full items-center space-x-2 rounded-lg px-4 py-2 bg-red-500 text-[var( --color-text)]"
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
      className={`flex w-full items-center space-x-3 rounded-lg px-4 py-2 text-sm font-medium transition ${active
          ? "bg-blue-600 text-[var( --color-text)]"
          : "text-[var( --color-text)] hover:bg-gray-100 dark:hover:bg-black cursor-pointer"
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
      className={`block w-full text-left rounded-lg px-3 py-2 text-sm transition ${active
          ? "bg-blue-500 text-white"
          : "text-[var( --color-text)] hover:bg-gray-100  hover:text-black"
        }`}
    >
      {label}
    </button>
  );
}
