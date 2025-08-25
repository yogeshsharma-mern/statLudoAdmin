
"use client";
import { useState } from "react";
import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { fetchCoins } from "@/redux/features/coinBalanceSlice";
import Table from "@/components/Table";

export default function Page() {
  const [filters, setFilters] = useState({
    status: "",
    betAmountMin: "",
    betAmountMax: "",
  });
  const { totalPages } = useSelector((state) => state.gameLog);

  const columns = useMemo(
    () => [
      {
  accessorKey: "acceptedBy",
  header: "Accepted By",
  cell: ({ getValue }) => {
    const val = getValue();
    return val?.username ?? "—";  // sirf username render karega
  },
},

      {
        accessorKey: "status",
        header: "Status",
        cell: ({ getValue }) => {
          const val = getValue();
          return (
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-semibold
                ${val === "expired"
                  ? "bg-red-100 text-red-700"
                  : val === "active"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
                }`}
            >
              {val}
            </span>
          );
        },
      },
      {
        accessorKey: "betAmount",
        header: "Bet Amount",
        cell: ({ getValue }) => `₹${getValue()}`,
      },
      {
        accessorKey: "winningAmount",
        header: "Winning Amount",
        cell: ({ getValue }) => `₹${getValue()}`,
      },
      {
        accessorKey: "createdAt",
        header: "Created At",
        cell: ({ getValue }) =>
          new Date(getValue()).toLocaleString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
      },
      {
        accessorKey: "updatedAt",
        header: "Updated At",
        cell: ({ getValue }) =>
          new Date(getValue()).toLocaleString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
      },
    ],
    []
  );

  return (
    <div className=" bg-[--color-neutral] ">
      <Table 
      fetchData={fetchCoins} 
      columnsDef={columns} 
      filters={filters}
      filtersUI={
        <>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="rounded-lg border px-2 py-1 text-sm"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>

          <input
            type="number"
            placeholder="Min Bet"
            value={filters.betAmountMin}
            onChange={(e) =>
              setFilters({ ...filters, betAmountMin: e.target.value })
            }
            className="w-24 rounded-lg border px-2 py-1 text-sm"
          />
          <input
            type="number"
            placeholder="Max Bet"
            value={filters.betAmountMax}
            onChange={(e) =>
              setFilters({ ...filters, betAmountMax: e.target.value })
            }
            className="w-24 rounded-lg border px-2 py-1 text-sm"
          />
        </>
      }
    />
  
       
    </div>
  );
}
