"use client";
import React, { useEffect, useState } from "react";
import UserFormModal from "@/components/UserFormModel";
import UsersTable from "@/components/UsersTable";
import Cookies from "js-cookie";
import { getUsersData } from "@/library/apicall";
import { fetchUsers } from "@/redux/features/userSlice";
import { useDispatch } from "react-redux";

export default function Page() {
  const dispatcher = useDispatch();
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState([]);
  console.log("users",users)
  const token = Cookies.get("adminToken");

useEffect(() => {
  const loadUsers = async () => {
    try {
      const usersJson = await dispatcher(fetchUsers()).unwrap(); // ✅ unwrap gets actual data
      console.log("userJson", usersJson.users);
      setUsers(usersJson.users); // now usersJson is the actual users array
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  loadUsers();
}, [dispatcher]);

  return (
    <div className="flex min-h-screen bg-gray-900 text-gray-200">
      {open && <UserFormModal open={true} onClose={() => setOpen(false)} />}
      <UsersTable initialUsers={users} />
    </div>
  );
}
