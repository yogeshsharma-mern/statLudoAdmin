
// "use client";
// import { useState } from "react";
// import React, { useMemo } from "react";
// import { useSelector } from "react-redux";
// import { useEffect } from "react";
// import { fetchActiveCompltedGames } from "@/redux/features/activeCompletedGamesSlice";
// import Table from "@/components/Table";
// import socket from "@/library/socket";

// export default function Page() {
//   const [filters, setFilters] = useState({
//     status: "",
//     betAmountMin: "",
//     betAmountMax: "",
//   });
//   const [completedGames,setCompletedGames] = useState([]);
//   const { totalPages } = useSelector((state) => state.gameLog);
//   useEffect(() => {
//     console.log("🔄 Connecting socket...");
//     socket.connect();

//     socket.on("connect", () => console.log("✅ Connected:", socket.id));
//     socket.on("disconnect", () => console.log("❌ Disconnected"));

//     // socket.on("pending_payments_list", (data) => {
//     //   console.log("📩 Pending payments:", data);
//     //   setPayments(data);
//     // });

//     socket.on("game_over", (data) => {
//       console.log("📩 completed games:", data);
//       setCompletedGames((prev) => [data, ...prev]);
//     });

//     return () => {
//       console.log("🧹 Cleaning up + disconnecting...");
//       socket.off("connect");
//       socket.off("disconnect");
//       socket.off("pending_payments_list");
//       socket.off("new_payment");
//       socket.disconnect(); // 👈 IMPORTANT
//     };
//   }, []);
//   const columns = useMemo(
//     () => [
//       {
//   accessorKey: "acceptedBy",
//   header: "Accepted By",
//   cell: ({ getValue }) => {
//     const val = getValue();
//     return val?.username ?? "—";  // sirf username render karega
//   },
// },

//       {
//         accessorKey: "status",
//         header: "Status",
//         cell: ({ getValue }) => {
//           const val = getValue();
//           return (
//             <span
//               className={`rounded-full px-2.5 py-1 text-xs font-semibold
//                 ${val === "expired"
//                   ? "bg-red-100 text-red-700"
//                   : val === "active"
//                   ? "bg-green-100 text-green-700"
//                   : "bg-yellow-100 text-yellow-700"
//                 }`}
//             >
//               {val}
//             </span>
//           );
//         },
//       },
//       {
//         accessorKey: "betAmount",
//         header: "Bet Amount",
//         cell: ({ getValue }) => `₹${getValue()}`,
//       },
//       {
//         accessorKey: "winningAmount",
//         header: "Winning Amount",
//         cell: ({ getValue }) => `₹${getValue()}`,
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
//     ],
//     []
//   );

//   return (
//     <div className=" bg-[--color-neutral] ">

//      <div className="p-8">
//        <table className="min-w-full mt-20 text-sm text-left text-gray-600">
//   <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
//     <tr>
//       <th className="px-4 py-2">Room ID</th>
//       <th className="px-4 py-2">Created By</th>
//       <th className="px-4 py-2">Accepted By</th>
//       <th className="px-4 py-2">Bet Amount</th>
//       <th className="px-4 py-2">Winning Amount</th>
//       <th className="px-4 py-2">Status</th>
//       <th className="px-4 py-2">Admin Status</th>
//       <th className="px-4 py-2">Screenshot</th>
//       <th className="px-4 py-2">Approve</th>
//       <th className="px-4 py-2">Reject</th>
//     </tr>
//   </thead>
//   <tbody>
//     {completedGames.length > 0 ? (
//       completedGames.map((p) => (
//         <tr key={p._id} className="border-b hover:bg-gray-50">
//           <td className="px-4 py-2">{p.roomId}</td>
//           <td className="px-4 py-2">{p.createdBy}</td>
//           <td className="px-4 py-2">{p.acceptedBy ?? "—"}</td>
//           <td className="px-4 py-2 font-medium">₹{p.betAmount}</td>
//           <td className="px-4 py-2 font-medium">₹{p.winningAmount}</td>
//           <td className="px-4 py-2">
//             <span
//               className={`px-2 py-1 rounded-full text-xs font-semibold
//                 ${
//                   p.status === "completed"
//                     ? "bg-green-100 text-green-700"
//                     : p.status === "pending"
//                     ? "bg-yellow-100 text-yellow-700"
//                     : "bg-red-100 text-red-700"
//                 }`}
//             >
//               {p.status}
//             </span>
//           </td>
//           <td className="px-4 py-2">
//             <span
//               className={`px-2 py-1 rounded-full text-xs font-semibold
//                 ${
//                   p.adminstatus === "approved"
//                     ? "bg-green-100 text-green-700"
//                     : p.adminstatus === "rejected"
//                     ? "bg-red-100 text-red-700"
//                     : "bg-gray-200 text-gray-600"
//                 }`}
//             >
//               {p.adminstatus}
//             </span>
//           </td>
//           <td className="px-4 py-2">
//             {p.winningScreenshots?.length > 0 ? (
//               <a
//                 href={
//                   process.env.NEXT_PUBLIC_API_BASE_URL_Image +
//                   p.winningScreenshots[0].url
//                 }
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="text-blue-600 hover:underline"
//               >
//                 View
//               </a>
//             ) : (
//               "—"
//             )}
//           </td>
//           <td className="px-4 py-2">
//             <button
//               onClick={() => handleApprove(p._id)}
//               className="rounded bg-green-500 cursor-pointer px-3 py-1 text-xs text-white hover:bg-green-600"
//             >
//               Approve
//             </button>
//           </td>
//           <td className="px-4 py-2">
//             <button
//               onClick={() => handleRejected(p._id)}
//               className="rounded bg-red-500 cursor-pointer px-3 py-1 text-xs text-white hover:bg-red-600"
//             >
//               Reject
//             </button>
//           </td>
//         </tr>
//       ))
//     ) : (
//       <tr>
//         <td
//           colSpan="10"
//           className="px-4 py-4 text-center text-gray-500"
//         >
//           No completed games found
//         </td>
//       </tr>
//     )}
//   </tbody>
// </table>
//      </div>

