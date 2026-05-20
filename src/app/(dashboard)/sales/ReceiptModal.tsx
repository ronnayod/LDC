"use client";
import { CartItem, PatientInfo } from "./types";

interface Props {
  isOpen: boolean;
  patient: PatientInfo | null;
  items: CartItem[];
  total: number;
  discount: number;
  method: string;
  cashReceived: string;
  onClose: () => void;
}

const fmt = (n: number) => new Intl.NumberFormat("th-TH", { minimumFractionDigits: 2 }).format(n);

export default function ReceiptModal({ isOpen, patient, items, total, discount, method, cashReceived, onClose }: Props) {
  if (!isOpen) return null;

  const subtotal = items.reduce((s, i) => s + i.price * i.qty - i.discount, 0);
  const methodLabel = method === "cash" ? "เงินสด" : method === "transfer" ? "โอนเงินผ่านธนาคาร" : method === "credit" ? "บัตรเครดิต" : "เงินฝาก";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <style dangerouslySetInnerHTML={{ __html: `@media print { body * { visibility: hidden; } #sale-receipt, #sale-receipt * { visibility: visible; } #sale-receipt { position: absolute; left: 0; top: 0; width: 100%; padding: 20px; background: white; } }` }} />
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl flex flex-col max-h-[90vh] overflow-hidden" style={{ animation: "modal-pop 0.3s ease-out" }}>
        <div id="sale-receipt" className="p-8 flex-1 overflow-y-auto text-[#1E293B]">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-[#1E40AF]">Lunithic Dental</h2>
            <p className="text-sm text-[#64748B] mt-1">สาขาสำนักงานใหญ่</p>
            <p className="text-sm text-[#64748B]">โทร: 02-123-4567</p>
            <div className="mt-4 text-lg font-bold">ใบเสร็จรับเงิน</div>
          </div>

          <div className="text-sm space-y-1 mb-6 border-b border-[#E2E8F0] pb-4">
            <div className="flex justify-between"><span>วันที่:</span><span>{new Date().toLocaleDateString("th-TH")} {new Date().toLocaleTimeString("th-TH")}</span></div>
            <div className="flex justify-between"><span>เลขที่ใบเสร็จ:</span><span>RC-{Date.now().toString().slice(-6)}</span></div>
            <div className="flex justify-between"><span>ชื่อลูกค้า:</span><span className="font-semibold">{patient?.name || "ลูกค้าทั่วไป"}</span></div>
            {patient?.hn && <div className="flex justify-between"><span>HN:</span><span>{patient.hn}</span></div>}
          </div>

          <div className="mb-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E2E8F0] text-[#64748B]">
                  <th className="text-left pb-2 font-medium">รายการ</th>
                  <th className="text-center pb-2 font-medium">จำนวน</th>
                  <th className="text-right pb-2 font-medium">ราคา</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-2">
                      <div>{item.name}</div>
                      {item.discount > 0 && <div className="text-xs text-red-500">ส่วนลด: -฿{fmt(item.discount)}</div>}
                    </td>
                    <td className="py-2 text-center">{item.qty}</td>
                    <td className="py-2 text-right">฿{fmt(item.price * item.qty)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="border-t border-[#E2E8F0] pt-4 space-y-2 text-sm">
            <div className="flex justify-between text-[#64748B]"><span>รวมเป็นเงิน:</span><span>฿{fmt(subtotal)}</span></div>
            {discount > 0 && <div className="flex justify-between text-red-500"><span>ส่วนลดเพิ่มเติม:</span><span>-฿{fmt(discount)}</span></div>}
            <div className="flex justify-between font-bold text-lg pt-2 border-t border-[#E2E8F0]"><span>ยอดสุทธิ:</span><span>฿{fmt(total)}</span></div>
          </div>

          <div className="border-t border-[#E2E8F0] pt-4 mt-4 space-y-1 text-sm text-[#64748B]">
            <div className="flex justify-between"><span>ชำระโดย:</span><span className="font-semibold">{methodLabel}</span></div>
            {method === "cash" && (
              <>
                <div className="flex justify-between"><span>รับเงินมา:</span><span>฿{fmt(Number(cashReceived))}</span></div>
                <div className="flex justify-between text-[#10B981] font-medium"><span>เงินทอน:</span><span>฿{fmt(Number(cashReceived) - total)}</span></div>
              </>
            )}
          </div>

          <div className="text-center mt-8 text-sm text-[#94A3B8]">ขอบคุณที่ใช้บริการ</div>
        </div>

        <div className="p-5 border-t border-[#E2E8F0] bg-[#F8FAFC] flex gap-3 print:hidden shrink-0">
          <button onClick={() => window.print()} className="flex-1 py-3 bg-[#1E40AF] text-white font-bold rounded-xl hover:bg-[#1E3A8A] transition-colors flex items-center justify-center gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" /><rect x="6" y="14" width="12" height="8" /></svg>
            พิมพ์ใบเสร็จ
          </button>
          <button onClick={onClose} className="flex-1 py-3 bg-white border border-[#E2E8F0] text-[#64748B] font-bold rounded-xl hover:bg-[#F1F5F9] transition-colors">เสร็จสิ้น</button>
        </div>
      </div>
    </div>
  );
}
