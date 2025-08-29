"use client";

import { useMemo, useState, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import Loader from "./Loader";
import { useDispatch } from "react-redux";
import GlobalLoading from "@/components/GlobalLoading";
import { useDebounce } from "@/library/hooks/useDebounce";
import GlobalLoader from "@/components/GlobalLoading";


export default function DataTable({
  title,
  fetchData,      // function to fetch data
  columnsDef,     // array of column definitions
  pageSizeOptions = [5, 10, 20],
  initialPageSize = 5,
  totalpages,
    reloadKey,       // 👈 new prop
  actions = {},
   filters = {},    
   filtersUI = null,  
   pending ,
   flag
  
     // object { view: fn, edit: fn, delete: fn, add: fn }
}) {
  
  const dispatcher = useDispatch();
  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState([]);
  const debounceSearch = useDebounce(query,1000);
console.log("pagesize",pageSize);
  // Fetch data
// DataTable.jsx
// useEffect(() => {
//   const loadData = async () => {
//     try {
//       // thunk dispatch karna hai
//       const res = await dispatcher(
//         fetchData({
//           page: currentPage,
//           limit: pageSize,
//           search: debounceSearch,
//           sort,    
//           filters, 
//         })
//       );
//       console.log("respppppp",res);

//       // if (res.payload) {
//       //   setData(res.payload || []);
//       //   setTotalPages(res.payload.pages || 1);
//       // }
//       if (res.payload) {
//   if (Array.isArray(res.payload)) {
//     // agar API directly array bhejti hai
//     setData(res.payload);
//     setTotalPages(res.payload.pages || 1);
//   } else {
//     // agar API object bhejti hai {games: [], pages: 5}
//     setData(res.payload.games || []);
//     setTotalPages(res.payload.pages || 1);
//   }
// } else {
//   // agar kuch bhi data nahi aaya
//   setData([]);
//   setTotalPages(1);
// }

//     } catch (err) {
//       console.error("Failed to fetch data:", err);
//     }
//   };

//   loadData();
// }, [dispatcher, currentPage, pageSize,debounceSearch,filters,reloadKey]);

useEffect(() => {
  const loadData = async () => {
    try {
      const res = await dispatcher(
        fetchData({
          page: currentPage,
          limit: pageSize,
          search: debounceSearch,
          sort,
          filters,
        })
      );

      console.log("respppppp", res);

      if (res.payload) {
        // 🔹 Normalize response
        const data =
          res.payload.payments || // if API gives { payments: [...] }
          res.payload.games ||  
          res.payload.withdraws ||  // if API gives { games: [...] }
          (Array.isArray(res.payload) ? res.payload : []); // if API gives []

        const totalPages = res.payload.pages || 1;

        setData(data);
        setTotalPages(totalPages);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  loadData();
}, [currentPage, pageSize, debounceSearch, sort, filters, dispatcher]);


  const columns = useMemo(() => columnsDef, [columnsDef]);

  const table = useReactTable({
    data,
    columns,
    manualPagination: true,
    pageCount: totalPages,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      pagination: { pageIndex: currentPage - 1, pageSize },
      sorting: sort,
    },
    onSortingChange: setSort,
  });

  return (
    <div className="rounded-2xl w-full p-6 shadow bg-[var(--color-neutral)] h-[90vh] overflow-auto">
      <div className="text-xl font-semibold mb-4">{title}</div>

      {/* Search + Add */}
      <div className="mb-4 flex justify-between gap-3 flex-wrap">
      {
        flag !==1 &&
          <div className="relative md:flex justify-between w-full ">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
            className="w-xs  mb-3 md:mb-auto rounded-xl border border-gray-400 py-2 px-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        
         <div className="w-full flex gap-3 justify-end mr-10">
            {filtersUI}
         </div>
       
        </div>
      }
        {actions.add && (
          <button
            onClick={actions.add}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Add
          </button>
        )}
      </div>

      {/* Table */}
      {loading ? (
     <GlobalLoading/>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left bg-[--color-neutral] text-sm ">
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
                  {actions.view || actions.edit || actions.delete ? (
                    <th className="px-4 py-3">Actions</th>
                  ) : null}
                </tr>
              ))}
            </thead>
            <tbody>
              {pending === "loading" && <div className="flex items-center justify-center w-[70vw] h-[30vh]">
                  <div className="flex w-full justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
                  </div>}

              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-b border-gray-200 hover:bg-gray-50">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                  {(actions.view || actions.edit || actions.delete) && (
                    <td className="px-4 py-3 flex gap-2">
                      {actions.view && (
                        <button
                          onClick={() => actions.view(row?.original)}
                          className="text-green-600 hover:text-green-800"
                        >
                          View
                        </button>
                      )}
                      {actions.edit && (
                        <button
                          onClick={() => actions.edit(row?.original)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Edit
                        </button>
                      )}
                      {actions.delete && (
                        <button
                          onClick={() => actions.delete(row?.original)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
              {table.getRowModel().rows.length === 0 && (
                <tr>
                  <td colSpan={columns.length + 1} className="px-4 py-10 text-center text-gray-500">
                    No data found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
        <div className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </div>
        <div className="flex items-center gap-2">
          <button
            className="rounded-lg border px-2 py-1 text-sm disabled:opacity-40"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Prev
          </button>
            <span className="text-sm">Page {currentPage} of {totalPages}</span>
          <button
            className="rounded-lg border px-2 py-1 text-sm disabled:opacity-40"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
          <select
            className="ml-2 rounded-lg border px-2 py-1 text-sm"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}


            
          >
            {pageSizeOptions.map((n) => (
              <option key={n} value={n}>
                {n} / page
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