//       <Table 
//       fetchData={fetchActiveCompltedGames} 
//       columnsDef={columns} 
//       filters={filters}
//       filtersUI={
//         <>
//           <select
//             value={filters.status}
//             onChange={(e) => setFilters({ ...filters, status: e.target.value })}
//             className="rounded-lg border px-2 py-1 text-sm"
//           >
//             <option value="">All Status</option>
//             <option value="pending">Pending</option>
//             <option value="completed">Completed</option>
//           </select>

//           <input
//             type="number"
//             placeholder="Min Bet"
//             value={filters.betAmountMin}
//             onChange={(e) =>
//               setFilters({ ...filters, betAmountMin: e.target.value })
//             }
//             className="w-24 rounded-lg border px-2 py-1 text-sm"
//           />
//           <input
//             type="number"
//             placeholder="Max Bet"
//             value={filters.betAmountMax}
//             onChange={(e) =>
//               setFilters({ ...filters, betAmountMax: e.target.value })
//             }
//             className="w-24 rounded-lg border px-2 py-1 text-sm"
//           />
//         </>
//       }
//     />
  
       
//     </div>
//   );
// }
"use client";
import { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { fetchActiveCompltedGames } from "@/redux/features/activeCompletedGamesSlice";
import Table from "@/components/Table";
import socket from "@/library/socket";

export default function Page() {
  const [filters, setFilters] = useState({ status: "", betAmountMin: "", betAmountMax: "" });
  const [completedGames, setCompletedGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null); // 👈 modal state
  const [selectedGameApi, setSelectedGameApi] = useState(null);
  console.log("selectedgame",selectedGame);
  const [winner, setWinner] = useState("");

  const { totalPages } = useSelector((state) => state.gameLog);

  useEffect(() => {
    socket.connect();
    socket.on("connect", () => console.log("✅ Connected:", socket.id));
    socket.on("disconnect", () => console.log("❌ Disconnected"));

    socket.on("game_over", (data) => {
      console.log("📩 completed games:", data);
      setCompletedGames((prev) => [data, ...prev]);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.disconnect();
    };
  }, []);

  const handleWinnerSubmit = () => {
    if (!winner) return alert("⚠ Please select a winner first!");
    socket.emit("admin_winner_decision", {
      gameId: selectedGame._id,
      winner,
    });
    setSelectedGame(null); // close modal
    setWinner("");

  };

const columns = useMemo(() => [
    {
      accessorKey: "roomId",
      header: "Room ID",
    },
    {
      accessorFn: (row) => row.createdBy?.username ?? "—",
      id: "createdByUsername",
      header: "Created By",
    },
    {
      accessorFn: (row) => row.acceptedBy?.username ?? "—",
      id: "acceptedByUsername",
      header: "Accepted By",
    },
    {
      accessorKey: "betAmount",
      header: "Bet Amount",
      cell: (info) => `₹${info.getValue()}`,
    },
    {
      accessorKey: "winningAmount",
      header: "Winning Amount",
      cell: (info) => `₹${info.getValue()}`,
    },
    {
      accessorKey: "status",
      header: "Status",
    },
    {
      accessorKey: "adminstatus",
      header: "Admin Status",
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: (info) => new Date(info.getValue()).toLocaleString(),
    },
    {
      accessorKey: "updatedAt",
      header: "Updated At",
      cell: (info) => new Date(info.getValue()).toLocaleString(),
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <button
          onClick={() => setSelectedGameApi(row.original)}
          className="px-3 py-1 text-xs rounded bg-blue-500 text-white hover:bg-blue-600"
        >
          View
        </button>
      ),
   }
  ])



  return (
    <div className="bg-[--color-neutral]">
      <div className="p-8">
        <table className="min-w-full mt-20 text-sm text-left text-gray-600">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
            <tr>
              <th className="px-4 py-2">Room ID</th>
              <th className="px-4 py-2">Created By</th>
              <th className="px-4 py-2">Accepted By</th>
              <th className="px-4 py-2">Bet Amount</th>
              <th className="px-4 py-2">Winning Amount</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Admin Status</th>
              {/* <th className="px-4 py-2">Screenshot</th> */}
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {completedGames.length > 0 ? (
              completedGames.map((p) => (
                <tr key={p._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{p.roomId}</td>
                  <td className="px-4 py-2">{p.createdByUsername}</td>
                  <td className="px-4 py-2">{p.acceptedByUsername?? "—"}</td>
                  <td className="px-4 py-2 font-medium">₹{p.betAmount}</td>
                  <td className="px-4 py-2 font-medium">₹{p.winningAmount}</td>
                  <td className="px-4 py-2">{p.status}</td>
                  <td className="px-4 py-2">{p.adminstatus}</td>
                  {/* <td className="px-4 py-2">
                    {p.winningScreenshots?.length > 0 ? (
                      <img
                        src={process.env.NEXT_PUBLIC_API_BASE_URL_Image + p.winningScreenshots[0].screenshot}
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      />
         
                    ) : "—"}
                  </td> */}
                  <td className="px-4 py-2">
                    <button
                      onClick={() => setSelectedGame(p)} // 👈 open modal
                      className="rounded bg-blue-500 cursor-pointer px-3 py-1 text-xs text-white hover:bg-blue-600"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="px-4 py-4 text-center text-gray-500">
                  No completed games found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 🔥 Modal */}
{/* 🔥 Modal */}
{selectedGame && (
  <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg shadow-lg p-6 w-[500px]">
      <h2 className="text-lg font-semibold mb-4">Game Details</h2>

      <p><strong>Room ID:</strong> {selectedGame.roomId}</p>
      <p><strong>Created By:</strong> {selectedGame.createdByUsername}</p>
      <p><strong>Accepted By:</strong> {selectedGame.acceptedByUsername}</p>

      {/* 🖼️ Show only 2 screenshots: createdBy & acceptedBy */}
      <div className="mt-4">
        <h3 className="text-sm font-medium mb-2">Screenshots</h3>
        <div className="flex gap-3">
          {selectedGame.winningScreenshots
            ?.filter(
              (s) =>
                s.username === selectedGame.createdByUsername ||
                s.username === selectedGame.acceptedByUsername
            )
            .slice(0, 2) // ✅ keep only 2
            .map((s) => (
              <img
                key={s._id}
                src={`${process.env.NEXT_PUBLIC_API_BASE_URL_Image}/${s.screenshot}`}
                alt={`${s.username}'s screenshot`}
                className="h-24 w-24 object-cover rounded border cursor-pointer hover:scale-105 transition"
                onClick={() =>
                  window.open(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL_Image}${s.screenshot}`,
                    "_blank"
                  )
                }
              />
            ))}
        </div>
      </div>

      {/* Winner Select */}
      <div className="mt-6">
        <label className="block text-sm font-medium">Select Winner</label>
        <select
          value={winner}
          onChange={(e) => setWinner(e.target.value)}
          className="mt-1 w-full border rounded px-2 py-1"
        >
          <option value="">-- Select Winner --</option>
          <option value={selectedGame.createdBy}>{selectedGame.createdByUsername}</option>
          <option value={selectedGame.acceptedBy}>{selectedGame.acceptedByUsername}</option>
        </select>
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <button
          onClick={() => setSelectedGame(null)}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          onClick={handleWinnerSubmit}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Submit Winner
        </button>
      </div>
    </div>
  </div>
)}


      <Table fetchData={fetchActiveCompltedGames} columnsDef={columns} filters={filters} />
        {selectedGameApi && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-lg w-[500px] shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Game Details</h2>

            <p><strong>Room ID:</strong> {selectedGameApi.roomId}</p>/
            <p><strong>Created By:</strong> {selectedGameApi.createdBy?.username}</p>
            <p><strong>Accepted By:</strong> {selectedGameApi.acceptedBy?.username}</p>
            <p><strong>Status:</strong> {selectedGameApi.status}</p>
            <p><strong>Bet Amount:</strong> ₹{selectedGameApi.betAmount}</p>
            <p><strong>Winning Amount:</strong> ₹{selectedGameApi.winningAmount}</p>

            <div className="mt-4">
              <h3 className="font-medium">Winning Screenshots</h3>
              {selectedGameApi.winningScreenshots?.length > 0 ? (
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {selectedGameApi.winningScreenshots.map((shot) => (
                    <img
                      key={shot._id}
                      src={`${process.env.NEXT_PUBLIC_API_BASE_URL_Image}${shot.screenshot}`}
                      alt="Winning Screenshot"
                      className="w-full h-32 object-cover rounded border"
                    />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No screenshots uploaded</p>
              )}
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setSelectedGameApi(null)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
