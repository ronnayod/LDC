"use client";
import { useState } from "react";
import { PatientInfo } from "./types";

interface Props {
  isOpen: boolean;
  patients: PatientInfo[];
  onSelect: (p: PatientInfo) => void;
  onClose: () => void;
}

export default function PatientSelectModal({ isOpen, patients, onSelect, onClose }: Props) {
  const [search, setSearch] = useState("");
  if (!isOpen) return null;

  const filtered = patients.filter(p =>
    p.name.includes(search) || p.hn.includes(search) || p.phone.includes(search) || p.idCard.includes(search)
  );

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden" style={{ animation: "modal-pop 0.3s ease-out" }}>
        {/* Header */}
        <div className="p-5 border-b border-[#E2E8F0] flex justify-between items-center bg-[#F8FAFC]">
          <h3 className="text-lg font-bold text-[#1E293B] flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1E40AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
            เลือกลูกค้า / คนไข้
          </h3>
          <button onClick={onClose} className="text-[#94A3B8] hover:text-[#1E293B]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-[#E2E8F0]">
          <div className="relative">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="ค้นหา HN, ชื่อ, เบอร์โทร" className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#E2E8F0] text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/50 transition-all" />
          </div>
        </div>

        {/* Patient List */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {filtered.map(p => (
              <button key={p.id} onClick={() => onSelect(p)} className="w-full flex items-center gap-4 p-4 rounded-xl border border-[#E2E8F0] hover:border-[#1E40AF] hover:bg-[#EFF6FF]/50 transition-all text-left group">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#1E40AF] flex items-center justify-center text-white font-bold text-sm shrink-0">
                  {p.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#1E293B]">{p.name}</span>
                    {p.type === "VIP" && <span className="bg-[#DBEAFE] text-[#1E40AF] px-1.5 py-0.5 rounded text-[10px] font-bold">VIP</span>}
                  </div>
                  <div className="text-xs text-[#94A3B8] mt-0.5">HN: {p.hn} • {p.phone}</div>
                </div>
                <svg className="w-5 h-5 text-[#CBD5E1] group-hover:text-[#1E40AF] transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6" /></svg>
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="text-center text-[#94A3B8] py-12">ไม่พบข้อมูลลูกค้า</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
