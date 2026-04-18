export default function FormsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#1E293B]">แบบฟอร์ม</h2>
        <p className="text-sm text-[#64748B] mt-0.5">จัดการแบบฟอร์มต่างๆ</p>
      </div>
      <div className="bg-white rounded-2xl p-12 shadow-sm border border-[#E2E8F0] flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#EDE9FE] flex items-center justify-center mb-4">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6D28D9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>
        </div>
        <h3 className="text-lg font-semibold text-[#1E293B] mb-1">หน้าแบบฟอร์ม</h3>
        <p className="text-sm text-[#64748B]">อยู่ระหว่างการพัฒนา — พร้อมใช้งานเร็วๆ นี้</p>
      </div>
    </div>
  );
}
