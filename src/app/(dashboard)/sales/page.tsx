"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import SuccessToast from "@/components/SuccessToast";
import ConfirmDialog from "@/components/ConfirmDialog";
import PaymentModal from "./PaymentModal";
import ReceiptModal from "./ReceiptModal";
import PatientSelectModal from "./PatientSelectModal";
import { CartItem, PatientInfo, SaleRecord } from "./types";
import { mockProducts, mockPatients } from "./mockData";

const fmt = (n: number) => new Intl.NumberFormat("th-TH", { minimumFractionDigits: 2 }).format(n);

const TABS = [
  { id: "pos", label: "ขายสินค้า" },
  { id: "history", label: "ประวัติการขาย" },
];

export default function SalesPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [activeTab, setActiveTab] = useState("pos");
  const [searchProduct, setSearchProduct] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<PatientInfo | null>(null);

  // Modals
  const [patientModalOpen, setPatientModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [receiptData, setReceiptData] = useState<{ items: CartItem[]; total: number; discount: number; method: string; cash: string } | null>(null);
  const [pendingReceiptData, setPendingReceiptData] = useState<{ items: CartItem[]; total: number; discount: number; method: string; cash: string } | null>(null);

  // History
  const [salesHistory, setSalesHistory] = useState<SaleRecord[]>([
    { id: "1", receiptNo: "RC-000001", date: "2026-05-20T09:30:00", patientName: "สิทธิชัย โสภา", patientHn: "RK-122094223", items: [{ id: "1", code: "P-001", name: "ยาสีฟัน สูตรเซนซิทีฟ", price: 150, qty: 2, discount: 0 }], total: 300, paymentMethod: "เงินสด" },
    { id: "2", receiptNo: "RC-000002", date: "2026-05-20T10:15:00", patientName: "พรรษา ธาดาวรวงศ์", patientHn: "RK-122094224", items: [{ id: "2", code: "SET001", name: "ชุดอุปกรณ์ทำความสะอาดหลังรักษาโรคเหงือก", price: 1000, qty: 1, discount: 0 }], total: 1000, paymentMethod: "โอนเงินผ่านธนาคาร" },
    { id: "3", receiptNo: "RC-000003", date: "2026-05-20T11:00:00", patientName: "จีรารัตน์ ธรรมวงศ์", patientHn: "RK-122094225", items: [{ id: "3", code: "P-003", name: "น้ำยาบ้วนปาก 500ml", price: 120, qty: 3, discount: 0 }, { id: "4", code: "P-004", name: "ไหมขัดฟัน เคลือบแว็กซ์", price: 60, qty: 2, discount: 0 }], total: 480, paymentMethod: "บัตรเครดิต" },
  ]);
  const [historySearch, setHistorySearch] = useState("");

  // Toast
  const [toastMsg, setToastMsg] = useState("");
  const [toastType, setToastType] = useState<"success" | "edit" | "delete" | "treatment" | "sky" | "purple">("success");
  const [toastVisible, setToastVisible] = useState(false);
  const showToast = useCallback((msg: string, type: "success" | "edit" | "delete" | "treatment" | "sky" | "purple") => { setToastMsg(msg); setToastType(type); setToastVisible(true); }, []);

  // Confirm
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmCfg, setConfirmCfg] = useState<{ title: string; message: string; type: "edit" | "delete" | "success" | "treatment" | "sky" | "purple"; confirmText: string; onConfirm: () => void }>({ title: "", message: "", type: "edit", confirmText: "ยืนยัน", onConfirm: () => {} });

  // Filtered products
  const filteredProducts = useMemo(() => mockProducts.filter(p => p.name.includes(searchProduct) || p.code.includes(searchProduct)), [searchProduct]);

  // Cart math
  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty - i.discount, 0);

  // Handlers
  const addToCart = (p: typeof mockProducts[0]) => {
    setCart(prev => {
      const exists = prev.find(i => i.code === p.code);
      if (exists) return prev.map(i => i.code === p.code ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { id: `c-${Date.now()}`, code: p.code, name: p.name, price: p.price, qty: 1, discount: 0 }];
    });
  };

  const updateQty = (id: string, qty: number) => { if (qty < 1) return; setCart(prev => prev.map(i => i.id === id ? { ...i, qty } : i)); };
  const removeItem = (id: string) => setCart(prev => prev.filter(i => i.id !== id));

  const handlePayClick = () => {
    if (cart.length === 0) return;
    setPaymentModalOpen(true);
  };

  const handlePaymentConfirm = (method: string, cash: string, discount: number) => {
    const total = cartTotal - discount;
    const methodLabel = method === "cash" ? "เงินสด" : method === "transfer" ? "โอนเงินผ่านธนาคาร" : method === "credit" ? "บัตรเครดิต" : "เงินฝาก";

    const newSale: SaleRecord = {
      id: String(Date.now()),
      receiptNo: `RC-${String(salesHistory.length + 1).padStart(6, "0")}`,
      date: new Date().toISOString(),
      patientName: selectedPatient?.name || "ลูกค้าทั่วไป",
      patientHn: selectedPatient?.hn || "-",
      items: [...cart],
      total,
      paymentMethod: methodLabel,
    };

    setSalesHistory(prev => [newSale, ...prev]);
    setPaymentModalOpen(false);

    // เก็บ receipt data ไว้ใน pending และแสดง toast ก่อน
    setPendingReceiptData({ items: [...cart], total, discount, method, cash });
    showToast("ชำระเงินเรียบร้อย", "purple");
  };

  const handleReceiptClose = () => {
    setReceiptOpen(false);
    setReceiptData(null);
    setCart([]);
    setSelectedPatient(null);
  };

  const filteredHistory = useMemo(() => salesHistory.filter(s =>
    s.patientName.includes(historySearch) || s.receiptNo.includes(historySearch) || s.patientHn.includes(historySearch)
  ), [salesHistory, historySearch]);

  if (!mounted) return null;

  return (
    <>
      <div className="space-y-4 sm:space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#1E293B]">ขายสินค้า</h2>
            <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">จัดการการขายสินค้าและผลิตภัณฑ์</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${activeTab === tab.id ? "bg-[#1E40AF] text-white shadow-md" : "bg-white text-[#64748B] border border-[#E2E8F0] hover:bg-[#F8FAFC]"}`}>
              {tab.label}
              {tab.id === "history" && <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${activeTab === tab.id ? "bg-white/20 text-white" : "bg-[#F1F5F9] text-[#94A3B8]"}`}>{salesHistory.length}</span>}
            </button>
          ))}
        </div>

        {/* ═══ POS TAB ═══ */}
        {activeTab === "pos" && (
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Left - Products */}
            <div className="flex-1 bg-white rounded-2xl shadow-sm border border-[#E2E8F0] overflow-hidden">
              {/* Patient bar */}
              <div className="px-4 sm:px-6 py-3 border-b border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between gap-3">
                {selectedPatient ? (
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#1E40AF] flex items-center justify-center text-white font-bold text-sm">{selectedPatient.name.charAt(0)}</div>
                    <div>
                      <div className="font-semibold text-[#1E293B] text-sm flex items-center gap-1.5">{selectedPatient.name} {selectedPatient.type === "VIP" && <span className="bg-[#DBEAFE] text-[#1E40AF] px-1.5 py-0.5 rounded text-[9px] font-bold">VIP</span>}</div>
                      <div className="text-xs text-[#94A3B8]">HN: {selectedPatient.hn}</div>
                    </div>
                    <button onClick={() => setSelectedPatient(null)} className="ml-2 text-[#94A3B8] hover:text-red-500 transition-colors"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg></button>
                  </div>
                ) : (
                  <button onClick={() => setPatientModalOpen(true)} className="flex items-center gap-2 text-[#1E40AF] font-semibold text-sm hover:underline">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                    เลือกลูกค้า
                  </button>
                )}
                <div className="relative w-full sm:w-[280px]">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                  <input type="text" value={searchProduct} onChange={e => setSearchProduct(e.target.value)} placeholder="ค้นหาสินค้า..." className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-[#E2E8F0] text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/50" />
                </div>
              </div>

              {/* Product Grid */}
              <div className="p-4 overflow-y-auto" style={{ maxHeight: "calc(100vh - 340px)" }}>
                <div className={`grid gap-3 ${cart.length > 0 ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"}`}>
                  {filteredProducts.map(p => (
                    <button key={p.id} onClick={() => addToCart(p)} className="bg-white border border-[#E2E8F0] rounded-xl p-4 text-left hover:border-[#1E40AF] hover:shadow-md transition-all group relative">
                      <div className="w-10 h-10 rounded-lg bg-[#EDE9FE] flex items-center justify-center mb-3">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6D28D9" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                      </div>
                      <div className="font-semibold text-[#1E293B] text-sm leading-tight mb-1 line-clamp-2">{p.name}</div>
                      <div className="text-xs text-[#94A3B8] mb-2">{p.code} • {p.stock} {p.unit}</div>
                      <div className="font-bold text-[#1E40AF]">฿{fmt(p.price)}</div>
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-[#1E40AF] text-white rounded-full w-7 h-7 flex items-center justify-center">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right - Cart (only show when items exist) */}
            {cart.length > 0 && (
            <div className="w-full lg:w-[380px] bg-white rounded-2xl shadow-sm border border-[#E2E8F0] flex flex-col shrink-0 overflow-hidden animate-fade-in">
              <div className="px-5 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC]">
                <h3 className="font-bold text-[#1E293B] flex items-center gap-2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1E40AF" strokeWidth="2"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" /></svg>
                  ตะกร้าสินค้า <span className="ml-auto text-sm font-normal text-[#94A3B8]">{cart.length} รายการ</span>
                </h3>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ maxHeight: "calc(100vh - 480px)" }}>
                {cart.map(item => (
                  <div key={item.id} className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3 relative">
                    <button onClick={() => removeItem(item.id)} className="absolute -top-2 -right-2 bg-red-100 text-red-500 rounded-full p-1 border border-white hover:bg-red-500 hover:text-white transition-colors">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    </button>
                    <div className="font-semibold text-sm text-[#1E293B] line-clamp-1 mb-2">{item.name}</div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center bg-white rounded-lg p-0.5 border border-[#E2E8F0]">
                        <button onClick={() => updateQty(item.id, item.qty - 1)} className="w-7 h-7 flex items-center justify-center font-bold text-[#64748B] hover:bg-[#F1F5F9] rounded">-</button>
                        <span className="w-8 text-center text-sm font-semibold">{item.qty}</span>
                        <button onClick={() => updateQty(item.id, item.qty + 1)} className="w-7 h-7 flex items-center justify-center font-bold text-[#64748B] hover:bg-[#F1F5F9] rounded">+</button>
                      </div>
                      <span className="font-bold text-[#1E40AF]">฿{fmt(item.price * item.qty)}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cart Footer */}
              <div className="p-5 border-t border-[#E2E8F0] bg-white space-y-4">
                <div className="flex justify-between items-end">
                  <span className="font-bold text-[#1E293B]">ยอดรวม</span>
                  <span className="text-2xl font-extrabold text-[#1E40AF]">฿{fmt(cartTotal)}</span>
                </div>
                <button onClick={handlePayClick} disabled={cart.length === 0}
                  className="w-full py-3.5 rounded-xl bg-[#1E40AF] text-white font-bold text-lg hover:bg-[#1E3A8A] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-[#1E40AF]/20 flex items-center justify-center gap-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>
                  ชำระเงิน
                </button>
              </div>
            </div>
            )}
          </div>
        )}

        {/* ═══ HISTORY TAB ═══ */}
        {activeTab === "history" && (
          <div className="bg-white rounded-2xl shadow-sm border border-[#E2E8F0] overflow-hidden">
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#F8FAFC]">
              <div className="relative w-full sm:w-[320px]">
                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                <input type="text" value={historySearch} onChange={e => setHistorySearch(e.target.value)} placeholder="ค้นหาเลขใบเสร็จ, ชื่อ, HN..." className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-[#E2E8F0] text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/50" />
              </div>
              <div className="text-sm text-[#64748B]">ผลลัพธ์: <span className="font-semibold text-[#1E293B]">{filteredHistory.length}</span> รายการ</div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[#F3F4F6] border-b border-[#E2E8F0]">
                    <th className="px-5 py-3.5 text-xs font-semibold text-[#475569] uppercase tracking-wider">เลขที่ใบเสร็จ</th>
                    <th className="px-5 py-3.5 text-xs font-semibold text-[#475569] uppercase tracking-wider">วันเวลา</th>
                    <th className="px-5 py-3.5 text-xs font-semibold text-[#475569] uppercase tracking-wider">ชื่อลูกค้า</th>
                    <th className="px-5 py-3.5 text-xs font-semibold text-[#475569] uppercase tracking-wider">HN</th>
                    <th className="px-5 py-3.5 text-xs font-semibold text-[#475569] uppercase tracking-wider">รายการ</th>
                    <th className="px-5 py-3.5 text-xs font-semibold text-[#475569] uppercase tracking-wider text-right">ยอดรวม</th>
                    <th className="px-5 py-3.5 text-xs font-semibold text-[#475569] uppercase tracking-wider">ช่องทาง</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9]">
                  {filteredHistory.length > 0 ? filteredHistory.map(s => (
                    <tr key={s.id} className="hover:bg-[#F8FAFC] transition-colors">
                      <td className="px-5 py-4 text-sm font-medium text-[#1E293B]">{s.receiptNo}</td>
                      <td className="px-5 py-4 text-sm text-[#475569]">{new Date(s.date).toLocaleDateString("th-TH")} {new Date(s.date).toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" })}</td>
                      <td className="px-5 py-4 text-sm font-medium text-[#1E293B]">{s.patientName}</td>
                      <td className="px-5 py-4 text-sm text-[#64748B]">{s.patientHn}</td>
                      <td className="px-5 py-4 text-sm text-[#64748B]">{s.items.length} รายการ</td>
                      <td className="px-5 py-4 text-sm font-bold text-[#1E40AF] text-right">฿{fmt(s.total)}</td>
                      <td className="px-5 py-4"><span className="px-2.5 py-1 text-xs font-semibold bg-green-50 text-green-600 border border-green-200 rounded-full">{s.paymentMethod}</span></td>
                    </tr>
                  )) : (
                    <tr><td colSpan={7} className="px-5 py-16 text-center text-[#94A3B8]">ไม่มีประวัติการขาย</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <PatientSelectModal isOpen={patientModalOpen} patients={mockPatients} onSelect={p => { setSelectedPatient(p); setPatientModalOpen(false); }} onClose={() => setPatientModalOpen(false)} />
      <PaymentModal isOpen={paymentModalOpen} patient={selectedPatient} items={cart} onClose={() => setPaymentModalOpen(false)} onConfirm={handlePaymentConfirm} onSelectPatient={() => setPatientModalOpen(true)} />
      {receiptData && <ReceiptModal isOpen={receiptOpen} patient={selectedPatient} items={receiptData.items} total={receiptData.total} discount={receiptData.discount} method={receiptData.method} cashReceived={receiptData.cash} onClose={handleReceiptClose} />}
      <ConfirmDialog isOpen={confirmOpen} title={confirmCfg.title} message={confirmCfg.message} type={confirmCfg.type} confirmText={confirmCfg.confirmText} onConfirm={confirmCfg.onConfirm} onCancel={() => setConfirmOpen(false)} />
      <SuccessToast message={toastMsg} type={toastType} isVisible={toastVisible} onClose={() => setToastVisible(false)}
        onComplete={() => {
          if (pendingReceiptData) {
            setReceiptData(pendingReceiptData);
            setPendingReceiptData(null);
            setReceiptOpen(true);
          }
        }}
      />
    </>
  );
}
