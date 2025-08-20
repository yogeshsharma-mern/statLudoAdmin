"use client";
import React from 'react';
import UserFormModal from '@/components/UserFormModel';
import { useState } from 'react';
import UsersTable from '@/components/UsersTable';

const seed = [
  { id: "1", name: "Aarav Sharma",    email: "aarav@site.com",  role: "Player",  status: "Active" },
  { id: "2", name: "Meera Patel",     email: "meera@site.com",  role: "Cashier", status: "Active" },
  { id: "3", name: "Rohit Verma",     email: "rohit@site.com",  role: "Player",  status: "Pending" },
  { id: "4", name: "Admin Kumar",     email: "admin@site.com",  role: "Admin",   status: "Active" },
  { id: "5", name: "Sneha Kapoor",    email: "sneha@site.com",  role: "Player",  status: "Blocked" },
    { id: "1", name: "Aarav Sharma",    email: "aarav@site.com",  role: "Player",  status: "Active" },
  { id: "2", name: "Meera Patel",     email: "meera@site.com",  role: "Cashier", status: "Active" },
  { id: "3", name: "Rohit Verma",     email: "rohit@site.com",  role: "Player",  status: "Pending" },
  { id: "4", name: "Admin Kumar",     email: "admin@site.com",  role: "Admin",   status: "Active" },
  { id: "5", name: "Sneha Kapoor",    email: "sneha@site.com",  role: "Player",  status: "Blocked" },
];
export default function page() {
    const [open, setOpen] = useState(false);
  return (
   <div className="flex min-h-screen bg-gray-900 text-gray-200">
   

   {open && <UserFormModal open={true} onClose={() => setOpen(false)} />}
    <UsersTable initialUsers={seed} />
    </div>
  )
}
