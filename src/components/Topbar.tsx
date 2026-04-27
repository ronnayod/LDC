"use client";

import { useState, useEffect } from "react";

interface TopbarProps {
  onMenuToggle: () => void;
}

export default function Topbar({ onMenuToggle }: TopbarProps) {
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
    <header className="sticky top-0 z-30 h-14 sm:h-16 bg-white/80 backdrop-blur-lg border-b border-[#E2E8F0] flex items-center justify-between px-4 sm:px-6 gap-3 sm:gap-4">
      {/* Left: Hamburger + Date */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {/* Hamburger — mobile only */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 -ml-1 rounded-xl hover:bg-[#F1F5F9] transition-colors flex-shrink-0"
          aria-label="เปิดเมนู"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        <p className="text-sm text-[#64748B] hidden md:block whitespace-nowrap truncate">{dateStr}</p>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Divider */}
        <div className="w-px h-8 bg-[#FFFFFF] mx-1 hidden sm:block" />

        {/* User info */}
        <div className="flex items-center gap-2 sm:gap-3 cursor-pointer rounded-xl hover:bg-[#F1F5F9] px-1.5 sm:px-2 py-1.5 transition-colors">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-[#00C6FF] to-[#0072FF] flex items-center justify-center text-white font-semibold text-xs flex-shrink-0">
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
