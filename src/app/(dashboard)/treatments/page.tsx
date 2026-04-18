export default function TreatmentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#1E293B]">จัดการรักษา</h2>
        <p className="text-sm text-[#64748B] mt-0.5">จัดการข้อมูลการรักษาทั้งหมด</p>
      </div>
      <div className="bg-white rounded-2xl p-12 shadow-sm border border-[#E2E8F0] flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#DCFCE7] flex items-center justify-center mb-4">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
        </div>
        <h3 className="text-lg font-semibold text-[#1E293B] mb-1">หน้าจัดการรักษา</h3>
        <p className="text-sm text-[#64748B]">อยู่ระหว่างการพัฒนา — พร้อมใช้งานเร็วๆ นี้</p>
      </div>
    </div>
  );
}
