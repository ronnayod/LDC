"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Mock login — simulate delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsLoading(false);
    router.push("/");
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0a1628] via-[#0e2a4d] to-[#0a1628]">
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large gradient orb */}
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#00C6FF]/20 to-[#0072FF]/10 blur-3xl animate-pulse" />
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-[#0072FF]/15 to-[#00C6FF]/8 blur-3xl" />
        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-cyan-400/40 rounded-full" style={{ animation: "pulse-glow 3s ease-in-out infinite" }} />
        <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-blue-400/30 rounded-full" style={{ animation: "pulse-glow 4s ease-in-out infinite 1s" }} />
        <div className="absolute bottom-1/4 right-1/4 w-2.5 h-2.5 bg-cyan-300/20 rounded-full" style={{ animation: "pulse-glow 3.5s ease-in-out infinite 0.5s" }} />
        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md mx-4 animate-fade-in">
        <div className="glass-card rounded-[20px] p-10">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 mb-4 rounded-2xl bg-gradient-to-br from-[#00C6FF] to-[#0072FF] flex items-center justify-center shadow-lg" style={{ animation: "pulse-glow 3s ease-in-out infinite" }}>
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C10.5 2 9.2 2.7 8.5 3.8C7.5 3.3 6.3 3.5 5.5 4.3C4.7 5.1 4.5 6.3 5 7.3C3.9 8 3 9.3 3 10.8C3 12.3 3.9 13.6 5.2 14.3L7 22H10L11 16H13L14 22H17L18.8 14.3C20.1 13.6 21 12.3 21 10.8C21 9.3 20.1 8 19 7.3C19.5 6.3 19.3 5.1 18.5 4.3C17.7 3.5 16.5 3.3 15.5 3.8C14.8 2.7 13.5 2 12 2Z" fill="white" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-[#1E293B] tracking-tight">LDC Dental</h1>
            <p className="text-sm text-[#64748B] mt-1">ระบบจัดการคลินิกทันตกรรม</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-[#1E293B] mb-1.5">
                ชื่อผู้ใช้งาน
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </span>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#E2E8F0] bg-white text-[#1E293B] text-sm placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#00C6FF]/40 focus:border-[#00C6FF] transition-all duration-200"
                  placeholder="ชื่อผู้ใช้งาน"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#1E293B] mb-1.5">
                รหัสผ่าน
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-12 py-3 rounded-xl border border-[#E2E8F0] bg-white text-[#1E293B] text-sm placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#00C6FF]/40 focus:border-[#00C6FF] transition-all duration-200"
                  placeholder="รหัสผ่าน"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#64748B] transition-colors"
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded border-[#E2E8F0] text-[#0072FF] focus:ring-[#00C6FF]/40 cursor-pointer"
                />
                <span className="text-sm text-[#64748B]">จดจำการเข้าสู่ระบบ</span>
              </label>
              <button type="button" className="text-sm text-[#0072FF] hover:text-[#00C6FF] transition-colors font-medium">
                ลืมรหัสผ่าน?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#00C6FF] to-[#0072FF] text-white font-semibold text-sm tracking-wide shadow-lg shadow-[#0072FF]/25 hover:shadow-xl hover:shadow-[#0072FF]/30 hover:brightness-110 active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  กำลังเข้าสู่ระบบ...
                </span>
              ) : (
                "เข้าสู่ระบบ"
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-xs text-[#94A3B8] mt-8">
            © 2026 LDC Dental Clinic. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
