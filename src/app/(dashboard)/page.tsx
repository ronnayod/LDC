"use client";

import { useState } from "react";
import StatCard from "@/components/StatCard";
import BarChart from "@/components/BarChart";

// ─── Types ─────────────────────────────────────────────
type SalesFilter = "daily" | "monthly" | "yearly";

interface SalesData {
  label: string;
  totalSales: number;
  totalTransactions: number;
  avgPerTransaction: number;
  change: number;
  breakdown: { label: string; value: number; color: string }[];
}

// ─── Mock Sales Data ───────────────────────────────────
const salesDataMap: Record<SalesFilter, SalesData> = {
  daily: {
    label: "วันนี้",
    totalSales: 28750,
    totalTransactions: 12,
    avgPerTransaction: 2396,
    change: 8.3,
    breakdown: [
      { label: "รักษารากฟัน", value: 7000, color: "linear-gradient(90deg, #8B5CF6, #6D28D9)" },
      { label: "ขูดหินปูน", value: 6000, color: "linear-gradient(90deg, #22C55E, #16A34A)" },
      { label: "จัดฟัน", value: 5500, color: "linear-gradient(90deg, #00C6FF, #0072FF)" },
      { label: "อุดฟัน", value: 4800, color: "linear-gradient(90deg, #F59E0B, #D97706)" },
      { label: "ถอนฟัน", value: 3200, color: "linear-gradient(90deg, #EF4444, #DC2626)" },
      { label: "สินค้า", value: 2250, color: "linear-gradient(90deg, #EC4899, #DB2777)" },
    ],
  },
  monthly: {
    label: "เดือนนี้",
    totalSales: 1245800,
    totalTransactions: 347,
    avgPerTransaction: 3590,
    change: 15.8,
    breakdown: [
      { label: "จัดฟัน", value: 385000, color: "linear-gradient(90deg, #00C6FF, #0072FF)" },
      { label: "รักษารากฟัน", value: 280000, color: "linear-gradient(90deg, #8B5CF6, #6D28D9)" },
      { label: "ขูดหินปูน", value: 210000, color: "linear-gradient(90deg, #22C55E, #16A34A)" },
      { label: "อุดฟัน", value: 168000, color: "linear-gradient(90deg, #F59E0B, #D97706)" },
      { label: "ฟอกสีฟัน", value: 112000, color: "linear-gradient(90deg, #EF4444, #DC2626)" },
      { label: "สินค้า", value: 90800, color: "linear-gradient(90deg, #EC4899, #DB2777)" },
    ],
  },
  yearly: {
    label: "ปีนี้",
    totalSales: 14520000,
    totalTransactions: 4128,
    avgPerTransaction: 3517,
    change: 22.4,
    breakdown: [
      { label: "จัดฟัน", value: 4850000, color: "linear-gradient(90deg, #00C6FF, #0072FF)" },
      { label: "รักษารากฟัน", value: 3200000, color: "linear-gradient(90deg, #8B5CF6, #6D28D9)" },
      { label: "ขูดหินปูน", value: 2450000, color: "linear-gradient(90deg, #22C55E, #16A34A)" },
      { label: "อุดฟัน", value: 1800000, color: "linear-gradient(90deg, #F59E0B, #D97706)" },
      { label: "ฟอกสีฟัน", value: 1250000, color: "linear-gradient(90deg, #EF4444, #DC2626)" },
      { label: "สินค้า", value: 970000, color: "linear-gradient(90deg, #EC4899, #DB2777)" },
    ],
  },
};

