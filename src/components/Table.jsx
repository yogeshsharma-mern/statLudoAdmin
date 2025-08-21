import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search } from "lucide-react";

const ServerDataTable = ({ columns, fetchData }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);

  // Fetch from backend whenever filters change
  useEffect(() => {
    const loadData = async () => {
      const response = await fetchData({
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
        sortKey: sortConfig.key,
        sortDirection: sortConfig.direction,
      });
      setRows(response.data);
      setTotal(response.total);
    };
    loadData();
  }, [currentPage, itemsPerPage, searchTerm, sortConfig, fetchData]);

  const totalPages = Math.ceil(total / itemsPerPage);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  return (
    <div className="p-4 bg-white rounded-2xl shadow-md">
      {/* Search & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-2">
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // reset to first page
            }}
            className="w-full pl-8 pr-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <select
          value={itemsPerPage}
          onChange={(e) => {
            setItemsPerPage(Number(e.target.value));
            setCurrentPage(1); // reset to first page
          }}
          className="border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {[5, 10, 20, 50].map((num) => (
            <option key={num} value={num}>
              {num} per page
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border rounded-xl overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.accessor}
                  onClick={() => handleSort(col.accessor)}
                  className="px-4 py-2 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:text-indigo-600"
                >
                  {col.label}
                  {sortConfig.key === col.accessor && (
                    <span>{sortConfig.direction === "asc" ? " ▲" : " ▼"}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx} className="border-t hover:bg-gray-50">
                {columns.map((col) => (
                  <td key={col.accessor} className="px-4 py-2 text-sm text-gray-700">
                    {row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4 text-sm">
        <span>
          Showing {(currentPage - 1) * itemsPerPage + 1}-
          {Math.min(currentPage * itemsPerPage, total)} of {total}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="p-1 rounded hover:bg-gray-200 disabled:opacity-50"
          >
            <ChevronsLeft size={18} />
          </button>
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-1 rounded hover:bg-gray-200 disabled:opacity-50"
          >
            <ChevronLeft size={18} />
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-1 rounded hover:bg-gray-200 disabled:opacity-50"
          >
            <ChevronRight size={18} />
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className="p-1 rounded hover:bg-gray-200 disabled:opacity-50"
          >
            <ChevronsRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServerDataTable;

/* ================== USAGE EXAMPLE ==================

const columns = [
  { label: "Name", accessor: "name" },
  { label: "Email", accessor: "email" },
  { label: "Role", accessor: "role" },
];

async function fetchUsers({ page, limit, search, sortKey, sortDirection }) {
  const res = await fetch(
    `/api/users?page=${page}&limit=${limit}&search=${search}&sortKey=${sortKey}&sortDir=${sortDirection}`
  );
  return await res.json(); // { data: [], total: number }
}

<ServerDataTable columns={columns} fetchData={fetchUsers} />

=================================================== */
