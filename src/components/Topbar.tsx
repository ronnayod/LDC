"use client";

import { useState, useEffect } from "react";

export default function Topbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [dateStr, setDateStr] = useState("");

  useEffect(() => {
    const today = new Date();
    setDateStr(
      today.toLocaleDateString("th-TH", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    );
  }, []);

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/80 backdrop-blur-lg border-b border-[#E2E8F0] flex items-center justify-between px-6 gap-4">
      {/* Left: Date + Search */}
      <div className="flex items-center gap-4 flex-1">
        <p className="text-sm text-[#64748B] hidden lg:block whitespace-nowrap">{dateStr}</p>
        {/* <div className="relative max-w-md w-full">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ค้นหา..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#F1F5F9] border border-transparent text-sm text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#00C6FF]/30 focus:bg-white focus:border-[#E2E8F0] transition-all duration-200"
          />
        </div> */}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Divider */}
        <div className="w-px h-8 bg-[#FFFFFF] mx-1" />

        {/* User info */}
        <div className="flex items-center gap-3 cursor-pointer rounded-xl hover:bg-[#F1F5F9] px-2 py-1.5 transition-colors">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#00C6FF] to-[#0072FF] flex items-center justify-center text-white font-semibold text-xs">
            SC
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-[#1E293B] leading-tight">Suchart K.</p>
            <p className="text-xs text-[#94A3B8]">Admin</p>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#94A3B8] hidden sm:block">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>
    </header>
  );
}
