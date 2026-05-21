"use client";

import { useState, useEffect, useRef } from "react";

interface TopbarProps {
  onMenuToggle: () => void;
}

export default function Topbar({ onMenuToggle }: TopbarProps) {
  const [dateStr, setDateStr] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  const handleLogout = () => {
    setDropdownOpen(false);
    // TODO: implement actual logout logic (e.g. clear session, redirect to login)
    window.location.href = "/login";
  };

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

        {/* User info + Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(prev => !prev)}
            className="flex items-center gap-2 sm:gap-3 cursor-pointer rounded-xl hover:bg-[#F1F5F9] px-1.5 sm:px-2 py-1.5 transition-colors"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-[#00C6FF] to-[#0072FF] flex items-center justify-center text-white font-semibold text-xs flex-shrink-0">
              SC
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-[#1E293B] leading-tight">Suchart K.</p>
              <p className="text-xs text-[#94A3B8]">Admin</p>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              className={`text-[#94A3B8] hidden sm:block transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}>
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-[#E2E8F0] py-1.5 z-50 animate-fade-in"
              style={{ animation: "dropdown-in 0.15s ease-out" }}>

              {/* Logout */}
              <div className="py-1.5">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  ออกจากระบบ
                </button>
              </div>

              <style>{`
                @keyframes dropdown-in {
                  from { opacity: 0; transform: translateY(-8px) scale(0.96); }
                  to { opacity: 1; transform: translateY(0) scale(1); }
                }
              `}</style>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