// ─── Mock Data ─────────────────────────────────────────
const recentPatients = [
  { hn: "HN-0041", name: "สมชาย ใจดี", treatment: "จัดฟัน", status: "กำลังรักษา", date: "12/04/2026", amount: "45,000" },
  { hn: "HN-0042", name: "สมหญิง รักสวย", treatment: "ขูดหินปูน", status: "เสร็จสิ้น", date: "12/04/2026", amount: "1,500" },
  { hn: "HN-0043", name: "วิชัย สุขสันต์", treatment: "รักษาราก", status: "นัดครั้งถัดไป", date: "11/04/2026", amount: "8,000" },
  { hn: "HN-0044", name: "นภา ดวงจันทร์", treatment: "ฟันปลอม", status: "กำลังรักษา", date: "11/04/2026", amount: "25,000" },
  { hn: "HN-0045", name: "พิชัย กล้าหาญ", treatment: "อุดฟัน", status: "เสร็จสิ้น", date: "10/04/2026", amount: "2,000" },
  { hn: "HN-0046", name: "สุดา แก้วมณี", treatment: "ถอนฟัน", status: "เสร็จสิ้น", date: "10/04/2026", amount: "1,500" },
];

const treatmentChartData = [
  { label: "จัดฟัน", value: 245, color: "linear-gradient(90deg, #00C6FF, #0072FF)" },
  { label: "ขูดหินปูน", value: 180, color: "linear-gradient(90deg, #22C55E, #16A34A)" },
  { label: "รักษาราก", value: 132, color: "linear-gradient(90deg, #F59E0B, #D97706)" },
  { label: "ฟันปลอม", value: 98, color: "linear-gradient(90deg, #8B5CF6, #6D28D9)" },
  { label: "อุดฟัน", value: 210, color: "linear-gradient(90deg, #EF4444, #DC2626)" },
  { label: "ถอนฟัน", value: 75, color: "linear-gradient(90deg, #EC4899, #DB2777)" },
];

const upcomingAppointments = [
  { time: "09:00", patient: "คุณสมชาย ใจดี", treatment: "จัดฟัน — ปรับเครื่องมือ", dentist: "ทพ.วิชัย" },
  { time: "10:30", patient: "คุณนภา ดวงจันทร์", treatment: "ฟันปลอม — ลองเฟรม", dentist: "ทพญ.สุดา" },
  { time: "13:00", patient: "คุณพิชัย กล้าหาญ", treatment: "ขูดหินปูน", dentist: "ทพ.วิชัย" },
  { time: "14:30", patient: "คุณสมหญิง รักสวย", treatment: "รักษาราก — นัดที่ 2", dentist: "ทพญ.สุดา" },
];

const statusColor: Record<string, string> = {
  "กำลังรักษา": "bg-blue-100 text-blue-700",
  "เสร็จสิ้น": "bg-green-100 text-green-700",
  "นัดครั้งถัดไป": "bg-amber-100 text-amber-700",
};

