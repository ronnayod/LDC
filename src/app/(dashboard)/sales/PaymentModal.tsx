"use client";
import { useState } from "react";
import { CartItem, PatientInfo } from "./types";

interface Props {
  isOpen: boolean;
  patient: PatientInfo | null;
  items: CartItem[];
  onClose: () => void;
  onConfirm: (method: string, cashReceived: string, discount: number) => void;
  onSelectPatient: () => void;
}

const fmt = (n: number) => new Intl.NumberFormat("th-TH", { minimumFractionDigits: 2 }).format(n);

export default function PaymentModal({ isOpen, patient, items, onClose, onConfirm, onSelectPatient }: Props) {
  const [method, setMethod] = useState<string | null>(null);
  const [cash, setCash] = useState("");
  const [discount, setDiscount] = useState(0);
  const [qrOpen, setQrOpen] = useState(false);

  if (!isOpen) return null;

  const subtotal = items.reduce((s, i) => s + i.price * i.qty - i.discount, 0);
  const total = subtotal - discount;
  const change = Number(cash) - total;
  const canPay = method && (method !== "cash" || Number(cash) >= total);

  const handleSubmit = () => {
    if (method === "transfer") { setQrOpen(true); return; }
    onConfirm(method!, cash, discount);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
        <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[95vh] overflow-hidden" style={{ animation: "modal-pop 0.3s ease-out" }}>
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 bg-[#1E40AF] text-white shrink-0">
            <div className="flex items-center gap-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <h3 className="text-xl font-bold">ชำระเงิน</h3>
            </div>
            <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-lg transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div className="flex flex-1 overflow-hidden flex-col lg:flex-row">
            {/* Left - Items */}
            <div className="flex-1 overflow-y-auto p-6 border-r border-[#E2E8F0] bg-[#F8FAFC]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {/* Patient Info or Select Button */}
                <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-sm font-semibold text-[#64748B]">ข้อมูลลูกค้า</h4>
                    {patient?.type === "VIP" && <span className="bg-[#DBEAFE] text-[#1E40AF] px-2 py-0.5 rounded text-[10px] font-bold">VIP</span>}
                  </div>
                  {patient ? (
                    <>
                      <div className="font-bold text-[#1E293B] text-lg">{patient.name}</div>
                      <div className="text-sm text-[#64748B] mb-3">HN: {patient.hn}</div>
                      <div className="bg-[#DBEAFE] p-2.5 rounded-lg flex justify-between items-center">
                        <span className="text-xs text-[#1E40AF] font-medium">เงินฝากคงเหลือ</span>
                        <span className="font-bold text-[#1E40AF]">฿{fmt(patient.deposit)}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="font-bold text-[#1E293B] text-lg mb-1">ลูกค้าทั่วไป</div>
                      <div className="text-sm text-[#94A3B8] mb-3">ไม่ได้เลือกสมาชิก</div>
                      <button onClick={onSelectPatient} className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-[#EFF6FF] border border-[#1E40AF]/20 text-[#1E40AF] font-semibold text-sm rounded-lg hover:bg-[#DBEAFE] transition-colors">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                        เลือกลูกค้า / สมาชิก
                      </button>
                    </>
                  )}
                </div>
                <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-sm">
                  <h4 className="text-sm font-semibold text-[#64748B] mb-2">ข้อมูลการขาย</h4>
                  <div className="text-sm mb-1"><span className="text-[#94A3B8]">ผู้บันทึก:</span> <span className="font-medium text-[#1E293B]">Admin System</span></div>
                  <div className="text-sm"><span className="text-[#94A3B8]">วันที่:</span> <span className="font-medium text-[#1E293B]">{new Date().toLocaleDateString("th-TH")}</span></div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
                <div className="px-4 py-3 bg-[#F1F5F9] border-b border-[#E2E8F0]">
                  <h4 className="font-bold text-[#1E293B]">รายการสินค้า</h4>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-[#E2E8F0] text-[#64748B] bg-[#FAFBFC]">
                        <th className="px-4 py-2 font-medium w-12">#</th>
                        <th className="px-4 py-2 font-medium">รายละเอียด</th>
                        <th className="px-4 py-2 font-medium text-center w-20">จำนวน</th>
                        <th className="px-4 py-2 font-medium text-right w-28">ราคา/หน่วย</th>
                        <th className="px-4 py-2 font-medium text-right w-24">ส่วนลด</th>
                        <th className="px-4 py-2 font-medium text-right w-28">รวม</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F1F5F9]">
                      {items.map((item, idx) => (
                        <tr key={item.id} className="hover:bg-[#F8FAFC]">
                          <td className="px-4 py-3 text-[#94A3B8]">{idx + 1}</td>
                          <td className="px-4 py-3">
                            <div className="font-medium text-[#1E293B]">{item.name}</div>
                            <div className="text-xs text-[#94A3B8]">{item.code}</div>
                          </td>
                          <td className="px-4 py-3 text-center">{item.qty}</td>
                          <td className="px-4 py-3 text-right text-[#475569]">{fmt(item.price)}</td>
                          <td className="px-4 py-3 text-right text-red-500">{item.discount > 0 ? `-${fmt(item.discount)}` : "-"}</td>
                          <td className="px-4 py-3 text-right font-semibold text-[#1E293B]">{fmt(item.price * item.qty - item.discount)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right - Payment */}
            <div className="w-full lg:w-[400px] bg-white flex flex-col shrink-0">
              <div className="p-6 flex-1 overflow-y-auto space-y-6">
                <div className="bg-[#F8FAFC] rounded-xl p-5 border border-[#E2E8F0] space-y-3">
                  <div className="flex justify-between text-[#64748B] text-sm">
                    <span>ยอดรวม (Total)</span>
                    <span className="font-medium text-[#1E293B]">฿{fmt(subtotal)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#64748B] text-sm">ส่วนลดพิเศษ</span>
                    <input type="number" value={discount || ""} onChange={e => setDiscount(Number(e.target.value))} className="w-24 px-2 py-1 border border-[#E2E8F0] rounded-lg text-right text-sm" placeholder="0.00" />
                  </div>
                  <div className="pt-3 border-t border-[#E2E8F0]">
                    <div className="flex justify-between items-end">
                      <span className="font-bold text-[#1E293B]">ยอดชำระสุทธิ</span>
                      <span className="text-3xl font-extrabold text-[#1E40AF] tracking-tight">฿{fmt(total)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-[#1E293B] mb-3">ช่องทางการชำระ</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { key: "cash", label: "เงินสด", icon: <><rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="12" cy="12" r="2" /><path d="M6 12h.01M18 12h.01" /></> },
                      { key: "transfer", label: "โอนผ่านธนาคาร", icon: <><path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11m16-11v11M8 14v3m4-3v3m4-3v3" /></> },
                    ].map(pm => (
                      <button key={pm.key} onClick={() => setMethod(pm.key)}
                        className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${method === pm.key ? "border-[#1E40AF] bg-[#EFF6FF]" : "border-[#E2E8F0] bg-white hover:border-[#1E40AF]/40"}`}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={method === pm.key ? "#1E40AF" : "#64748B"} strokeWidth="1.5" className="mb-2">{pm.icon}</svg>
                        <span className={`text-sm font-semibold ${method === pm.key ? "text-[#1E40AF]" : "text-[#64748B]"}`}>{pm.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {method === "cash" && (
                  <div className="bg-[#EFF6FF] p-4 rounded-xl border border-[#1E40AF]/20 animate-fade-in">
                    <label className="block text-sm font-bold text-[#1E40AF] mb-2">จำนวนเงินที่รับมา</label>
                    <input type="number" value={cash} onChange={e => setCash(e.target.value)} className="w-full p-3 rounded-lg border-2 border-[#1E40AF]/30 focus:border-[#1E40AF] text-xl font-bold text-right outline-none transition-colors" placeholder="0.00" />
                    {Number(cash) >= total && (
                      <div className="flex justify-between items-center mt-3 pt-3 border-t border-[#1E40AF]/10">
                        <span className="font-semibold text-[#1E40AF]">เงินทอน</span>
                        <span className="text-lg font-bold text-[#10B981]">฿{fmt(change)}</span>
                      </div>
                    )}
                  </div>
                )}


              </div>

              <div className="p-6 border-t border-[#E2E8F0] bg-white">
                <button onClick={handleSubmit} disabled={!canPay}
                  className="w-full py-4 rounded-xl bg-[#1E40AF] text-white font-bold text-lg hover:bg-[#1E3A8A] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-[#1E40AF]/20 flex items-center justify-center gap-2">
                  ยืนยันการชำระเงิน <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                </button>
                <button onClick={onClose} className="w-full py-3 mt-3 rounded-xl border border-[#E2E8F0] text-[#64748B] font-semibold hover:bg-[#F1F5F9] transition-colors">ยกเลิก</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* QR Modal */}
      {qrOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl flex flex-col overflow-hidden text-center" style={{ animation: "modal-pop 0.2s ease-out" }}>
            <div className="bg-[#1E40AF] p-4 text-white">
              <h3 className="font-bold text-lg">สแกนเพื่อชำระเงิน</h3>
              <p className="text-sm text-white/80">PromptPay / Mobile Banking</p>
            </div>
            <div className="p-6 flex flex-col items-center">
              <div className="bg-white p-2 rounded-xl shadow-sm border border-[#E2E8F0] mb-4">
                <svg width="180" height="180" viewBox="0 0 24 24" fill="none" stroke="#1E293B" strokeWidth="1" strokeLinecap="square" strokeLinejoin="miter">
                  <path d="M3 3h8v8H3zM13 3h8v8h-8zM3 13h8v8H3z" /><path d="M6 6h2v2H6zM16 6h2v2h-2zM6 16h2v2H6z" /><path d="M14 14h2v2h-2zM18 14h2v2h-2zM14 18h2v2h-2zM18 18h2v2h-2zM16 16h2v2h-2z" />
                </svg>
              </div>
              <div className="text-sm text-[#64748B] mb-1">ยอดชำระ</div>
              <div className="text-3xl font-extrabold text-[#1E40AF] mb-6">฿{fmt(total)}</div>
              <button onClick={() => { setQrOpen(false); onConfirm("transfer", "0", discount); }} className="w-full py-3 bg-[#1E40AF] text-white rounded-xl font-bold hover:bg-[#1E3A8A] transition-colors shadow-lg shadow-[#1E40AF]/20">ยืนยันการรับเงินสำเร็จ</button>
              <button onClick={() => setQrOpen(false)} className="w-full py-3 mt-2 text-[#64748B] font-semibold hover:bg-[#F1F5F9] rounded-xl transition-colors">ยกเลิก</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
