// "use client";
// import React, { useEffect, useState,useMemo } from "react";
// import { FiEdit2, FiTrash2, FiPlus, FiSearch, FiChevronLeft, FiChevronRight} from "react-icons/fi";
// import UserFormModal from "@/components/UserFormModel";
// // import UsersTable from "@/components/UsersTable";
// import Cookies from "js-cookie";
// // import { getUsersData } from "@/library/apicall";
// import { CgUnblock } from "react-icons/cg";
// import { FaEye } from "react-icons/fa6";
// import { MdBlock } from "react-icons/md";
// import { useSelector } from "react-redux";
// import { fetchUsers } from "@/redux/features/userSlice";
// import { useDispatch } from "react-redux";
// import Table from "@/components/Table";
// import { fetchGameLogs } from "@/redux/features/gameLogSlice";
// import Modal from "@/components/Modal";

// export default function Page() {
//     //   const {  totalPages } = useSelector((state) => state.user);
//       const handleView = async (_id) => {
//         setViewModal(true);
//         const res = await dispatch(userDetails(_id));
//         console.log("userdetails", res.payload.data);
//         setUserDetails(res.payload.data);
    
//       }
//   const dispatcher = useDispatch();
//   const [open, setOpen] = useState(false);
//   const [userDetail, setUserDetails] = useState({});
//   const [viewModal, setViewModal] = useState(false);

//   const [users, setUsers] = useState([]);
//   console.log("users",users)
//   const token = Cookies.get("adminToken");
//   const columns = useMemo(
//     () => [
//       { accessorKey: "username", header: "Username" },
//       { accessorKey: "phone", header: "Phone" },
//       { accessorKey: "referCode", header: "Refer Code" },
//       {
//         accessorKey: "kycStatus",
//         header: "KYC Status",
//         cell: ({ getValue }) => {
//           const val = getValue();
//           return (
//             <span
//               className={`rounded-full px-2.5 py-1 text-xs font-semibold ${val === "Approved"
//                 ? "bg-green-100 text-green-700"
//                 : val === "Pending"
//                   ? "bg-yellow-100 text-yellow-700"
//                   : "bg-red-100 text-red-700"
//                 }`}
//             >
//               {val}
//             </span>
//           );
//         },
//       },
//       {
//         accessorKey: "isBanned",
//         header: "Blocked",
//         cell: ({ getValue }) =>
//           getValue() ? (
//             <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700">
//               Yes
//             </span>
//           ) : (
//             <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
//               No
//             </span>
//           ),
//       },
//       { accessorKey: "battlePlayed", header: "Battles" },
//       { accessorKey: "cashWon", header: "Cash Won" },
//       {
//         id: "actions",
//         header: "Actions",
//         cell: ({ row }) => (
//           <div className="flex items-center gap-3">
//             <button
//               className="rounded-md bg-indigo-600 cursor-pointer px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700"
//               onClick={() => openEdit(row.original._id)}
//               title="Edit"
//             >
//               <FiEdit2 />
//             </button>
//             <button
//               className="rounded-md cursor-pointer bg-green-500 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-green-600"
//               onClick={() => handleView(row.original._id)}
//               title="viewuser"
//             >
//               <FaEye />
//             </button>
//             {row.original.isBanned ? (
//               <button
//                 className="rounded-md bg-green-600 cursor-pointer px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-green-700"
//                 onClick={() => handleUnblock(row.original._id)}
//                 title="Unblock"
//               >
//                 <CgUnblock />
//               </button>
//             ) : (
//               <button
//                 className="rounded-md bg-rose-600 cursor-pointer px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-rose-700"
//                 onClick={() => handleBlock(row.original._id)}
//                 title="Block"
//               >
//                 <MdBlock />
//               </button>
//             )}

//           </div>
//         ),
//       },
//     ],
//     []
//   );
// 2




//   return (
//     <div className="flex min-h-screen bg-(--color-neutral) text-white">

