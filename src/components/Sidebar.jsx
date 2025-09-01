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
import { TbLockPassword } from "react-icons/tb";
import { RiAdminFill } from "react-icons/ri";
import { disconnectSocket } from "@/library/socket";




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
const handleCloseSidebar = () => {
  if (typeof window !== "undefined" && window.innerWidth < 1024) {
    setIsMobileOpen(false); // Sirf mobile pe close hoga
  }
};
  const router = useRouter();

//  useEffect(() => {
//   const handleClickOutside = (event) => {
//     if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
//       // Close all menus
//       setOpenMenus({ users: false });
//       setOpenGameManagement({ management: false });
//       setwallet({ wallet: false });
//       setReport({ report: false });

//       if (window.innerWidth < 1024) {   // 👈 only close sidebar on mobile
//         setIsMobileOpen(false);
//       }
//     }
//   };

//   document.addEventListener("mousedown", handleClickOutside);

//   return () => {
//     document.removeEventListener("mousedown", handleClickOutside);
//   };
// }, []);


  const handleLogout = () => {
    Cookies.remove("adminToken");
    Cookies.remove("adminId");
    disconnectSocket();

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
        className="lg:hidden absolute top-4  right-20 flex items-center justiy-center cursor-pointer z-50 w-[22px] h-[22px] rounded-full text-[var(--color-text)] text-[20px] p-3 rounded-md"
      >
        {isMobileOpen ? "" : "☰"}
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
               closeSidebar={() => setIsMobileOpen(false)} 
            />
          </Link>

          {/* Users with submenu */}
          <div>
            <button
              onClick={() => toggleMenu("users")}
              className={`flex w-full items-center justify-between rounded-lg px-4 py-2 text-sm font-medium transition ${openMenus.users
                  ? "bg-[var(--sidebar-bg)] text-[var( --color-text)]"
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
                   closeSidebar={handleCloseSidebar} 

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
                  ? "bg-[var(--sidebar-bg)] text-[var( --color-text)]"
                  : "text-[var( --color-text)] hover:bg-bg-[var(--sidebar-bgs)] dark:hover:bg-black"
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
                <Link href="/admin/dashboard/active-completed-games">
                  <SubMenuItem
                    label="Active/Completed Games"
                    active={activeTab === "Active/completed Games"}
                    onClick={() => setActiveTab("Active/completed Games")}
                   closeSidebar={handleCloseSidebar} 

                  />
                </Link>
              <Link href="/admin/dashboard/game-logs">
                <SubMenuItem
                  label="Game Logs"
                  active={activeTab === "Game-Logs"}
                  onClick={() => setActiveTab("Game-Logs")}
                   closeSidebar={handleCloseSidebar} 
                />
              </Link>
              </div>
            )}
          </div>

          <div>
            <button
              onClick={() => togglewallet("wallet")}
              className={`flex w-full items-center justify-between rounded-lg px-4 py-2 text-sm font-medium transition ${wallet.wallet
                  ? "bg-[var(--sidebar-bg)] text-[var( --color-text)]"
                  : "text-[var( --color-text)] hover:bg-[var(--sidebar-bg)] dark:hover:bg-black"
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
                {/* <Link href="/admin/dashboard/coin-balance">
                  <SubMenuItem
                    label="Coin Balance"
                    active={activeTab === "coin-balance"}
                    onClick={() => setActiveTab("coin-balance")}
                   closeSidebar={() => setIsMobileOpen(false)} 

                  />
                </Link> */}
               <Link href="/admin/dashboard/transactions">
                <SubMenuItem
                  label="Transactions"
                  active={activeTab === "Transactions"}
                  onClick={() => setActiveTab("Transactions")}
                   closeSidebar={handleCloseSidebar} 

                /></Link>
              <Link href="/admin/dashboard/withdraw-request">
                <SubMenuItem
                  label="Withdraw Request"
                  active={activeTab === "withdraw-request"}
                  onClick={() => setActiveTab("withdraw-request")}
                   closeSidebar={handleCloseSidebar} 

                />
              </Link>
              </div>
            )}
          </div>
          {/* bet history */}
          <div>
            {/* <button
              onClick={() => toggleReport("report")}
              className={`flex w-full items-center justify-between rounded-lg px-4 py-2 text-sm font-medium transition ${report.report
                  ? "bg-gray-200 text-[var( --color-text)]"
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
            </button> */}

            {/* {report.report && (
              <div className="ml-8 mt-2 space-y-2">
                <Link href="/admin/dashboard/player-report">
                  <SubMenuItem
                    label="Player Reports"
                    active={activeTab === "player-report"}
                    onClick={() => setActiveTab("player-report")}
                   closeSidebar={() => setIsMobileOpen(false)} 

                  />
                </Link>
               <Link href="/admin/dashboard/dispute-report">
                <SubMenuItem
                  label="Dispute Resolution"
                  active={activeTab === "dispute"}
                  onClick={() => setActiveTab("dispute")}
                   closeSidebar={() => setIsMobileOpen(false)} 

                />
               </Link>
               
              </div>
              
            )} */}
             <Link href="/admin/dashboard/scanner">
            <SidebarItem
              icon={<FaTachometerAlt />}
              label="Upload Scanner"
              active={activeTab === "scanner"}
              onClick={() => setActiveTab("scanner")}
                   closeSidebar={handleCloseSidebar} 

            />
          </Link>
                 <Link href="/admin/dashboard/update-password">
            {/* <SidebarItem
              icon={<TbLockPassword />}
              label="Update Password"
              active={activeTab === "updatepassword"}
              onClick={() => setActiveTab("updatepassword")}
                   closeSidebar={() => setIsMobileOpen(false)} 

            /> */}
          </Link>
          </div>
          
            
              
        </nav>

        {/* Bottom buttons */}
        <div className="mt-auto space-y-2">
         {/* <Link href="/admin/dashboard/update-password">
          <button className="flex cursor-pointer w-full items-center space-x-2 rounded-lg px-4 py-2 bg-blue-500 text-[var( --color-text)]">
            <FaLock />
            <span>Change Password</span>
          </button>
         </Link> */}
          <button
            onClick={handleLogout}
            className="flex w-full mt-2 cursor-pointer items-center space-x-2 rounded-lg px-4 py-2 bg-red-500 text-[var( --color-text)]"
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}

function SidebarItem({ icon, label, active, onClick, closeSidebar }) {
  return (
    <button
      onClick={() => {
        onClick?.();
        closeSidebar?.(); // 👈 sidebar close hoga
      }}
      className={`flex w-full items-center space-x-3 rounded-lg px-4 py-2 text-sm font-medium transition ${
        active
          ? "bg-[var(--sidebar-bg)] text-[var( --color-text)]"
          : "text-[var( --color-text)] hover:bg-gray-100 dark:hover:bg-black cursor-pointer"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function SubMenuItem({ label, active, onClick, closeSidebar }) {
  return (
    <button
      onClick={() => {
        onClick?.();
        closeSidebar?.(); // 👈 sidebar close hoga
      }}
      className={`block w-full text-left rounded-lg px-3 py-2 text-sm transition ${
        active
          ? "bg-[var(--sidebar-submenu)]"
          : "text-[var( --color-text)] hover:bg-[var(--sidebar-bgss)] hover:text-black"
      }`}
    >
      {label}
    </button>
  );
}



