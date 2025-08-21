"use client";

import { useState } from "react";


export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="flex min-h-screen bg-(--color-neutral) text-gray-200">
      {/* Sidebar */}

      {/* Main content */}
      <main className="flex-1 p-8">
        <h1 className="text-3xl  text-(--color-neutral-dark) font-bold mb-6">
          {activeTab === "dashboard" && "Welcome to Admin Panel!"}
          {activeTab === "users" && "Manage Users"}
          {activeTab === "tree" && "User Tree"}
          {activeTab === "transfers" && "Transfers"}
          {activeTab === "bets" && "Bet History"}
          {activeTab === "transactions" && "Transactions"}
        </h1>

        {/* Example dashboard cards */}
        {activeTab === "dashboard" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="col-span-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-400 p-6 shadow-lg">
              <h2 className="text-lg font-semibold">My Balance</h2>
              <p className="text-3xl font-bold mt-2">10,034,500.00 USD</p>
              <div className="mt-4 space-y-1 text-sm">
                <p>Income Today: 10,034.00 USD</p>
                <p>Total Withdrawable: 140,500.00 USD</p>
              </div>
            </div>

            <div className="rounded-xl bg-gray-800 p-6 shadow-lg">
              <h2 className="text-lg font-semibold mb-4">Users</h2>
              <ul className="space-y-1 text-sm">
                <li>Total Players: <span className="font-bold">234</span></li>
                <li>Total Cashiers: <span className="font-bold">10</span></li>
                <li>Total Admins: <span className="font-bold">5</span></li>
                <li>Registered Today: <span className="font-bold">+2</span></li>
              </ul>
              <button className="mt-4 w-full rounded-lg bg-indigo-600 py-2 text-sm font-semibold hover:bg-indigo-500">
                + Create new user
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
