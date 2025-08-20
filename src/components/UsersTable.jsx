"use client";

import { useMemo, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { FiEdit2, FiTrash2, FiPlus, FiSearch, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import UserFormModal from "./UserFormModel";

export default function UsersTable({ initialUsers = [] }) {
  // --- Local state (replace with Redux or API later) ---
  const [users, setUsers] = useState(initialUsers);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  // Global (client-side) search
  const filtered = useMemo(() => {
    if (!query) return users;
    const q = query.toLowerCase();
    return users.filter((u) =>
      [u.name, u.email, u.role, u.status].some((v) => String(v).toLowerCase().includes(q))
    );
  }, [users, query]);

  const columns = useMemo(
    () => [
      { accessorKey: "name", header: "Name", cell: (info) => info.getValue() },
      { accessorKey: "email", header: "Email", cell: (info) => info.getValue() },
      { accessorKey: "role", header: "Role", cell: (info) => info.getValue() },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ getValue }) => (
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
              getValue() === "Active"
                ? "bg-green-100 text-green-700"
                : getValue() === "Blocked"
                ? "bg-red-100 text-red-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {getValue()}
          </span>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <button
              className="rounded-md bg-indigo-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700"
              onClick={() => openEdit(row.original)}
              title="Edit"
            >
              <FiEdit2 />
            </button>
            <button
              className="rounded-md bg-rose-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-rose-700"
              onClick={() => removeUser(row.original.id)}
              title="Delete"
            >
              <FiTrash2 />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: filtered,
    columns,
    state: { sorting: sort },
    onSortingChange: setSort,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageIndex: 0, pageSize: 8 } },
  });

  // --- CRUD handlers (swap these with API calls/Redux later) ---
  const openAdd = () => {
    setEditing(null);
    setModalOpen(true);
  };
  const openEdit = (user) => {
    setEditing(user);
    setModalOpen(true);
  };
  const upsertUser = (payload) => {
    setUsers((list) => {
      if (payload.id) {
        return list.map((u) => (u.id === payload.id ? payload : u));
      }
      const id = crypto.randomUUID();
      return [{ ...payload, id }, ...list];
    });
    setModalOpen(false);
  };
  const removeUser = (id) => setUsers((list) => list.filter((u) => u.id !== id));

  return (
    <div className="rounded-2xl w-full  p-6 shadow">
      {/* Header row */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-xs">
          <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search users…"
            className="w-full rounded-xl border border-gray-300 py-2 pl-9 pr-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          <FiPlus /> Add User
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b bg-gray-50 text-gray-700">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className="cursor-pointer px-4 py-3 font-semibold"
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {{
                      asc: " ▲",
                      desc: " ▼",
                    }[header.column.getIsSorted()] ?? null}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-b hover:bg-gray-500">
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
          Page <span className="font-semibold">{table.getState().pagination.pageIndex + 1}</span> of{" "}
          <span className="font-semibold">{table.getPageCount() || 1}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="rounded-lg border px-3 py-1 text-sm disabled:opacity-40"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <FiChevronLeft className="inline" /> Prev
          </button>
          <button
            className="rounded-lg border px-3 py-1 text-sm disabled:opacity-40"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next <FiChevronRight className="inline" />
          </button>

          <select
            className="ml-2 rounded-lg border px-2 py-1 text-sm"
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
          >
            {[5, 8, 10, 20, 50].map((n) => (
              <option key={n} value={n}>
                {n} / page
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Modal */}
      <UserFormModal
        open={modalOpen}
        initial={editing}
        onClose={() => setModalOpen(false)}
        onSubmit={upsertUser}
      />
    </div>
  );
}
