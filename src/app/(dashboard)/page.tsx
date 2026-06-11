"use client";

import SalesLineChart from "@/components/SalesLineChart";

export default function DashboardPage() {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page header */}
      <div className="animate-fade-in">
        <h2 className="text-xl sm:text-2xl font-bold text-[#1E293B]">แดชบอร์ด</h2>
        <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">ภาพรวมข้อมูลคลินิก</p>
      </div>

      {/* ═══ Sales Line Chart ═══ */}
      <SalesLineChart />
    </div>
  );
}
