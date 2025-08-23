"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FiX } from "react-icons/fi";
import { axiosApiInstance } from "@/library/helper";
import {addcredits} from "@/redux/features/userSlice";
import { useDispatch } from "react-redux";
import {fetchuserGameData} from "@/redux/features/userGameSlice";
import Table from "@/components/Table";
import toast from "react-hot-toast";
import { useMemo } from "react";


export default function Modal({ open, onClose, userDetail }) {
  const [activeTab, setActiveTab] = useState("details");
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [creditValue, setCreditValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
const dispatch = useDispatch();
  const tabs = [
    { key: "details", label: "Details" },
    { key: "games", label: "Games" },
    { key: "credits", label: "Credits" },
    { key: "withdraw", label: "Withdraw" },
    { key: "referral", label: "Referral" },
    { key: "transactions", label: "Transactions" },
  ];
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
const fetchUserGames = (params = {}) => {
  return fetchuserGameData({ id: userDetail._id, ...params });
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
        referCode: userDetail.referCode || "",
        referRank: userDetail.referRank || "",
        referralEarning: userDetail.referralEarning || 0,
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
    if (!form.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!form.username.trim()) newErrors.username = "Username is required";
    if (form.credit < 0) newErrors.credit = "Credit cannot be negative";
    if (form.penalty < 0) newErrors.penalty = "Penalty cannot be negative";
    if (!form.referCode.trim()) newErrors.referCode = "Referral code required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // save details
  const handleSaveDetails = async () => {
    if (!validate()) return;
    try {
      setLoading(true);
      const res = await axiosApiInstance.put(`/users/${userDetail._id}`, form);
    console.log("profileres",res);
      console.log("Updated user:", res.data);
      if(res.data.status===200)
      {
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
    if(res.status===200)
    {
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
            className="rounded-full p-2 hover:bg-white/20 transition"
          >
            <FiX size={26} />
          </button>
        </div>

        {/* Tabs */}
        <div className="sticky top-0 flex flex-wrap gap-3 px-6 py-3 border-b border-gray-300 bg-white shadow-sm z-10">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all shadow-sm ${
                activeTab === tab.key
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-8 py-6 bg-gray-50">
          {activeTab === "details" && (
            <div>
              {/* Add Credit Button */}
              <div className="flex justify-end items-center mb-3">
                <button
                  onClick={() => setShowCreditModal(true)}
                  className="bg-blue-500 text-white px-3 py-1 rounded-md cursor-pointer hover:bg-blue-600"
                >
                  ➕ Add Credit
                </button>
              </div>

              {/* Editable Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(form).map(([key, value]) => (
                  <div key={key} className="flex flex-col">
                    <label className="text-sm font-medium text-gray-600 mb-1 capitalize">
                      {key.replace(/([A-Z])/g, " $1")}
                    </label>
                    <input
                      type={
                        typeof value === "number" ? "number" : "text"
                      }
                      value={value}
                      disabled={key === "phone"} // phone not editable
                      onChange={(e) =>
                        setForm({ ...form, [key]: e.target.value })
                      }
                      className={`px-3 py-2 rounded-md border ${
                        errors[key]
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {errors[key] && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors[key]}
                      </p>
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
                  {loading ? "Saving..." : "Edit Details"}
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
            activeTab =="games" &&(
              <div>
         <Table columnsDef={columns} fetchData={fetchUserGames}/>
              </div>
            )
          }
        </div>
      </div>

      {/* Credit Modal */}
      {showCreditModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-[100]">
          <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">➕ Add Credit</h3>
            <input
              type="number"
              value={creditValue}
              onChange={(e) => setCreditValue(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 mb-4"
              placeholder="Enter credit amount"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowCreditModal(false)}
                className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCredit}
                disabled={loading}
                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
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
