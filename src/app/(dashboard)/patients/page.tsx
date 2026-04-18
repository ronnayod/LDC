"use client";

import { useState } from "react";

// Mock patient data
const patientsMock = [
  { hn: "HN-0001", name: "สมชาย ใจดี", phone: "081-234-5678", gender: "ชาย", age: 35, group: "VIP", lastVisit: "12/04/2026" },
  { hn: "HN-0002", name: "สมหญิง รักสวย", phone: "082-345-6789", gender: "หญิง", age: 28, group: "ทั่วไป", lastVisit: "12/04/2026" },
  { hn: "HN-0003", name: "วิชัย สุขสันต์", phone: "083-456-7890", gender: "ชาย", age: 42, group: "ทั่วไป", lastVisit: "11/04/2026" },
  { hn: "HN-0004", name: "นภา ดวงจันทร์", phone: "084-567-8901", gender: "หญิง", age: 31, group: "VIP", lastVisit: "11/04/2026" },
  { hn: "HN-0005", name: "พิชัย กล้าหาญ", phone: "085-678-9012", gender: "ชาย", age: 55, group: "ทั่วไป", lastVisit: "10/04/2026" },
  { hn: "HN-0006", name: "สุดา แก้วมณี", phone: "086-789-0123", gender: "หญิง", age: 24, group: "นักเรียน", lastVisit: "10/04/2026" },
  { hn: "HN-0007", name: "ประเสริฐ ศรีสะอาด", phone: "087-890-1234", gender: "ชาย", age: 48, group: "VIP", lastVisit: "09/04/2026" },
  { hn: "HN-0008", name: "รัชนี ดอกไม้", phone: "088-901-2345", gender: "หญิง", age: 36, group: "ทั่วไป", lastVisit: "09/04/2026" },
  { hn: "HN-0009", name: "ชัยวัฒน์ มั่นคง", phone: "089-012-3456", gender: "ชาย", age: 62, group: "ผู้สูงอายุ", lastVisit: "08/04/2026" },
  { hn: "HN-0010", name: "กัลยา สวัสดี", phone: "080-123-4567", gender: "หญิง", age: 29, group: "ทั่วไป", lastVisit: "08/04/2026" },
  { hn: "HN-0011", name: "ธนาพร วงษ์สุวรรณ", phone: "091-234-5678", gender: "หญิง", age: 33, group: "VIP", lastVisit: "07/04/2026" },
  { hn: "HN-0012", name: "วีระ พลายงาม", phone: "092-345-6789", gender: "ชาย", age: 45, group: "ทั่วไป", lastVisit: "07/04/2026" },
];

const tabs = ["รายชื่อ", "ประวัติ", "มัดจำ"];
const genders = ["ทั้งหมด", "ชาย", "หญิง"];
const groups = ["ทั้งหมด", "VIP", "ทั่วไป", "นักเรียน", "ผู้สูงอายุ"];