// ─── Helpers ───────────────────────────────────────────
const fmt = (n: number) => new Intl.NumberFormat("th-TH").format(n);
const fmtCurrency = (n: number) => {
  if (n >= 1_000_000) return `฿${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `฿${(n / 1_000).toFixed(0)}K`;
  return `฿${fmt(n)}`;
};

const FILTER_LABELS: Record<SalesFilter, string> = {
  daily: "รายวัน",
  monthly: "รายเดือน",
  yearly: "รายปี",
};

// ─── Total Patients Mock ───────────────────────────────
const TOTAL_PATIENTS = 1247;
const NEW_PATIENTS_THIS_MONTH = 128;
const RETURNING_PATIENTS_THIS_MONTH = 347;

export default function DashboardPage() {
  const [salesFilter, setSalesFilter] = useState<SalesFilter>("monthly");
  const currentSales = salesDataMap[salesFilter];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page header */}
      <div className="animate-fade-in">
        <h2 className="text-xl sm:text-2xl font-bold text-[#1E293B]">แดชบอร์ด</h2>
        <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">ภาพรวมข้อมูลคลินิก</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-5">
        {/* ── Total Patients ── */}
        <div className="animate-fade-in stagger-1">
          <StatCard
            title="คนไข้ทั้งหมด"
            value={fmt(TOTAL_PATIENTS)}
            change={12.5}
            color="purple"
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            }
          />
        </div>

        {/* ── New Patients ── */}
        <div className="animate-fade-in stagger-2">
          <StatCard
            title="คนไข้ใหม่ (เดือนนี้)"
            value={fmt(NEW_PATIENTS_THIS_MONTH)}
            change={12.5}
            color="cyan"
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="8.5" cy="7" r="4" />
                <line x1="20" y1="8" x2="20" y2="14" />
                <line x1="23" y1="11" x2="17" y2="11" />
              </svg>
            }
          />
        </div>

        {/* ── Returning Patients ── */}
        <div className="animate-fade-in stagger-3">
          <StatCard
            title="คนไข้เก่า (เดือนนี้)"
            value={fmt(RETURNING_PATIENTS_THIS_MONTH)}
            change={8.2}
            color="blue"
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            }
          />
        </div>

        {/* ── Today Appointments ── */}
        <div className="animate-fade-in stagger-4">
          <StatCard
            title="นัดหมายวันนี้"
            value="24"
            change={-3.1}
            color="amber"
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            }
          />
        </div>
      </div>

      {/* ═══ Sales Summary Card with Filter ═══ */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-[#E2E8F0] animate-fade-in stagger-5">
        {/* Header with filter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-[#1E293B]">สรุปยอดขาย</h3>
            <p className="text-xs text-[#94A3B8] mt-0.5">ข้อมูลยอดขาย{currentSales.label}</p>
          </div>
          <div className="flex bg-[#F1F5F9] rounded-xl p-1 gap-0.5">
            {(Object.keys(FILTER_LABELS) as SalesFilter[]).map((key) => (
              <button
                key={key}
                onClick={() => setSalesFilter(key)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                  salesFilter === key
                    ? "bg-[#1E40AF] text-white shadow-md"
                    : "text-[#64748B] hover:text-[#1E293B] hover:bg-white/60"
                }`}
              >
                {FILTER_LABELS[key]}
              </button>
            ))}
          </div>
        </div>

        {/* Sales Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
          {/* Total Sales */}
          <div className="bg-gradient-to-br from-[#1E40AF] to-[#1E3A5F] rounded-xl p-4 sm:p-5 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-8 -mt-8" />
            <p className="text-xs sm:text-sm text-white/70 mb-1">ยอดขายรวม</p>
            <p className="text-xl sm:text-2xl font-bold tracking-tight">{fmtCurrency(currentSales.totalSales)}</p>
            <div className="mt-2 flex items-center gap-1">
              <span className={`text-xs font-semibold flex items-center gap-0.5 ${currentSales.change >= 0 ? "text-green-300" : "text-red-300"}`}>
                {currentSales.change >= 0 ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="18 15 12 9 6 15" /></svg>
                ) : (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg>
                )}
                {Math.abs(currentSales.change)}%
              </span>
              <span className="text-xs text-white/50">จากช่วงก่อน</span>
            </div>
          </div>

          {/* Total Transactions */}
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 sm:p-5">
            <p className="text-xs sm:text-sm text-[#94A3B8] mb-1">จำนวนรายการ</p>
            <p className="text-xl sm:text-2xl font-bold text-[#1E293B]">{fmt(currentSales.totalTransactions)}</p>
            <p className="text-xs text-[#94A3B8] mt-2">รายการ{currentSales.label}</p>
          </div>

          {/* Average */}
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 sm:p-5">
            <p className="text-xs sm:text-sm text-[#94A3B8] mb-1">เฉลี่ย/รายการ</p>
            <p className="text-xl sm:text-2xl font-bold text-[#1E293B]">฿{fmt(currentSales.avgPerTransaction)}</p>
            <p className="text-xs text-[#94A3B8] mt-2">บาท/รายการ</p>
          </div>
        </div>

        {/* Sales Breakdown Chart */}
        <div>
          <h4 className="text-sm font-semibold text-[#1E293B] mb-4">สัดส่วนรายได้ ({currentSales.label})</h4>
          <div className="space-y-3">
            {currentSales.breakdown.map((item, i) => {
              const maxVal = Math.max(...currentSales.breakdown.map((d) => d.value));
              const pct = (item.value / maxVal) * 100;
              return (
                <div key={i} className="group">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-[#475569]">{item.label}</span>
                    <span className="text-sm font-bold text-[#1E293B]">฿{fmt(item.value)}</span>
                  </div>
                  <div className="w-full h-3 bg-[#F1F5F9] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000 ease-out group-hover:brightness-110"
                      style={{
                        width: `${pct}%`,
                        background: item.color,
                        animation: `slideInFromLeft 1s ease-out ${i * 0.15}s both`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Charts + Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 animate-fade-in stagger-6">
        {/* Treatment Chart */}
        <BarChart title="สรุปการรักษา (เดือนนี้)" data={treatmentChartData} />

        {/* Upcoming Appointments */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-[#E2E8F0]">
          <div className="flex items-center justify-between mb-4 sm:mb-5">
            <h3 className="text-base sm:text-lg font-semibold text-[#1E293B]">นัดหมายวันนี้</h3>
            <span className="text-xs font-semibold px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-[#E0EAFF] text-[#2B5998]">
              {upcomingAppointments.length} รายการ
            </span>
          </div>
          <div className="space-y-3">
            {upcomingAppointments.map((apt, i) => (
              <div key={i} className="flex items-center gap-4 p-3.5 rounded-xl bg-[#F8FAFC] hover:bg-[#F1F5F9] transition-colors group">
                <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-[#00C6FF]/10 to-[#0072FF]/10 flex flex-col items-center justify-center">
                  <span className="text-xs font-bold text-[#0072FF]">{apt.time}</span>
                  <span className="text-[10px] text-[#64748B]">น.</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#1E293B] truncate">{apt.patient}</p>
                  <p className="text-xs text-[#64748B] truncate">{apt.treatment}</p>
                </div>
                <div className="flex-shrink-0 text-right">
                  <span className="text-xs font-medium text-[#2B5998] bg-[#E0EAFF] px-2.5 py-1 rounded-full">{apt.dentist}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Patients Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#E2E8F0] overflow-hidden animate-fade-in stagger-6">
        <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-[#E2E8F0]">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-semibold text-[#1E293B]">คนไข้ล่าสุด</h3>
            {/* <button className="text-xs sm:text-sm font-medium text-[#0072FF] hover:text-[#00C6FF] transition-colors">
              ดูทั้งหมด →
            </button> */}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#1E3A5F]">
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-white uppercase tracking-wider">HN</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-white uppercase tracking-wider">ชื่อ-สกุล</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-white uppercase tracking-wider">การรักษา</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-white uppercase tracking-wider">สถานะ</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-white uppercase tracking-wider">วันที่</th>
                <th className="text-right px-6 py-3.5 text-xs font-semibold text-white uppercase tracking-wider">จำนวนเงิน</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {recentPatients.map((p, i) => (
                <tr key={i} className={`${i % 2 === 1 ? "bg-[#F8FAFC]" : "bg-white"} hover:bg-[#E0EAFF]/30 transition-colors`}>
                  <td className="px-6 py-3.5 text-sm font-mono font-medium text-[#2B5998]">{p.hn}</td>
                  <td className="px-6 py-3.5 text-sm font-medium text-[#1E293B]">{p.name}</td>
                  <td className="px-6 py-3.5 text-sm text-[#475569]">{p.treatment}</td>
                  <td className="px-6 py-3.5">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColor[p.status] || "bg-gray-100 text-gray-600"}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-sm text-[#64748B]">{p.date}</td>
                  <td className="px-6 py-3.5 text-sm font-semibold text-[#1E293B] text-right">฿{p.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
