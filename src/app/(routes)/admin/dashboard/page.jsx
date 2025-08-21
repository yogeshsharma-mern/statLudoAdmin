// "use client"
import { cookies } from "next/headers";
import React from 'react';
import AdminDashboard from '@/components/AdminDashboard';



export default function page() {
  const cookieStore = cookies();
 console.log("admintoken",cookieStore.get("adminToken")?.value);
  return (
    <div>

        <AdminDashboard/>
    </div>
  )
}
