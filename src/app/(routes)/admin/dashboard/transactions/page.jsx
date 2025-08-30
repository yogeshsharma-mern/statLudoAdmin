
"use client";
import { useEffect, useState } from "react";
import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTransactions } from "@/redux/features/transactionSlice";
import Table from "@/components/Table";
import socket from "@/library/socket";
import { transactionApproved } from "@/redux/features/transactionSlice";
import { transactionRejected } from "@/redux/features/transactionSlice";
import ConfirmBox from "@/components/ConfirmBox";
import toast from "react-hot-toast";
import { MdBlock } from "react-icons/md";
import { IoMdEye } from "react-icons/io";
import { CgUnblock } from "react-icons/cg";
import ToggleButton from "@/components/ToggleButton";
import Image from "next/image";
 
export default function Page() {

  const [filters, setFilters] = useState({
    status: "",
    betAmountMin: "",
    betAmountMax: "",
  });
  // const { status } = useSelector(store => store.transaction);
  const { transactions, status, error, totalPages: rawTotalPages } = useSelector((state) => state.transaction);
  const [reloadKey, setReloadKey] = useState(0);
const [openConfirm,setOpenConfirm] = useState(false);
const [modalOpen,setmodalOpen] = useState(false);
const [approveId,setApproveId] = useState(null);
const [paymentInfo,setpaymentInfo] = useState({});
  const [payments, setPayments] = useState([]);
  const { totalPages } = useSelector((state) => state.transaction);
  const dispatcher = useDispatch();
  const handleApprove = (id) => {
    socket.emit("update_payment_status", { paymentId: id, status: "approved" });
    toast.success("Payment approved");
    dispatcher(fetchTransactions(filters));

    // remove only the approved payment from local state
    setPayments((prev) => prev.filter((p) => p._id !== id));
  };
  const handleView = (payment) => {
  // Example: open modal
  setpaymentInfo(payment);
  setmodalOpen(true);

  // Or navigate: router.push(`/payments/${payment._id}`);
};
  const handleRejected = (id) => {
    socket.emit("update_payment_status", { paymentId: id, status: "rejected" });
    toast.error("Payment rejected");

    // remove only the rejected payment
    setPayments((prev) => prev.filter((p) => p._id !== id));
    dispatcher(fetchTransactions(filters));
  };
  const handleApproveapi = async (id) => {
    const res = await dispatcher(transactionApproved(id));

    if (res.meta.requestStatus === "fulfilled") {
      toast.success("transaction approved successfully");
      setOpenConfirm(false);
      setReloadKey(prev => prev + 1); // 🔄 table reload trigger
      const res = await dispatcher(
        fetchData({
          page: 1,
          limit: 5,
        })
      );
    } else {
      toast.error("Failed to transaction approved");
      setOpenConfirm(false);
    }
  }
  const handleRejectedapi = async (id) => {
    const res = await dispatcher(transactionRejected(id));
    if (res.meta.requestStatus === "fulfilled") {
      toast.success("transaction rejected successfully");
      setReloadKey(prev => prev + 1); // 🔄 table reload trigger
    } else {
      toast.error("Failed to reject  transaction");
    }
  }
  useEffect(() => {
    console.log("🔄 Connecting socket...");
    socket.connect();

    socket.on("connect", () => console.log("✅ Connected:", socket.id));
    socket.on("disconnect", () => console.log("❌ Disconnected"));

    socket.on("pending_payments_list", (data) => {
      console.log("📩 Pending payments:", data);
      setPayments(data);
    });

    socket.on("new_payment", (data) => {
      console.log("📩 New payment:", data);
      setPayments((prev) => [data, ...prev]);
    });

    return () => {
      console.log("🧹 Cleaning up + disconnecting...");
      socket.off("connect");
      socket.off("disconnect");
      socket.off("pending_payments_list");
      socket.off("new_payment");
      socket.disconnect(); // 👈 IMPORTANT
    };
  }, []);




  //   useEffect(() => {
  //     // connect hone pe
  //     socket.on("connect", () => {
  //       console.log("✅ Socket connected:", socket.id);
  //     });
  // console.log("ghello")
  //     // server se message receive
  //     socket.on("new_payment", (data) => {
  //       console.log("📩 New message:", data);
  //       // setMessages((prev) => [...prev, data]);
  //     });





  //     //   socket.emit("pending_payments_list", (data) => {
  //     //   console.log("📩 New message:", data);
  //     //   // setMessages((prev) => [...prev, data]);
  //     // });

  //     // cleanup
  //     return () => {
  //       socket.off("connect");
  //       socket.off("pending_payments_list");
  //     };
  //   }, []);
  // useEffect(() => {
  //   socket.on("connect", () => {
  //     console.log("✅ Socket connected:", socket.id);

  //     // Request initial list from server
  //     socket.emit("pending_payments_list");
  //   });

  //   // listen for the list from server
  //   socket.on("pending_payments_list", (data) => {
  //     console.log("📩 Pending payments:", data);
  //     // here update redux or local state
  //     // e.g. dispatcher(setTransactions(data))
  //   });

  //   // listen for new payments
  //   socket.on("new_payment", (data) => {
  //     console.log("📩 New payment received:", data);
  //     // append new payment in your redux/table
  //     // e.g. dispatcher(addTransaction(data))
  //   });

  //   return () => {
  //     socket.off("connect");
  //     socket.off("pending_payments_list");
  //     socket.off("new_payment");
  //   };
  // }, [dispatcher]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "userId.username",
        header: "Username",
        cell: ({ row }) => row.original.userId?.username ?? "—",
      },
      {
        accessorKey: "userId.phone",
        header: "Phone",
        cell: ({ row }) => row.original.userId?.phone ?? "—",
      },
      {
        accessorKey: "utrNumber",
        header: "UTR Number",
      },
      {
        accessorKey: "amount",
        header: "Amount",
        cell: ({ getValue }) => `₹${getValue()}`,
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ getValue }) => {
          const val = getValue();
          return (
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-semibold
              ${val === "pending"
                  ? "bg-yellow-100 text-yellow-700"
                  : val === "approved"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
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
    const payment = row.original;

    return (
      <div className="flex items-center gap-3">
      
        {/* ✅ View Button - Always Visible */}
        <button
          className="rounded-md cursor-pointer bg-blue-500 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-600"
          onClick={() => handleView(payment)}  // 👈 define this function
        >
          View
        </button>

        {/* ✅ Status-based buttons */}
        {payment.status === "approved" ? (
          <button
            disabled
            className="rounded-md bg-blue-100 px-2.5 py-1.5 text-xs font-semibold text-blue-700 cursor-default"
          >
            Not Available
          </button>
        ) : payment.status === "rejected" ? (
          <button
            disabled
            className="rounded-md bg-red-100 px-2.5 py-1.5 text-xs font-semibold text-red-700 cursor-default"
          >
            Rejected
          </button>
        ) : (
          <>
            <button
              className="rounded-md cursor-pointer bg-green-500 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-green-600"
              onClick={() => (setOpenConfirm(true), setApproveId(payment._id))}
            >
              Approve
            </button>
            <button
              className="rounded-md cursor-pointer bg-red-500 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-red-600"
              onClick={() => handleRejectedapi(payment._id)}
            >
              Reject
            </button>
          </>
        )}
      </div>
    );
  },
}



    ],
    []
  );


  return (
    <div className=" bg-[var(--color-neutral)] ">
        {modalOpen && (
        <div className="fixed inset-0 bg-black/20 bg-opacity-60 flex items-center justify-center z-50">
          <div className="relative bg-white rounded-2xl shadow-lg p-4 max-w-lg w-full">
            {/* Close button */}
            <button
              onClick={() => setmodalOpen(false)}
              className="absolute top-3 right-3 text-gray-700 hover:text-black text-2xl"
            >
              &times;
            </button>

            {/* Image */}
            <Image
            height={200}
            width={200}
              src={ process.env.NEXT_PUBLIC_API_BASE_URL_Image+  paymentInfo.screenshot}
              alt="screenshot"
              className="rounded-lg max-h-[70vh] object-contain mx-auto"
            />
          </div>
        </div>
      )}
      <ConfirmBox
              isOpen={openConfirm}
              onClose={() => setOpenConfirm(false)}
              onConfirm={()=>handleApproveapi(approveId)}
              title="Are you sure you want to approve this transaction?"
              message="This action cannot be undone. Do you really want to approve this transaction?"
            />
      <div className="overflow-x-auto pt-10 p-8 rounded-lg shadow">
        <div className="mb-2 font-bold text-xl">Recent Transactions</div>

        <table className="min-w-full text-sm text-left text-gray-600">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
            <tr>
              <th className="px-4 py-2">User ID</th>
              <th className="px-4 py-2">UTR Number</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Screenshot</th>
              <th className="px-4 py-2">Approved</th>
              <th className="px-4 py-2">Rejected</th>
            </tr>
          </thead>
          <tbody>
            {payments.length > 0 ? (
              payments.map((p) => (
                <tr key={p._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{p.userId}</td>
                  <td className="px-4 py-2">{p.utrNumber}</td>
                  <td className="px-4 py-2 font-medium">₹{p.amount}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold
                      ${p.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : p.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <a
                      href={process.env.NEXT_PUBLIC_API_BASE_URL_Image+p.screenshot}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </a>
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleApprove(p._id)}
                      className="rounded bg-green-500 cursor-pointer px-3 py-1 text-xs text-white hover:bg-green-600"
                    >
                      Approve
                    </button>
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleRejected(p._id)}
                      className="rounded bg-red-500 cursor-pointer px-3 py-1 text-xs text-white hover:bg-red-600"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="px-4 py-4 text-center text-gray-500"
                >
                  No payments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Table
        pending={status}
        fetchData={fetchTransactions}
        columnsDef={columns}
        filters={filters}
        title="All Transactions"
        reloadKey={reloadKey}   // 👈 pass here

        filtersUI={
          <>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="rounded-lg border px-2 py-1 text-sm"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>

            </select>

            <input
              type="number"
              placeholder="Min Amount"
              value={filters.betAmountMin}
              onChange={(e) =>
                setFilters({ ...filters, betAmountMin: e.target.value })
              }
              className="w-24 rounded-lg border px-2 py-1 text-sm"
            />
            <input
              type="number"
              placeholder="Max Amount"
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
