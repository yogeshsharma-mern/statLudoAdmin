"use client";
import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchActiveCompltedGames } from "@/redux/features/activeCompletedGamesSlice";
import Table from "@/components/Table";
import socket from "@/library/socket";
import { gameresult } from "@/redux/features/activeCompletedGamesSlice";
import toast from "react-hot-toast";
import Image from "next/image";
import { connectSocket, getSocket, disconnectSocket } from "@/library/socket";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import React from "react"
import { activeComplteGames } from "@/library/apicall";

export default function Page() {

  const [filters, setFilters] = useState({ status: "" });
  const { status } = useSelector(state => state.activecompltedgame);
  const [completedGames, setCompletedGames] = useState([]);
  const dispatcher = useDispatch();
  const [selectedGame, setSelectedGame] = useState(null); // 👈 modal state
  console.log("selectedGame", selectedGame);
  const [selectedGameApi, setSelectedGameApi] = useState(null);
  const [gameId, setgameId] = useState("");
  const [winner, setWinner] = useState("");
  const [winnderapi, setWinnderApi] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const adminId = Cookies.get("adminId");
  const [adminStatus, setAdminStatus] = useState(false);
  const router = useRouter();
  const { totalPages } = useSelector((state) => state.gameLog);
  // console.log("selectedGameApi", selectedGameApi)
  // useEffect(() => {

  //           console.log("✅ Registering user:");
  //           socket.emit("register_user", "68aeb1424102a546fd781973");


  //   }, []);
  // useEffect(() => {
  //   socket.connect();
  //   socket.on("connect", () => console.log("✅ Connected:", socket.id));

  //   socket.on("disconnect", () => console.log("❌ Disconnected"));

  //   socket.on("game_over", (data) => {
  //       console.log('datasocket',data);
  //     setCompletedGames((prev) => [data, ...prev]);
  //   });

  //   return () => {
  //     socket.off("connect");
  //     socket.off("disconnect");
  //     socket.disconnect();
  //   };
  // }, []);

  // useEffect(() => {

  //   const socket = getSocket();
  //   if (!socket) {
  //       console.warn("⚠ No active socket connection!");
  //       return;
  //     }

  //   console.log("heelovev");

  //     console.log("sockkkketidbeta",socket.id);
  //     socket.on("game_over", (data) => {
  //       console.log("Server says:", data);
  //       setCompletedGames((prev) => [data, ...prev]);
  //     });


  //   return () => {
  //     if (socket) {
  //       socket.off("game_over"); // ✅ correct event cleanup
  //     }
  //   };
  // }, []);

  // useEffect(() => {
  //   // 👇 give your real adminId here
  //   const socket = connectSocket("68aeb1424102a546fd781973");
  // console.log("hello ram ram");
  //   socket.on("game_over", (data) => {
  //     console.log("Server says:", data);
  //       setCompletedGames((prev) => [data, ...prev]);

  //   });
  //   //   socket.on("pending_payments_list", (data) => {
  //   //   console.log("Server says:", data);
  //   //   setPayments((prev) => [data, ...prev]);
  //   // });

  //   return () => {
  //     socket.off("game_over");
  //     // socket.off("new_payment");
  //     disconnectSocket(); // optional, only if you want to close on unmount
  //   };
  // }, []);

  // socket setup function
  const setupSocketListeners = (adminId) => {
    const socket = connectSocket(adminId);

    socket.on("game_over", (data) => {
      console.log("Server says:", data);
      setCompletedGames((prev) => [data, ...prev]);
    });

    return () => {
      socket.off("game_over");
      disconnectSocket();
    };
  };


  useEffect(() => {
    const cleanup = setupSocketListeners(adminId);
    return cleanup; // cleanup on unmount
  }, [adminId]);



  const handleWinnerSubmit = async () => {
    console.log("winner>>>>", winner);
    const socket = getSocket();
    if (!socket) return console.warn("⚠ No active socket connection!");

    const gameObj = {
      gameId: selectedGame._id,
      winner,
    };

    socket.emit("admin_winner_decision", gameObj);
    setReloadKey(selectedGame._id);
    // // ✅ Refresh UI
    router.refresh();
    // setReloadKey(prev => prev + 1);

    // ✅ Update state instantly
    setCompletedGames((prev) => {
      const index = prev.findIndex((g) => g._id === selectedGame._id);
      if (index === -1) return prev;
      return [...prev.slice(0, index), ...prev.slice(index + 1)];
    });

    setAdminStatus(true);
    setSelectedGame(null);
    setWinner("");
    setupSocketListeners(adminId);
    // ✅ Re-setup socket after winner is decided
  };


  const handleWinnerSubmitApi = async () => {

    const payload = {
      gameId: selectedGameApi._id,
      winnerId: winnderapi,
    };

    const res = await dispatcher(gameresult(payload));

    if (res.meta.requestStatus === "fulfilled") {
      setSelectedGameApi(null);
      toast.success("game result successfully delivered");
      setReloadKey(prev => prev + 1);
      // 🔄 table reload trigger
      console.log("reloadkey", reloadKey)



    } else {
      toast.error("Failed to deliver the game result");

    }
  }

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
      accessorKey: "winner",
      header: "Winner",
      cell: ({ row }) => {
        const winnerId = row.original.winner;
        // find winner name
        if (row.original.createdBy?._id === winnerId) {
          return row.original.createdBy.username;
        }
        if (row?.original?.acceptedBy?._id === winnerId) {
          return row.original.acceptedBy.username;
        }
        return "Unknown";
      },
    },
    // {
    //   accessorKey: "createdAt",
    //   header: "Created At",
    //   cell: (info) => new Date(info.getValue()).toLocaleString(),
    // },
    {
      accessorKey: "updatedAt",
      header: "Updated At",
      cell: (info) => new Date(info.getValue()).toLocaleString(),
    },
    {
      header: "Actions",
      cell: ({ row }) => {
        const [loading, setLoading] = React.useState(false);

        const handleClick = async () => {
          setLoading(true);

          // simulate async (e.g., waiting for adminstatus update from backend)
          await new Promise((resolve) => setTimeout(resolve, 500));

          setSelectedGameApi(row.original);
          setgameId(row.original._id);

          setLoading(false);
        };

        return (
          <div>
            {row.original.adminstatus !== "decided" && (
              <button
                onClick={handleClick}
                disabled={loading}
                className={`px-3 py-1 text-xs rounded text-white ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
                  }`}
              >
                {loading ? "Loading..." : "View"}
              </button>
            )}
          </div>
        );
      },
    }

    // {
    //   row.orignal.adminstatus!="decided" &&
    //     <button
    //   onClick={() => {setSelectedGameApi(row.original)
    //     setgameId(row.original._id);
    //   }}
    //   className="px-3 py-1 text-xs rounded bg-blue-500 text-white hover:bg-blue-600"
    // >
    //   View
    // </button>
    // }

    //     ),
    //  }
  ])



  return (
    <div className="bg-[var(--color-neutral)]">
      <div className="p-7 pt-14 overflow-scroll">
        <div className="mb-3 text-xl font-bold">Recent Completed Games</div>
        <table className="min-w-full  text-sm text-left text-[var(--color-text)]">
          <thead className="bg-[var(--table-colorss)] text-[var(--color-text)] uppercase text-xs">
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
                <tr key={p._id} className="border-b text-[var(--color-text)]">
                  <td className="px-4 py-2">{p.roomId}</td>
                  <td className="px-4 py-2">{p.createdByUsername}</td>
                  <td className="px-4 py-2">{p.acceptedByUsername ?? "—"}</td>
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
                <td colSpan="10" className="px-4 py-4 text-center text-[var(--color-text)]">
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
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-(--color-neutral)  rounded-lg shadow-lg p-6 w-[500px]">
            <h2 className="text-lg font-semibold mb-4">Game Details</h2>

            <p><strong>Room ID:</strong> {selectedGame.roomId}</p>
            <p><strong>Created By:</strong> {selectedGame.createdByUsername}</p>
            <p><strong>Accepted By:</strong> {selectedGame.acceptedByUsername}</p>

            {selectedGame.status === 'quit' && <p><strong>Quit By:</strong> {selectedGame?.quitByUsername}</p>}


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
                  .slice(0, 2) // ✅ only 2
                  .map((s) => (
                    <div key={s._id} className="relative">
                      <img
                        unoptimized
                        src={`${process.env.NEXT_PUBLIC_API_BASE_URL_Image}/${s.screenshot}`}
                        alt={`${s.username}'s screenshot`}
                        className="h-24 w-24 object-cover rounded border cursor-pointer hover:scale-105 transition"
                        onClick={() =>
                          window.open(
                            `${process.env.NEXT_PUBLIC_API_BASE_URL_Image}/${s.screenshot}`,
                            "_blank"
                          )
                        }
                      />
                      {/* 🏷️ Username overlay */}
                      <div className="absolute bottom-0 left-0 w-full bg-black/60 text-white text-[12px] text-center py-0.5 rounded-b">
                        {s.username}
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Winner Select  for socket*/}
            <div className="mt-6">
              <label className="block text-sm font-medium">Select Winner</label>
              <select
                value={winner}
                onChange={(e) => setWinner(e.target.value)}
                className="mt-1 w-full border rounded px-2 py-1"
              >
                <option value="">-- Select Winner --</option>
                <option value={selectedGame.createdBy}>
                  {selectedGame.createdByUsername}
                </option>
                <option value={selectedGame.acceptedBy}>
                  {selectedGame.acceptedByUsername}
                </option>
                <option value={null}>
                  none
                </option>

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



      <Table pending={status} title="All Completed Games"
        reloadKey={reloadKey}   // 👈 pass here
        filtersUI={
          <>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="rounded-lg border px-2 py-1 text-sm"
            >
              <option value="">All Status</option>
              <option value="decided">Decided</option>
              <option value="notDecided">Not decided</option>


            </select>

            {/* <input
            type="number"
            placeholder="Min Bet"
            value={filters.betAmountMin}
            onChange={(e) =>
              setFilters({ ...filters, betAmountMin: e.target.value })
            }
            className="w-24 rounded-lg border px-2 py-1 text-sm"
          /> */}
            {/* <input
            type="number"
            placeholder="Max Bet"
            value={filters.betAmountMax}
            onChange={(e) =>
              setFilters({ ...filters, betAmountMax: e.target.value })
            }
            className="w-24 rounded-lg border px-2 py-1 text-sm"
          /> */}
          </>
        } fetchData={fetchActiveCompltedGames} columnsDef={columns} filters={filters} />
      {selectedGameApi && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-(--color-neutral)  p-6 rounded-lg w-[500px] shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Game Details</h2>

            <p><strong>Room ID:</strong> {selectedGameApi.roomId}</p>
            <p><strong>Created By:</strong> {selectedGameApi.createdBy?.username}</p>
            <p><strong>Accepted By:</strong> {selectedGameApi.acceptedBy?.username}</p>
            <p><strong>Status:</strong> {selectedGameApi.status}</p>

            {selectedGameApi.status === 'quit' && <p><strong>Quit By:</strong> {selectedGameApi?.quitBy?.username}</p>}

            <p><strong>Bet Amount:</strong> ₹{selectedGameApi.betAmount}</p>
            <p><strong>Winning Amount:</strong> ₹{selectedGameApi.winningAmount}</p>

            <div className="mt-4">
              <h3 className="font-medium">Winning Screenshots</h3>
              {selectedGameApi.winningScreenshots?.length > 0 ? (
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {selectedGameApi.winningScreenshots.map((shot) => {
                    // 🔑 Find username from userId
                    const username =
                      shot.user === selectedGameApi.createdBy?._id
                        ? selectedGameApi.createdBy?.username
                        : shot.user === selectedGameApi.acceptedBy?._id
                          ? selectedGameApi.acceptedBy?.username
                          : "Unknown";

                    return (
                      <div key={shot._id} className="relative">
                        {/* Screenshot */}
                        <img
                          src={`${process.env.NEXT_PUBLIC_API_BASE_URL_Image}/${shot.screenshot}`}
                          alt={`${username}'s screenshot`}
                          className="w-full h-32 object-cover rounded border"
                        />

                        {/* Username overlay */}
                        <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs text-center py-1 rounded-b">
                          {username}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No screenshots uploaded</p>
              )}
            </div>

            {/* Select Winner api */}
            <div className="mt-4">
              <label className="block text-sm font-medium">Select Winner</label>
              <select
                value={winnderapi}
                onChange={(e) => setWinnderApi(e.target.value)}
                className="mt-1 w-full border rounded px-2 py-1"
              >
                <option value="">-- Select Winner --</option>
                <option value={selectedGameApi.createdBy?._id}>
                  Created By ({selectedGameApi.createdBy?.username})
                </option>
                <option value={selectedGameApi.acceptedBy?._id}>
                  Accepted By ({selectedGameApi.acceptedBy?.username})
                </option>
                <option value={"none"}>
                  none
                </option>
              </select>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setSelectedGameApi(null)}
                className="px-4 py-2 bg-gray-400 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() => handleWinnerSubmitApi()}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Submit Winner
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

