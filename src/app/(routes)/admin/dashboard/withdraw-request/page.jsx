
"use client";
import { useState } from "react";
import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWithdrawDet } from "@/redux/features/withdrawSlice";
import Table from "@/components/Table";
import socket from "@/library/socket";
import { useEffect } from "react";
import toast from "react-hot-toast";
import {withdrawApprove} from "@/redux/features/withdrawSlice";
import {withdrawReject} from "@/redux/features/withdrawSlice";



export default function Page() {
  const dispatcher = useDispatch();
  const [filters, setFilters] = useState({
    status: "",
    betAmountMin: "",
    betAmountMax: "",
  });
  const [withdrawData,setWithdrawData] = useState([]);
  const [withdrawDetails,setWithdrawDetails] =useState({});
  console.log("withdrawDetails",withdrawDetails);
  const {status:withdrawStatus} = useSelector(state=>state.userwithdrawdetails);
  console.log("withdrawstatus",withdrawStatus);
    const [reloadKey, setReloadKey] = useState(0);
  const { totalPages } = useSelector((state) => state.gameLog);
  //   const handleApprove = (id) => {
  //   socket.emit("update_withdraw_status", { withdrawId: id, status: "paid" });
  //   toast.success("Payment approved");
  //   setWithdrawData((prev) => prev.filter((p) => p._id !== id));
  //   dispatcher(fetchTransactions(filters));

  //   // remove only the approved payment from local state
  //   setWithdrawData((prev) => prev.filter((p) => p._id !== id));
  // };
  //   const handlereject = (id) => {
  //   socket.emit("update_withdraw_status", { withdrawId: id, status: "reject" });
  //   toast.success("Payment approved");
  //   dispatcher(fetchTransactions(filters));

  //   // remove only the approved payment from local state
  //   setWithdrawData((prev) => prev.filter((p) => p._id !== id));
  // };
  const handleApprove = (id) => {
  socket.emit("update_withdraw_status", { withdrawId: id, status: "paid" });
  toast.success("Payment approved");

  // remove only the approved payment from local state
  setWithdrawData((prev) => prev.filter((p) => p._id !== id));

  // refresh backend data if needed
  // dispatcher(fetchTransactions(filters));
};

const handleReject = (id) => {
  socket.emit("update_withdraw_status", { withdrawId: id, status: "reject" });
  toast.success("Payment rejected");

  // remove only the rejected payment from local state
  setWithdrawData((prev) => prev.filter((p) => p._id !== id));

  // refresh backend data if needed
  dispatcher(fetchTransactions(filters));
};

const handleApproveapi = async (id) => {
  const res = await dispatcher(withdrawApprove(id));

  if (res.type.endsWith("fulfilled")) {
    toast.success("Transaction paid successfully");
    setReloadKey(prev => prev + 1);
  } else {
    toast.error(res.payload || "Failed to pay transaction");
    // setOpenConfirm(false);
  }
};

const handleRejectapi = async (id) => {
  const res = await dispatcher(withdrawReject(id));

  if (res.type.endsWith("fulfilled")) {
    toast.success("Transaction rejected successfully")
    setReloadKey(prev => prev + 1);

    // 🔄 reload data
    await dispatcher(fetchWithdrawDet({ page: 1, limit: 5 }));
  } else {
    toast.error(res.payload || "Failed to reject the payment");
    // setOpenConfirm(false);
  }
};

const columns = useMemo(
  () => [
    {
      accessorKey: "userId",
      header: "Username",
      cell: ({ getValue }) => {
        const val = getValue();
        return val?.username ?? "—";
      },
    },
    {
      accessorKey: "userId.phone",
      header: "Phone",
      cell: ({ row }) => row.original.userId?.phone ?? "—",
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ getValue }) => `₹${getValue()}`,
    },
    {
      accessorKey: "upiId",
      header: "UPIId",
      cell: ({ getValue }) => `${getValue()}`,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => {
        const val = getValue();
        return (
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-semibold
              ${val === "unpaid"
                ? "bg-red-100 text-red-700"
                : val === "paid"
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
  {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const record = row.original;

        // ✅ Show Pay/Reject only if status === "unpaid"
        return(
        <div>
       
          {record.status === "unpaid" &&
          <div>
              <button
                onClick={() => handleApproveapi(record._id)}
                className="rounded-md bg-green-500 px-3 py-1 text-xs font-medium text-white shadow hover:bg-green-600"
              >
                Pay
              </button>
              <button
                onClick={() => handleRejectapi(record._id)}
                className="rounded-md bg-red-500 px-3 py-1 text-xs font-medium text-white shadow hover:bg-red-600"
              >
                Reject
              </button>
            </div>}
        </div>
        )
        if (record.status === "unpaid") {
          return (
            <div className="flex gap-2">
              <button
                onClick={() => handleApproveapi(record._id)}
                className="rounded-md bg-green-500 px-3 py-1 text-xs font-medium text-white shadow hover:bg-green-600"
              >
                Pay
              </button>
              <button
                onClick={() => handleRejectapi(record._id)}
                className="rounded-md bg-red-500 px-3 py-1 text-xs font-medium text-white shadow hover:bg-red-600"
              >
                Reject
              </button>
            </div>
          );
        }

        return (
          <span className="text-gray-400 italic text-sm">—</span>
        );
      },
    },
  ],
  []
);
  useEffect(() => {
    console.log("🔄 Connecting socket...");
    socket.connect();

    socket.on("connect", () => console.log("✅ Connected:", socket.id));
    socket.on("disconnect", () => console.log("❌ Disconnected"));

    // socket.on("pending_payments_list", (data) => {
    //   console.log("📩 Pending payments:", data);
    //   setPayments(data);
    // });

    socket.on("new_withdraw", (data) => {
      console.log("📩 New withdraw request:", data);
      setWithdrawData((prev) => [data, ...prev]);
    });

    return () => {
      console.log("🧹 Cleaning up + disconnecting...");
      socket.off("connect");
      socket.off("disconnect");
      socket.off("pending_payments_list");
      socket.off("new_withdraw");
      socket.disconnect(); // 👈 IMPORTANT
    };
  }, []);

  return (
    <div className=" bg-[var(--color-neutral)] h-[90vh] overflow-auto">
      <div className="overflow-x-auto p-4 mt-10">
        <div className="font-bold text-xl mb-3">Recent Withdraw Requests</div>
  <table className="min-w-full rounded-lg ">
    <thead className="bg-gray-100">
      <tr>
        <th className="px-4 py-1 text-left">ID</th>
        <th className="px-4 py-1 text-left">User ID</th>
        <th className="px-4 py-1 text-left">UPI ID</th>
        <th className="px-4 py-1 text-left">Amount</th>
        <th className="px-4 py-1 text-left">Status</th>
        <th className="px-4 py-1 text-left">Created At</th>
        <th className="px-4 py-1 text-left">Updated At</th>
        <th className="px-4 py-1 text-left">Actions</th>
      </tr>
    </thead>
  <tbody>
  {withdrawData.map((item) => (
    <tr
      key={item._id}
      className="border-b transition hover:bg-gray-50"
    >
      <td className="px-4 py-3 text-sm text-gray-700">{item._id}</td>
      <td className="px-4 py-3 text-sm text-gray-700">{item.userId}</td>
      <td className="px-4 py-3 text-sm text-gray-700">{item.upiId}</td>
      <td className="px-4 py-3 font-medium text-gray-900">₹{item.amount}</td>

      <td className="px-4 py-3">
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold
            ${
              item.status === "unpaid"
                ? "bg-red-100 text-red-700"
                : item.status === "paid"
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
        >
          {item.status}
        </span>
      </td>

      <td className="px-4 py-3 text-sm text-gray-600">
        {new Date(item.createdAt).toLocaleString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </td>

      <td className="px-4 py-3 text-sm text-gray-600">
        {new Date(item.updatedAt).toLocaleString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </td>

      <td className="px-4 py-3">
        {item.status === "unpaid" ? ( // ✅ only show actions if unpaid
          <div className="flex gap-2">
            <button
              onClick={() => handleApprove(item._id)}
              className="rounded-md bg-green-500 px-3 py-1 text-xs font-medium text-white shadow hover:bg-green-600"
            >
              Pay
            </button>
            <button
              onClick={() => handlereject(item._id)}
              className="rounded-md bg-red-500 px-3 py-1 text-xs font-medium text-white shadow hover:bg-red-600"
            >
              Reject
            </button>
          </div>
        ) : (
          <span className="text-gray-400 italic text-sm">—</span> // ✅ No actions for paid/rejected
        )}
      </td>
    </tr>
  ))}
</tbody>

  </table>
</div>

      <Table 
      pending={status}
      title="All Withdraw Requests"
      fetchData={fetchWithdrawDet} 
      columnsDef={columns} 
      filters={filters}
       reloadKey={reloadKey} 
      filtersUI={
        <>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="rounded-lg border px-2 py-1 text-sm"
          >
            <option value="">All Status</option>
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
            <option value="rejected">Rejected</option>

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
//fdsfdsf