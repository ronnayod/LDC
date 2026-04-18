export default function DentistSchedulePage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#1E293B]">ตารางลงตรวจทันตแพทย์</h2>
        <p className="text-sm text-[#64748B] mt-0.5">จัดการตารางเวลาลงตรวจของทันตแพทย์</p>
      </div>
      <div className="bg-white rounded-2xl p-12 shadow-sm border border-[#E2E8F0] flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#E0EAFF] flex items-center justify-center mb-4">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2B5998" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        </div>
        <h3 className="text-lg font-semibold text-[#1E293B] mb-1">หน้าตารางลงตรวจ</h3>
        <p className="text-sm text-[#64748B]">อยู่ระหว่างการพัฒนา — พร้อมใช้งานเร็วๆ นี้</p>
      </div>
    </div>
  );
}
