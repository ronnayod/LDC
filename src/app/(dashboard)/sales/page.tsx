export default function SalesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#1E293B]">ขายสินค้า</h2>
        <p className="text-sm text-[#64748B] mt-0.5">จัดการการขายสินค้าและผลิตภัณฑ์</p>
      </div>
      <div className="bg-white rounded-2xl p-12 shadow-sm border border-[#E2E8F0] flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#EDE9FE] flex items-center justify-center mb-4">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6D28D9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
        </div>
        <h3 className="text-lg font-semibold text-[#1E293B] mb-1">หน้าขายสินค้า</h3>
        <p className="text-sm text-[#64748B]">อยู่ระหว่างการพัฒนา — พร้อมใช้งานเร็วๆ นี้</p>
      </div>
    </div>
  );
}
