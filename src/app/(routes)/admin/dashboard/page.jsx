// // "use client"
// import { cookies } from "next/headers";
// import React from 'react';
// import AdminDashboard from '@/components/AdminDashboard';



// export default function page() {
//   const cookieStore = cookies();
//  console.log("admintoken",cookieStore.get("adminToken")?.value);
//   return (
//     <div>
//         {/* <AdminDashboard/> */}

//     </div>
//   )
// }

"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

// ApexCharts client-side only load
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function DashboardCharts() {
  const [userOptions] = useState({
    chart: {
      type: "area",
      toolbar: { show: false },
    },
    stroke: { curve: "smooth", width: 3 },
    colors: ["#3B82F6"],
    dataLabels: { enabled: false },
    xaxis: {
      categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0,
      },
    },
    tooltip: { theme: "light" },
  });

  const [revenueOptions] = useState({
    chart: {
      type: "bar",
      toolbar: { show: false },
    },
    colors: ["#10B981"],
    plotOptions: {
      bar: {
        borderRadius: 8,
        columnWidth: "40%",
      },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    },
    tooltip: { theme: "light" },
  });

  const userSeries = [{ name: "Active Users", data: [120, 150, 180, 200, 250, 300, 270] }];
  const revenueSeries = [{ name: "Revenue", data: [1200, 1800, 2400, 2000, 3000, 2800] }];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      {/* Active Users */}
      <div className="bg-(--color-neutral) rounded-2xl shadow p-4">
        <h2 className="text-lg font-semibold mb-4">📊 Active Users</h2>
        <Chart options={userOptions} series={userSeries} type="area" height={280} />
      </div>

      {/* Revenue Snapshot */}
      <div className="bg-(--color-neutral) rounded-2xl shadow p-4">
        <h2 className="text-lg font-semibold mb-4">💰 Revenue Snapshot</h2>
        <Chart options={revenueOptions} series={revenueSeries} type="bar" height={280} />
      </div>
    </div>
  );
}



// export async function GET() {
//   // TODO: yahan aap DB se real data laa sakte ho
//   const data = {
//     categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
//     values:     [500,   700,   900,   1200,  1500,  2000],
//   };
//   return Response.json(data);
// }