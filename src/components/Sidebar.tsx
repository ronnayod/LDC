"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  {
    label: "แดชบอร์ด",
    href: "/",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    label: "จัดการรักษา",
    href: "/treatments",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
  },
  {
    label: "คนไข้",
    href: "/patients",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    label: "ตารางนัดหมาย",
    href: "/appointments",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    label: "จัดการนัดหมาย",
    href: "/appointment-management",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
        <path d="M9 16l2 2 4-4" />
      </svg>
    ),
  },
  {
    label: "ขายสินค้า",
    href: "/sales",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
    ),
  },
  {
    label: "ตารางลงตรวจ",
    href: "/dentist-schedule",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed top-0 left-0 z-40 h-screen w-[260px] bg-[#0E1726] flex flex-col">
      {/* Logo */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00C6FF] to-[#0072FF] flex items-center justify-center flex-shrink-0">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C10.5 2 9.2 2.7 8.5 3.8C7.5 3.3 6.3 3.5 5.5 4.3C4.7 5.1 4.5 6.3 5 7.3C3.9 8 3 9.3 3 10.8C3 12.3 3.9 13.6 5.2 14.3L7 22H10L11 16H13L14 22H17L18.8 14.3C20.1 13.6 21 12.3 21 10.8C21 9.3 20.1 8 19 7.3C19.5 6.3 19.3 5.1 18.5 4.3C17.7 3.5 16.5 3.3 15.5 3.8C14.8 2.7 13.5 2 12 2Z" fill="white" />
            </svg>
          </div>
          <div>
            <h1 className="text-white font-bold text-lg leading-tight">Lunithic Mockup</h1>
            <p className="text-[#64748B] text-xs">Management System</p>
          </div>
        </div>
      </div>

      {/* Profile */}
      <div className="px-6 py-4 border-t border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00C6FF]/60 to-[#0072FF]/60 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
            SC
          </div>
          <div className="overflow-hidden">
            <p className="text-white text-sm font-medium truncate">Suchart K.</p>
            <p className="text-[#64748B] text-xs truncate">ผู้ดูแลระบบ</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-0.5">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${isActive
                ? "bg-gradient-to-r from-[#00C6FF]/20 to-[#0072FF]/15 text-[#00C6FF] shadow-sm"
                : "text-[#94A3B8] hover:text-white hover:bg-white/5"
                }`}
            >
              <span className={`flex-shrink-0 transition-colors duration-200 ${isActive ? "text-[#00C6FF]" : "text-[#64748B] group-hover:text-white"}`}>
                {item.icon}
              </span>
              {item.label}
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#00C6FF]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-white/5">
        <Link
          href="/login"
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-[#94A3B8] hover:text-red-400 hover:bg-red-400/5 transition-all duration-200 group"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#64748B] group-hover:text-red-400 transition-colors">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          ออกจากระบบ
        </Link>
      </div>
    </aside>
  );
}
