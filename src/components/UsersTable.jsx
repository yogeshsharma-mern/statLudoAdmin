"use client";

import { useMemo, useState, useEffect } from "react";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { FiEdit2, FiTrash2, FiPlus, FiSearch, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { MdBlock } from "react-icons/md";
import { CgUnblock } from "react-icons/cg";
import UserFormModal from "./UserFormModel";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, userBlocked, userUnBlocked } from "@/redux/features/userSlice";
import toast from "react-hot-toast";
import { updateUsers } from "@/redux/features/userSlice";
import { FaEye } from "react-icons/fa6";
import Modal from "./Modal";
import { userDetails } from "@/redux/features/userSlice";
import Loader from "@/components/Loader";
import ConfirmBox from "./ConfirmBox";
import GlobalLoading from "@/components/GlobalLoading";
import { useDebounce } from "@/library/hooks/useDebounce";
import { MdDashboard } from "react-icons/md";

export default function UsersTable() {
  const dispatch = useDispatch();
  const { items: users, status, error, totalPages: rawTotalPages } = useSelector((state) => state.user);
  console.log("totalpages", rawTotalPages);
  const totalPages = Number(rawTotalPages) || 1; // ✅ take users directly from Redux
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5); // 👈 local limit
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
   const [openConfirm, setOpenConfirm] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [userDetail, setUserDetails] = useState([]);
  const [blockId,setBlockId]= useState(null);
    const [filters, setFilters] = useState({
      status: "",
      
    });
     const debouncedSearch = useDebounce(query, 1000);

  console.log("blockid",blockId);
  console.log("filters",filters);

  const [editing, setEditing] = useState("");

  // fetch users initially
  useEffect(() => {
    dispatch(fetchUsers({ page: currentPage, limit: pageSize, search: debouncedSearch,filters }));
  }, [dispatch, currentPage, pageSize, debouncedSearch,filters]);
  console.log("gg", { page: currentPage, limit: pageSize, search: query })
  // Search filter
  // const filtered = useMemo(() => {
  //   if (!query) return users;
  //   const q = query.toLowerCase();
  //   return users.filter((u) =>
  //     [u.username, u.phone, u.kycStatus].some((v) =>
  //       String(v || "").toLowerCase().includes(q)
  //     )
  //   );
  // }, [users, query]);

  // Table columns
  const columns = useMemo(
    () => [
      { accessorKey: "username", header: "Username" },
      { accessorKey: "phone", header: "Phone" },
      // { accessorKey: "referCode", header: "Refer Code" },
        {
        accessorKey:"credit",header:"Credit"
      },
      {accessorKey:"penalty", header:"Penalty"},
      // {
      //   accessorKey: "kycStatus",
      //   header: "KYC Status",
      //   cell: ({ getValue }) => {
      //     const val = getValue();
      //     return (
      //       <span
      //         className={`rounded-full px-2.5 py-1 text-xs font-semibold ${val === "Approved"
      //           ? "bg-green-100 text-green-700"
      //           : val === "Pending"
      //             ? "bg-yellow-100 text-yellow-700"
      //             : "bg-red-100 text-red-700"
      //           }`}
      //       >
      //         {val}
      //       </span>
      //     );
      //   },
      // },
    
      {
        accessorKey: "isBanned",
        header: "Blocked",
        cell: ({ getValue }) =>
          getValue() ? (
            <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700">
              Yes
            </span>
          ) : (
            <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
              No
            </span>
          ),
      },
      { accessorKey: "battlePlayed", header: "Battles" },
      { accessorKey: "cashWon", header: "Cash Won" },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            {/* <button
              className="rounded-md bg-indigo-600 cursor-pointer px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700"
              onClick={() => openEdit(row.original._id)}
              title="Edit"
            >
              <FiEdit2 />
            </button> */}
            <button
              className="rounded-md cursor-pointer bg-green-500 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-green-600"
              onClick={() => handleView(row.original._id)}
              title="viewuser"
            >
           <span className="hidden md:block" >User Dashboard</span>
           <MdDashboard className="md:hidden" />
            </button>
            {row.original.isBanned ? (
              <button
                className="rounded-md bg-green-600 cursor-pointer px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-green-700"
                onClick={() => handleUnblock(row.original._id)}
                title="Unblock"
              >
                <CgUnblock />
              </button>
            ) : (
              <button
                className="rounded-md bg-rose-600 cursor-pointer px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-rose-700"
                onClick={() => (setOpenConfirm(true),
                setBlockId(row.original._id)
                )}
                title="Block"
              >
                <MdBlock />
              </button>
            )}

          </div>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: users,
    columns,
    manualPagination: true,       // we handle pagination on server
    pageCount: totalPages ?? -1,  // backend tells total pages
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      pagination: {
        pageIndex: currentPage - 1, // react-table is 0-based
        pageSize: pageSize,
      },
      sorting: sort,
    },
    onSortingChange: setSort,
  });


  const updateUser = async (formData) => {
    console.log("Updated Data:", formData); // ✅ yaha aa gaya pura data

    // API / Redux call karna hai
    const id = editing;
    const res = await dispatch(updateUsers({ id, data: formData }));
    console.log("resssssss", res)
    if (res.meta.requestStatus === "fulfilled") {
      toast.success("User updated successfully");
      setModalOpen(false);
    } else {
      toast.error("Failed to update user");
    }
  };


  // CRUD actions
  // const openAdd = () => {
  //   setEditing(null);
  //   setModalOpen(true);
  // };
  const openEdit = (_id) => {
    setEditing(_id);
    setModalOpen(true);
  };
  const removeUser = (_id) => {
    toast("Delete action not wired yet"); // placeholder
  };

  const handleBlock = async (blockId) => {
    const res = await dispatch(userBlocked(blockId));
    if (res.meta.requestStatus === "fulfilled") {
      toast.success("User blocked successfully");
      setOpenConfirm(false);
    } else {
      toast.error("Failed to block user");
    }
  };
  const handleView = async (_id) => {
    setViewModal(true);
    const res = await dispatch(userDetails(_id));
    console.log("userdetails", res.payload.data);
    setUserDetails(res.payload.data);

  }

  const handleUnblock = async (_id) => {
    const res = await dispatch(userUnBlocked(_id));
    if (res.meta.requestStatus === "fulfilled") {
      toast.success("User unblocked successfully");
    } else {
      toast.error("Failed to unblock user");
    }
  };

  return (
    <div className="rounded-2xl w-full p-6 h-[90vh] overflow-auto shadow">
       <ConfirmBox
        isOpen={openConfirm}
        onClose={() => setOpenConfirm(false)}
        onConfirm={()=>handleBlock(blockId)}
        title="Are you sure you want to block this user?"
        message="This action cannot be undone. Do you really want to block this user?"
      />
      <div className="text-xl font-semibold mt-8 md:mt-auto ">Users</div>
 
      {/* {status === "failed" && <p className="text-red-400">{error}</p>} */}

      {/* Header row */}
      <div className="mb-4 flex justify-end  gap-3 sm:flex-row w-full ">
        <div className="relative max-w-xs ">
          <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search users…"
            className="w-full rounded-xl border border-gray-400 py-2 pl-9 pr-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
       
        </div>
            <>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="rounded-lg border px-2 py-1 text-sm"
          >
            <option value="">All Users</option>
            <option value="banned">Blocked Users</option>
            <option value="unbanned">Unblocked Users</option>
            <option value="active">Active Users</option>
            <option value="inactive">Inactive Users</option>

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
        {/* <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          <FiPlus /> Add User
        </button> */}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-left bg-white text-sm">
          <thead className="border-b border-gray-200 bg-gray-50 text-gray-700">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className="cursor-pointer px-4 py-3 font-semibold"
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {{ asc: " ▲", desc: " ▼" }[header.column.getIsSorted()] ?? null}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
                 {status === "loading" && <div className="flex items-center justify-center w-[70vw] h-[30vh]">
                  <div className="flex w-full justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
                  </div>}
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-b border-gray-200 hover:bg-(--color-neutral)">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
            {table.getRowModel().rows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-4 py-10 text-center text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
        <div className="text-sm text-gray-600">
          Page{" "}
          <span className="font-semibold">{table.getState().pagination.pageIndex + 1}</span>{" "}
          of <span className="font-semibold">{table.getPageCount() || 1}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="rounded-lg border px-2 md:px-3 py-1 text-sm disabled:opacity-40"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <FiChevronLeft className="inline" /> Prev
          </button>
          <span className="text-sm">Page {currentPage} of {totalPages}</span>
          <button
            className="rounded-lg border px-2 md:px-3 py-1 text-sm disabled:opacity-40"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next <FiChevronRight className="inline" />
          </button>
          <select
            className="ml-2 rounded-lg border px-2 py-1 text-sm"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1); // reset to first page when size changes
            }}
          >
            {[5, 10, 20, 50].map((n) => (
              <option key={n} value={n}>
                {n} / page
              </option>
            ))}
          </select>
        </div>

      </div>

      <UserFormModal
        open={modalOpen}
        initial={editing}
            userDetail={userDetail}
        onClose={() => setModalOpen(false)}
        onSubmit={updateUser}
      />
      <Modal
        open={viewModal}
        onClose={() => setViewModal(false)}
        title="User Details"
        userDetail={userDetail}
      >
        {/* <div className="space-y-3 text-gray-700">
          <div>
            <strong>Full Name:</strong> {userDetail.fullName}
          </div>
          <div>
            <strong>Username:</strong> {userDetail.username}
          </div>
          <div>
            <strong>Credit:</strong> {userDetail.credit}
          </div>
           <div>
            <strong>Penalty:</strong> {userDetail.penalty}
          </div>
          <div>
            <strong>Phone:</strong> {userDetail.phone}
          </div>
          <div>
            <strong>Date of Birth:</strong> {new Date(userDetail.dob).toLocaleDateString()}
          </div>
          <div>
            <strong>Gender:</strong> {userDetail.gender}
          </div>
          <div>
            <strong>Address:</strong> {userDetail.address}
          </div>
          <div>
            <strong>Aadhaar Number:</strong> {userDetail.aadhaarNumber}
          </div>
          <div>
            <strong>Referral Code:</strong> {userDetail.referCode}
          </div>
          <div>
            <strong>Referral Rank:</strong> {userDetail.referRank}
          </div>
          <div>
            <strong>Referral Earning:</strong> ₹{userDetail.referralEarning}
          </div>
          <div>
            <strong>Completed Games:</strong> {userDetail.completedGames}
          </div>
          <div>
            <strong>Battle Played:</strong> {userDetail.battlePlayed}
          </div>
          <div>
            <strong>Cash Won:</strong> ₹{userDetail.cashWon}
          </div>
          <div>
            <strong>Winning Amount:</strong> ₹{userDetail.winningAmount}
          </div>
          <div>
            <strong>KYC Status:</strong> {userDetail.kycStatus}
          </div>
          <div>
            <strong>Is Active:</strong> {userDetail.isActive ? "Yes" : "No"}
          </div>
          <div>
            <strong>Is Banned:</strong> {userDetail.isBanned ? "Yes" : "No"}
          </div>
          <div>
            <strong>Created At:</strong> {new Date(userDetail.createdAt).toLocaleString()}
          </div>
          <div>
            <strong>Updated At:</strong> {new Date(userDetail.updatedAt).toLocaleString()}
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={() => setViewModal(false)}
            className="rounded-lg border px-4 py-2 hover:bg-gray-100 transition"
          >
            Close
          </button>
         
        </div> */}
      </Modal>

    </div>
  );
}
