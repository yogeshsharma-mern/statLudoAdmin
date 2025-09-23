"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FiX } from "react-icons/fi";
import { axiosApiInstance } from "@/library/helper";
import { addcredits } from "@/redux/features/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { fetchuserGameData } from "@/redux/features/userGameSlice";
import Table from "@/components/Table";
import toast from "react-hot-toast";
import { useMemo } from "react";
import { IoAddSharp } from "react-icons/io5";
import { FaUserEdit } from "react-icons/fa";
import { fetchUserWithdrawData } from "@/redux/features/userWithdrawSlice";
import { fetchuserCreditData } from "@/redux/features/userCreditSlice";
import { fetchuserTransactionData } from "@/redux/features/userTransactionSlice";
import { userWithdrawApproved } from "@/redux/features/userWithdrawSlice";
import { userWithdrawReject } from "@/redux/features/userWithdrawSlice";
import UpdatePasswordPage from "@/app/(routes)/admin/dashboard/update-password/page";
import { TbLockPassword } from "react-icons/tb";
import {fetchuserReferals} from "@/redux/features/userReferalSlice";

// import {fetchuserTransactionData}  from "@/redux/features/userTransactionSlice";



export default function Modal({ open, onClose, userDetail }) {
  const userId=userDetail._id;
  console.log("userId",userId);
  const { status: gamestatus } = useSelector(state => state.usergamedetails);
  const { status: withdrawStatus } = useSelector(state => state.userwithdrawdetails);
  const { status: transactionStatus } = useSelector(state => state.usertransaction);
  const [activeTab, setActiveTab] = useState("details");
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [passwordModal,setshowpasswordModal] = useState(false);
  const [creditValue, setCreditValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const tabs = [
    { key: "details", label: "Details" },
    { key: "games", label: "Games" },
    // { key: "credits", label: "Credits" },
    { key: "withdraw", label: "Withdraw" },
    // { key: "referral", label: "Referral" },
    { key: "transactions", label: "Transactions" },
    // {
    //   key:"referal", label:"Referals"
    // }
  ];
  const [filters, setFilters] = useState({
    status: "",
  });
  console.log("filters", filters);
  const columns = useMemo(
    () => [
      {
        accessorKey: "createdBy",
        header: "Created By",
        cell: ({ getValue }) => {
          const val = getValue();
          return val?.username ?? "—"; // sirf username render karega
        },
      },
      {
        accessorKey: "acceptedBy",
        header: "Accepted By",
        cell: ({ getValue }) => {
          const val = getValue();
          return val?.username ?? "—"; // null hone par "—"
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
                    : val === "cancelled"
                      ? "bg-gray-200 text-gray-600"
                      : "bg-yellow-100 text-yellow-700"
                }`}
            >
              {val}
            </span>
          );
        },
      },
      // {
      //   accessorKey: "winner",
      //   header: "Winner",
      //   cell: ({ getValue }) => `₹${getValue()}`,
      // },
      {
        accessorKey: "winner",
        header: "Winner",
        cell: ({ row }) => {
          const winner = row?.original?.winner?.username;

          // find winner name

          return winner;
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
  const transactionColumns = useMemo(
    () => [
      {
        accessorKey: "userId",
        header: "User",
        cell: ({ getValue }) => {
          const user = getValue();
          return (
            <div>
              <div className="font-medium">{user?.username ?? "—"}</div>
              <div className="text-xs text-gray-500">{user?.phone ?? "—"}</div>
            </div>
          );
        },
      },
      {
        accessorKey: "utrNumber",
        header: "UTR Number",
        cell: ({ getValue }) => getValue() || "—",
      },
      {
        accessorKey: "amount",
        header: "Amount",
        cell: ({ getValue }) => `₹${getValue()}`,
      },
      {
        accessorKey: "screenshot",
        header: "Screenshot",
        cell: ({ getValue }) =>
          getValue() ? (
            <a
              href={process.env.NEXT_PUBLIC_API_BASE_URL_Image + getValue()}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 underline"
            >
              View
            </a>
          ) : (
            "—"
          ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ getValue }) => {
          const val = getValue();
          return (
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-semibold
              ${val === "approved"
                  ? "bg-green-100 text-green-700"
                  : val === "pending"
                    ? "bg-yellow-100 text-yellow-700"
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
    ],
    []
  );


  const handleApprovedWidhdraw = async (id) => {
    const res = await dispatch(userWithdrawApproved(id));
    console.log("ressssppp", res);
    if (res.meta.requestStatus === "fulfilled") {
      toast.success("User withdraw paid");
      setReloadKey(prev => prev + 1); // 🔄 table reload trigger

    } else {
      toast.error("failed to  user withdraw ");
    }
  }

  const handleRejectWidhdraw = async (id) => {
    const res = await dispatch(userWithdrawReject(id));
    if (res.meta.requestStatus === "fulfilled") {
      toast.success("User withdraw reject successfully");
      setReloadKey(prev => prev + 1); // 🔄 table reload trigger

    } else {
      toast.error("Failed to user withdraw reject");
    }
  }
  const withdrawColumns = useMemo(
    () => [
      {
        accessorKey: "userId",
        header: "User",
        cell: ({ getValue }) => {
          const val = getValue();
          return val?.username ?? "—"; // username show
        },
      },
      {
        accessorKey: "userId.phone",
        header: "Phone",
      },
      {
        accessorKey: "userId.credit",
        header: "Credit",
        cell: ({ getValue }) => `₹${getValue()}`,
      },
      {
        accessorKey: "amount",
        header: "Amount",
        cell: ({ getValue }) => `₹${getValue()}`,
      },
      {
        accessorKey: "bankAccount",
        header: "Bank Account",
      },
      {
        accessorKey: "ifsc",
        header: "IFSC",
      },
      {
        accessorKey: "upiId",
        header: "UPIId",
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
      // {
      //   accessorKey: "createdAt",
      //   header: "Created At",
      //   cell: ({ getValue }) =>
      //     new Date(getValue()).toLocaleString("en-GB", {
      //       day: "2-digit",
      //       month: "short",
      //       year: "numeric",
      //       hour: "2-digit",
      //       minute: "2-digit",
      //     }),
      // },
      // {
      //   accessorKey: "updatedAt",
      //   header: "Updated At",
      //   cell: ({ getValue }) =>
      //     new Date(getValue()).toLocaleString("en-GB", {
      //       day: "2-digit",
      //       month: "short",
      //       year: "numeric",
      //       hour: "2-digit",
      //       minute: "2-digit",
      //     }),
      // },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          return (
            <div>
              { 
               ( row.original.status != "paid" && row.original.status != "rejected") &&

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
                    onClick={() => handleApprovedWidhdraw(row.original._id)}
                    title="viewuser"
                  >
                    <span className="" >Approved</span>
                    {/* <MdDashboard className="md:hidden" /> */}
                  </button>
                  <button
                    className="rounded-md cursor-pointer bg-red-500 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-red-600"
                    onClick={() => handleRejectWidhdraw(row.original._id)}
                    title="viewuser"
                  >
                    <span className="" >Reject</span>
                    {/* <MdDashboard className="md:hidden" /> */}
                  </button>

                </div>
              }
            </div>
          )
        }
      },
    ],
    []
  );

  const fetchUserGames = (params = {}) => {
    return fetchuserGameData({ id: userDetail._id, ...params });
  };
  const fetchuserCredit = (params = {}) => {
    return fetchuserCreditData({ id: userDetail._id, ...params });
  };
  const fetchWithdraw = (params = {}) => {
    return fetchUserWithdrawData({ id: userDetail._id, ...params });
  };
  const fetchTransaction = (params = {}) => {
    return fetchuserTransactionData({ id: userDetail._id, ...params });
  };
    const fetchReferaldata = (params = {}) => {
    return fetchuserReferals({ id: userDetail._id, ...params });
  };
  // initialize form
  useEffect(() => {
    if (userDetail) {
      setForm({
        fullName: userDetail.fullName || "",
        username: userDetail.username || "",
        credit: userDetail.credit || 0,
        penalty: userDetail.penalty || 0,
        phone: userDetail.phone || "",
        // referCode: userDetail.referCode || "",
        // referRank: userDetail.referRank || "",
        // referralEarning: userDetail.referralEarning || 0,
        completedGames: userDetail.completedGames || 0,
        battlePlayed: userDetail.battlePlayed || 0,
        cashWon: userDetail.cashWon || 0,
        winningAmount: userDetail.winningAmount || 0,
        isActive: userDetail.isActive || false,
        isBanned: userDetail.isBanned || false,
      });
    }
  }, [userDetail]);

  // close on ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!open) return null;

  // validation
  const validate = () => {
    const newErrors = {};
    if (!form.fullName.trim()) newErrors.fullName = "Name is required";
    // if (!form.referRank.trim()) newErrors.referRank = "Refer rank is required"
    if (!form.username.trim()) newErrors.username = "Username is required";
    if (form.credit < 0) newErrors.credit = "Credit cannot be negative";
    if (form.penalty < 0) newErrors.penalty = "Penalty cannot be negative";
    // if (!form.referCode.trim()) newErrors.referCode = "Referral code required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // save details
  const handleSaveDetails = async () => {
    if (!validate()) return;
    try {
      setLoading(true);
      const res = await axiosApiInstance.put(`/admin/users/${userDetail._id}`, form);
      console.log("profileres", res);
      console.log("Updated user:", res.data);
      if (res.data.status === 200) {
        toast.success(res.data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  // handle credit
  const handleAddCredit = async () => {
    if (!creditValue || isNaN(creditValue)) {
      alert("Please enter a valid credit value");
      return;
    }

    try {
      setLoading(true);
      const res = await dispatch(
        addcredits({ id: userDetail._id, data: { credit: Number(creditValue) } })
      ).unwrap(); // get actual payload

      console.log("addcreditsuccess", res);
      if (res.status === 200) {
        toast.success("credit add successfully");

      }
      setShowCreditModal(false);
      setCreditValue("");
      setForm((prev) => ({ ...prev, credit: res.data.credit }));
    } catch (err) {
      toast.error("something went wrong");

    } finally {
      setLoading(false);
    }
  };


  return createPortal(
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 transition-opacity"
        onClick={onClose}
      />

      {/* Slide-in Modal */}
      <div className="relative ml-auto w-full h-full max-w-6xl bg-white flex flex-col shadow-2xl animate-slideIn">
        {/* Header */}
        <div className="flex items-center bg-[var(--color-neutral)] justify-between px-8 py-5">
          <h2 className="text-2xl font-bold tracking-wide">👤 User Dashboard</h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 cursor-pointer hover:bg-white/20 transition"
          >
            <FiX size={26} />
          </button>
        </div>

        {/* Tabs */}
        <div className="sticky top-0 flex flex-wrap gap-3 px-6 py-3 border-b border-gray-300 bg-[var(--color-neutral)] shadow-sm z-10">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-2 md:px-4 py-2 rounded-full text-sm cursor-pointer font-medium transition-all shadow-sm ${activeTab === tab.key
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}

        <div className="flex-1 overflow-y-auto px-2 md:px-8 py-6 bg-[var(--color-neutral)]">
          {activeTab === "details" && (
            <div>
              {/* Add Credit Button */}
              <div className="flex justify-end items-center gap-2 mb-3">
                <button
                  onClick={() => setshowpasswordModal(true)}
                  className="bg-blue-500 text-white px-3 py-1 rounded-md cursor-pointer hover:bg-blue-600"
                >
                  <div className="flex items-center gap-1">
                   <TbLockPassword />
          Change Password
                  </div>

                </button>
                <button
                  onClick={() => setShowCreditModal(true)}
                  className="bg-blue-500 text-white px-3 py-1 rounded-md cursor-pointer hover:bg-blue-600"
                >
                  <div className="flex items-center gap-1">
                    <IoAddSharp />
                    Add Credit
                  </div>

                </button>
              </div>

              {/* Editable Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(form).map(([key, value]) => (
                  <div key={key} className="flex flex-col">
                    <label className="text-sm font-medium text-[var(--color-text)] mb-1 capitalize">
                      {key.replace(/([A-Z])/g, " $1")}
                    </label>

                    {/* Special cases handling */}
                    {key === "isActive" || key === "isBanned" ? (
                      <select
                        value={value}
                        onChange={(e) =>
                          setForm({ ...form, [key]: e.target.value === "true" })
                        }
                        className="px-3 py-2 rounded-md border border-gray-300"
                      >
                        <option value="true">True</option>
                        <option value="false">False</option>
                      </select>
                    ) : (
                      <input
                        type={
                          ["battlePlayed", "penalty", "referralEarning", "cashWon", "winningAmount", "credit", "completedGames"]
                            .includes(key)
                            ? "number"
                            : "text"
                        }
                        value={value}
                        disabled={key === "phone"} // phone not editable
                        onChange={(e) => {
                          const val = e.target.value;
  if (
      ["battlePlayed", "penalty", "referralEarning", "cashWon", "winningAmount", "credit", "completedGames", "referRank"]
        .includes(key)
    ) {
      if (val.length > 6) return; // ❌ Stop if length exceeds 5
    }
                          // ✅ Validation for Full Name (no numbers allowed)
                          if (key === "fullName") {
                            if (/[^a-zA-Z\s]/.test(val)) {
                              setErrors((prev) => ({
                                ...prev,
                                fullName: "name cannot contain numbers or special characters",
                              }));
                              return;
                            } else {
                              setErrors((prev) => ({ ...prev, fullName: "" }));
                            }
                          }

                          // ✅ Validation for numeric fields (no text allowed)
                          if (
                            ["battlePlayed", "penalty", "referralEarning", "cashWon", "winningAmount", "credit", "completedGames", "referRank"]
                              .includes(key)
                          ) {
                            if (/[^0-9]/.test(val)) {
                              setErrors((prev) => ({
                                ...prev,
                                [key]: "Only numbers are allowed",
                              }));
                              return;
                            } else {
                              setErrors((prev) => ({ ...prev, [key]: "" }));
                            }
                          }

                          setForm({ ...form, [key]: val });
                        }}
                        className={`px-3 py-2 rounded-md border ${errors[key] ? "border-red-500" : "border-gray-300"
                          }`}
                      />
                    )}

                    {errors[key] && (
                      <p className="text-xs text-red-500 mt-1">{errors[key]}</p>
                    )}
                  </div>
                ))}

              </div>

              {/* Save Button */}
              <div className="flex justify-end mt-6">
                <button
                  onClick={handleSaveDetails}
                  disabled={loading}
                  className="bg-blue-500 text-white px-6 py-2 cursor-pointer rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? "Saving..." : <div className="flex items-center gap-1"> <FaUserEdit />Edit details</div>}
                </button>
              </div>
            </div>
          )}

          {/* {activeTab !== "details" && (
            <div className="text-gray-700 text-lg">
              🚧 {activeTab} section coming soon...
            </div>
          )} */}
          {
            activeTab == "games" && (
              <div>
                <Table columnsDef={columns} fetchData={fetchUserGames} pending={gamestatus} filters={filters}
                  filtersUI={
                    <>


                      <select
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                        className="rounded-lg border px-2 py-1 text-sm"
                      >
                        <option value="">All Games</option>
                        <option value="pending">pending</option>
                        <option value="requested">requested</option>
                        <option value="started">started</option>
                        <option value="completed">completed</option>
                        <option value="cancelled">cancelled</option>
                        <option value="expired">expired</option>
                        <option value="quit">quit</option>


                      </select>


                    </>
                  } />
              </div>
            )
          }
          {/* {
            activeTab == "credits" && (
              <div>
                <Table columnsDef={columns} fetchData={fetchuserCredit} filters={filters}
                  filtersUI={
                    <>
                      <select
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                        className="rounded-lg border px-2 py-1 text-sm"
                      >
                        <option value="">All Games</option>
                        <option value="accepted">Accepted</option>
                        <option value="quit">quit</option>
                        <option value="lost">lost</option>
                        <option value="created">created</option>
                        <option value="played">played</option>

                      </select>


                    </>
                  } />
              </div>
            )
          } */}
          {
            activeTab == "transactions" && (
              <div>
                <Table columnsDef={transactionColumns} flag={1} fetchData={fetchTransaction} pending={transactionStatus} filters={filters}
                  filtersUI={
                    // <>
                    //   <select
                    //     value={filters.status}
                    //     onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    //     className="rounded-lg border px-2 py-1 text-sm"
                    //   >
                    //     <option value="">All Games</option>
                    //     <option value="accepted">Accepted</option>
                    //     <option value="quit">quit</option>
                    //     <option value="lost">lost</option>
                    //     <option value="created">created</option>
                    //     <option value="played">played</option>
                    //   </select>


                    // </>
                    ""
                  } />
              </div>
            )}
             {/* {
            activeTab == "referal" && (
              <div>
                <Table columnsDef={transactionColumns} flag={1} fetchData={fetchReferaldata} pending={transactionStatus} filters={filters}
                  filtersUI={
                    // <>
                    //   <select
                    //     value={filters.status}
                    //     onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    //     className="rounded-lg border px-2 py-1 text-sm"
                    //   >
                    //     <option value="">All Games</option>
                    //     <option value="accepted">Accepted</option>
                    //     <option value="quit">quit</option>
                    //     <option value="lost">lost</option>
                    //     <option value="created">created</option>
                    //     <option value="played">played</option>
                    //   </select>


                    // </>
                    ""
                  } />
              </div>
            )} */}
          {
            activeTab == "withdraw" && (
              <div>
                <Table columnsDef={withdrawColumns} reloadKey={reloadKey} flag={1} pending={withdrawStatus} fetchData={fetchWithdraw} filters={filters}
                  filtersUI={
                    <>
                      <select
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                        className="rounded-lg border px-2 py-1 text-sm"
                      >
                        <option value="">All Withdraws</option>
                        <option value="paid">Paid</option>
                        <option value="unpaid">Unpaid</option>
                        <option value="rejected">Rejected</option>


                      </select>


                    </>
                  } />
              </div>
            )
          }
        </div>
      </div>

      {/* Credit Modal */}
      {
        passwordModal && (
          <UpdatePasswordPage setshowpasswordModal={setshowpasswordModal} userId={userId}/>
        )
      }
      {showCreditModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-[100]">
          <div className="bg-[var(--color-neutral)] p-6 rounded-lg w-96 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">➕ Add Credit</h3>
          <input
  type="number"
  value={creditValue}
  onChange={(e) => {
    let val = e.target.value;

    // sirf digits allow + 5 digit se zyada cut
    if (/[^0-9]/.test(val)) return; 
    if (val.length > 6) val = val.slice(0, 6);

    setCreditValue(val);
  }}
  className="w-full border rounded-lg px-3 py-2 mb-4"
  placeholder="Enter credit amount"
/>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowCreditModal(false)}
                className="px-4 py-2 cursor-pointer rounded-md bg-[var(--button-color)]"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCredit}
                disabled={loading}
                className="px-4 py-2 cursor-pointer rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>,
    document.body
  );
}



//all done
