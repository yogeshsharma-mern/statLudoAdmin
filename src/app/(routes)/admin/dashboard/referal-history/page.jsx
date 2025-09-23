
"use client";
import {  useState } from "react";
import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchReferals } from "@/redux/features/referalSlice";
import Table from "@/components/Table";


 
export default function Page() {

  const [filters, setFilters] = useState({
    status: "",
    betAmountMin: "",
    betAmountMax: "",
  });
  const { transactions, status, error, totalPages: rawTotalPages } = useSelector((state) => state.referal);
  const [reloadKey, setReloadKey] = useState(0);
  const dispatcher = useDispatch();

//   const handleApproveapi = async (id) => {
//     const res = await dispatcher(transactionApproved(id));

//     if (res.meta.requestStatus === "fulfilled") {
//       toast.success("transaction approved successfully");
//       setOpenConfirm(false);
//       setReloadKey(prev => prev + 1); // 🔄 table reload trigger
//       // const res = await dispatcher(
//       //   fetchData({
//       //     page: 1,
//       //     limit: 5,
//       //   })
//       // );
//     } else {
//       toast.error("Failed to transaction approved");
//       setOpenConfirm(false);
//     }
//   }
//   const handleRejectedapi = async (id) => {
//     const res = await dispatcher(transactionRejected(id));
//     if (res.meta.requestStatus === "fulfilled") {
//       toast.success("transaction rejected successfully");
//       setReloadKey(prev => prev + 1); // 🔄 table reload trigger
//     } else {
//       toast.error("Failed to reject  transaction");
//     }
//   }



//   const columns = useMemo(
//     () => [
//       {
//         accessorKey: "userId.username",
//         header: "Username",
//         cell: ({ row }) => row.original.userId?.username ?? "—",
//       },
//       {
//         accessorKey: "userId.phone",
//         header: "Phone",
//         cell: ({ row }) => row.original.userId?.phone ?? "—",
//       },
//       {
//         accessorKey: "utrNumber",
//         header: "UTR Number",
//       },
//       {
//         accessorKey: "amount",
//         header: "Amount",
//         cell: ({ getValue }) => `₹${getValue()}`,
//       },
//       {
//         accessorKey: "status",
//         header: "Status",
//         cell: ({ getValue }) => {
//           const val = getValue();
//           return (
//             <span
//               className={`rounded-full px-2.5 py-1 text-xs font-semibold
//               ${val === "pending"
//                   ? "bg-yellow-100 text-yellow-700"
//                   : val === "approved"
//                     ? "bg-green-100 text-green-700"
//                     : "bg-red-100 text-red-700"
//                 }`}
//             >
//               {val}
//             </span>
//           );
//         },
//       },
//       {
//         accessorKey: "createdAt",
//         header: "Created At",
//         cell: ({ getValue }) =>
//           new Date(getValue()).toLocaleString("en-GB", {
//             day: "2-digit",
//             month: "short",
//             year: "numeric",
//             hour: "2-digit",
//             minute: "2-digit",
//           }),
//       },

//       {
//         accessorKey: "updatedAt",
//         header: "Updated At",
//         cell: ({ getValue }) =>
//           new Date(getValue()).toLocaleString("en-GB", {
//             day: "2-digit",
//             month: "short",
//             year: "numeric",
//             hour: "2-digit",
//             minute: "2-digit",
//           }),
//       },
//      {
//   id: "actions",
//   header: "Actions",
//   cell: ({ row }) => {
//     const payment = row.original;

//     return (
//       <div className="flex items-center gap-3">
      
//         {/* ✅ View Button - Always Visible */}
//         <button
//           className="rounded-md cursor-pointer bg-blue-500 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-600"
//           onClick={() => handleView(payment)}  // 👈 define this function
//         >
//           View
//         </button>

//         {/* ✅ Status-based buttons */}
//         {payment.status === "approved" ? (
//           <button
//             disabled
//             className="rounded-md bg-blue-100 px-2.5 py-1.5 text-xs font-semibold text-blue-700 cursor-default"
//           >
//             Not Available
//           </button>
//         ) : payment.status === "rejected" ? (
//           <button
//             disabled
//             className="rounded-md bg-red-100 px-2.5 py-1.5 text-xs font-semibold text-red-700 cursor-default"
//           >
//             Rejected
//           </button>
//         ) : (
//           <>
//             <button
//               className="rounded-md cursor-pointer bg-green-500 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-green-600"
//               onClick={() => (setOpenConfirm(true), setApproveId(payment._id))}
//             >
//               Approve
//             </button>
//             <button
//               className="rounded-md cursor-pointer bg-red-500 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-red-600"
//               onClick={() => handleRejectedapi(payment._id)}
//             >
//               Reject
//             </button>
//           </>
//         )}
//       </div>
//     );
//   },
// }



//     ],
//     []
//   );
const columns = useMemo(
  () => [
    {
      accessorKey: "winner.username",
      header: "Winner",
      cell: ({ row }) => row.original.winner?.username ?? "—",
    },
    {
      accessorKey: "referred_by.username",
      header: "Referred By",
      cell: ({ row }) => row.original.referred_by?.username ?? "—",
    },
    {
      accessorKey: "roomId",
      header: "Room ID",
    },
    {
      accessorKey: "winningAmount",
      header: "Winning Amount",
      cell: ({ getValue }) => `₹${getValue()}`,
    },
    {
      accessorKey: "referralEarning",
      header: "Referral Earning",
      cell: ({ getValue }) => `₹${getValue()}`,
    },
    {
      accessorKey: "gameId",
      header: "Game ID",
      cell: ({ getValue }) => getValue() ?? "—",
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
  ],
  []
);



  return (
    <div className=" bg-[var(--color-neutral)] ">
  

      <Table
        pending={status}
        fetchData={fetchReferals}
        columnsDef={columns}
        filters={filters}
        title="All Referal History"
        reloadKey={reloadKey}   // 👈 pass here

        filtersUI={
          <>
            {/* <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="rounded-lg border px-2 py-1 text-sm"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>

            </select> */}

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