export default function PatientsPage() {
  const [activeTab, setActiveTab] = useState("รายชื่อ");
  const [search, setSearch] = useState("");
  const [genderFilter, setGenderFilter] = useState("ทั้งหมด");
  const [groupFilter, setGroupFilter] = useState("ทั้งหมด");
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 8;

  const filtered = patientsMock.filter((p) => {
    const matchSearch =
      p.hn.toLowerCase().includes(search.toLowerCase()) ||
      p.name.includes(search) ||
      p.phone.includes(search);
    const matchGender = genderFilter === "ทั้งหมด" || p.gender === genderFilter;
    const matchGroup = groupFilter === "ทั้งหมด" || p.group === groupFilter;
    return matchSearch && matchGender && matchGroup;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const groupBadge: Record<string, string> = {
    VIP: "bg-amber-100 text-amber-700",
    "ทั่วไป": "bg-blue-100 text-blue-700",
    "นักเรียน": "bg-green-100 text-green-700",
    "ผู้สูงอายุ": "bg-purple-100 text-purple-700",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between animate-fade-in">
        <div>
          <h2 className="text-2xl font-bold text-[#1E293B]">คนไข้</h2>
          <p className="text-sm text-[#64748B] mt-0.5">จัดการข้อมูลคนไข้ทั้งหมด</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00C6FF] to-[#0072FF] text-white font-semibold text-sm shadow-lg shadow-[#0072FF]/20 hover:shadow-xl hover:brightness-110 active:scale-[0.98] transition-all duration-200">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          เพิ่มคนไข้ใหม่
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white rounded-xl p-1 shadow-sm border border-[#E2E8F0] w-fit animate-fade-in">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === tab
                ? "bg-gradient-to-r from-[#00C6FF] to-[#0072FF] text-white shadow-sm"
                : "text-[#64748B] hover:text-[#1E293B] hover:bg-[#F1F5F9]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 animate-fade-in">
        {/* Search */}
        <div className="relative flex-1 min-w-[280px] max-w-md">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            placeholder="ค้นหาด้วย HN, ชื่อ, เบอร์โทร..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#E2E8F0] text-sm text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#00C6FF]/30 focus:border-[#00C6FF] transition-all"
          />
        </div>

        {/* Gender filter */}
        <select
          value={genderFilter}
          onChange={(e) => { setGenderFilter(e.target.value); setCurrentPage(1); }}
          className="px-4 py-2.5 rounded-xl bg-white border border-[#E2E8F0] text-sm text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#00C6FF]/30 cursor-pointer"
        >
          {genders.map((g) => (
            <option key={g} value={g}>เพศ: {g}</option>
          ))}
        </select>

        {/* Group filter */}
        <select
          value={groupFilter}
          onChange={(e) => { setGroupFilter(e.target.value); setCurrentPage(1); }}
          className="px-4 py-2.5 rounded-xl bg-white border border-[#E2E8F0] text-sm text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#00C6FF]/30 cursor-pointer"
        >
          {groups.map((g) => (
            <option key={g} value={g}>กลุ่ม: {g}</option>
          ))}
        </select>

        <span className="text-sm text-[#64748B] ml-2">
          พบ <span className="font-semibold text-[#1E293B]">{filtered.length}</span> รายการ
        </span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#E2E8F0] overflow-hidden animate-fade-in">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#1E3A5F]">
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-white uppercase tracking-wider">HN</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-white uppercase tracking-wider">ชื่อ-สกุล</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-white uppercase tracking-wider">เบอร์โทร</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-white uppercase tracking-wider">เพศ</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-white uppercase tracking-wider">อายุ</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-white uppercase tracking-wider">กลุ่ม</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-white uppercase tracking-wider">เข้ารับบริการล่าสุด</th>
                <th className="text-center px-6 py-3.5 text-xs font-semibold text-white uppercase tracking-wider">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {paginated.map((p, i) => (
                <tr key={p.hn} className={`${i % 2 === 1 ? "bg-[#F8FAFC]" : "bg-white"} hover:bg-[#E0EAFF]/30 transition-colors`}>
                  <td className="px-6 py-3.5 text-sm font-mono font-medium text-[#2B5998]">{p.hn}</td>
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00C6FF]/20 to-[#0072FF]/20 flex items-center justify-center text-[#0072FF] text-xs font-bold flex-shrink-0">
                        {p.name.charAt(0)}
                      </div>
                      <span className="text-sm font-medium text-[#1E293B]">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3.5 text-sm text-[#475569]">{p.phone}</td>
                  <td className="px-6 py-3.5 text-sm text-[#475569]">{p.gender}</td>
                  <td className="px-6 py-3.5 text-sm text-[#475569]">{p.age} ปี</td>
                  <td className="px-6 py-3.5">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${groupBadge[p.group] || "bg-gray-100 text-gray-600"}`}>
                      {p.group}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-sm text-[#64748B]">{p.lastVisit}</td>
                  <td className="px-6 py-3.5">
                    <div className="flex items-center justify-center gap-1">
                      <button className="p-2 rounded-lg hover:bg-[#E0EAFF] transition-colors group" title="ดูข้อมูล">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#64748B] group-hover:text-[#0072FF]">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      </button>
                      <button className="p-2 rounded-lg hover:bg-[#E0EAFF] transition-colors group" title="แก้ไข">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#64748B] group-hover:text-[#0072FF]">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                      <button className="p-2 rounded-lg hover:bg-red-50 transition-colors group" title="ลบ">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#64748B] group-hover:text-red-500">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-[#E2E8F0]">
            <p className="text-sm text-[#64748B]">
              หน้า {currentPage} จาก {totalPages}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-[#64748B] hover:bg-[#F1F5F9] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                ← ก่อนหน้า
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition-all duration-200 ${
                    page === currentPage
                      ? "bg-gradient-to-r from-[#00C6FF] to-[#0072FF] text-white shadow-sm"
                      : "text-[#64748B] hover:bg-[#F1F5F9]"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-[#64748B] hover:bg-[#F1F5F9] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                ถัดไป →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