//       {open && <UserFormModal open={true} onClose={() => setOpen(false)} />}
//       <Table  fetchData={fetchUsers} columnsDef={columns} />
//           <Modal
//                 open={viewModal}
//                 onClose={() => setViewModal(false)}
//                 title="User Details"
//               >
//                 <div className="space-y-3 text-gray-700">
//                   <div>
//                     <strong>Full Name:</strong> {userDetail.fullName}
//                   </div>
//                   <div>
//                     <strong>Username:</strong> {userDetail.username}
//                   </div>
//                   <div>
//                     <strong>Email:</strong> {userDetail.email}
//                   </div>
//                   <div>
//                     <strong>Phone:</strong> {userDetail.phone}
//                   </div>
//                   <div>
//                     <strong>Date of Birth:</strong> {new Date(userDetail.dob).toLocaleDateString()}
//                   </div>
//                   <div>
//                     <strong>Gender:</strong> {userDetail.gender}
//                   </div>
//                   <div>
//                     <strong>Address:</strong> {userDetail.address}
//                   </div>
//                   <div>
//                     <strong>Aadhaar Number:</strong> {userDetail.aadhaarNumber}
//                   </div>
//                   <div>
//                     <strong>Referral Code:</strong> {userDetail.referCode}
//                   </div>
//                   <div>
//                     <strong>Referral Rank:</strong> {userDetail.referRank}
//                   </div>
//                   <div>
//                     <strong>Referral Earning:</strong> ₹{userDetail.referralEarning}
//                   </div>
//                   <div>
//                     <strong>Completed Games:</strong> {userDetail.completedGames}
//                   </div>
//                   <div>
//                     <strong>Battle Played:</strong> {userDetail.battlePlayed}
//                   </div>
//                   <div>
//                     <strong>Cash Won:</strong> ₹{userDetail.cashWon}
//                   </div>
//                   <div>
//                     <strong>Winning Amount:</strong> ₹{userDetail.winningAmount}
//                   </div>
//                   <div>
//                     <strong>KYC Status:</strong> {userDetail.kycStatus}
//                   </div>
//                   <div>
//                     <strong>Is Active:</strong> {userDetail.isActive ? "Yes" : "No"}
//                   </div>
//                   <div>
//                     <strong>Is Banned:</strong> {userDetail.isBanned ? "Yes" : "No"}
//                   </div>
//                   <div>
//                     <strong>Created At:</strong> {new Date(userDetail.createdAt).toLocaleString()}
//                   </div>
//                   <div>
//                     <strong>Updated At:</strong> {new Date(userDetail.updatedAt).toLocaleString()}
//                   </div>
//                 </div>
        
//                 <div className="mt-4 flex justify-end gap-2">
//                   <button
//                     onClick={() => setViewModal(false)}
//                     className="rounded-lg border px-4 py-2 hover:bg-gray-100 transition"
//                   >
//                     Close
//                   </button>
//                 </div>
//               </Modal>
        
//     </div>
//   );
// }

"use client";
import { useState } from "react";
import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { fetchGameLogs } from "@/redux/features/gameLogSlice";
import Table from "@/components/Table";

export default function Page() {
  const [filters, setFilters] = useState({
    status: "",
    betAmountMin: "",
    betAmountMax: "",
  });
  const {  status } = useSelector((state) => state.gameLog);


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
  accessorKey: "createdBy",
  header: "Created By",
  cell: ({ getValue }) => {
    const val = getValue();
 console.log("valye",val);
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
    <div className=" bg-[--color-neutral]   h-[90vh] overflow-auto">
      <Table 
      title="Game Logs"
      pending={status}
      fetchData={fetchGameLogs} 
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
            <option value="requested">requested</option>
            <option value="started">started</option>
            <option value="cancelled">cancelled</option>
            <option value="expired">expired</option>
            <option value="quit">quit</option>


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

