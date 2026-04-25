"use client";

import { useState, useEffect, useMemo } from "react";

// ─── Types ─────────────────────────────────────────────
interface TreatmentRecord {
  id: string;
  treatmentCode: string;
  date: string;
  patientName: string;
  patientHn: string;
  phone: string;
  type: "ทั่วไป" | "VIP";
  coverage: string; // สิทธิการรักษา
  dentist: string;
  status: "นัดหมายวันนี้" | "รอคิว" | "กำลังรักษา" | "รอชำระเงิน" | "สำเร็จ";
  items: BillItem[];
}

interface BillItem {
  id: string;
  code: string;
  name: string;
  price: number;
  qty: number;
  discount: number;
  type: "treatment" | "product";
}

interface ProductInfo {
  id: string;
  name: string;
  price: number;
  stock: number;
  unit: string;
}

// ─── Mock Data ─────────────────────────────────────────
const mockProducts: ProductInfo[] = [
  { id: "P-001", name: "ยาสีฟัน สูตรเซนซิทีฟ", price: 150, stock: 50, unit: "หลอด" },
  { id: "P-002", name: "แปรงสีฟัน ขนนุ่มพิเศษ", price: 80, stock: 100, unit: "ด้าม" },
  { id: "P-003", name: "น้ำยาบ้วนปาก 500ml", price: 120, stock: 40, unit: "ขวด" },
  { id: "P-004", name: "ไหมขัดฟัน เคลือบแว็กซ์", price: 60, stock: 80, unit: "กล่อง" },
  { id: "P-005", name: "ยาพาราเซตามอล 500mg", price: 50, stock: 200, unit: "แผง" },
];

const initialTreatments: TreatmentRecord[] = [
  {
    id: "1",
    treatmentCode: "TR-20240425-001",
    date: "2026-04-25T09:00:00",
    patientName: "สมชาย ใจดี",
    patientHn: "HN-0001",
    phone: "081-234-5678",
    type: "ทั่วไป",
    coverage: "ประกันสังคม",
    dentist: "ทพญ. แพรวพรรณ สุขใจ",
    status: "รอชำระเงิน",
    items: [
      { id: "i1", code: "T-001", name: "ขูดหินปูนทั้งปาก", price: 1000, qty: 1, discount: 0, type: "treatment" },
      { id: "i2", code: "T-002", name: "อุดฟัน 1 ด้าน", price: 600, qty: 1, discount: 0, type: "treatment" }
    ],
  },
  {
    id: "2",
    treatmentCode: "TR-20240425-002",
    date: "2026-04-25T10:30:00",
    patientName: "สมหญิง รักสวย",
    patientHn: "HN-0002",
    phone: "082-345-6789",
    type: "VIP",
    coverage: "ประกันสุขภาพส่วนบุคคล",
    dentist: "ทพ. ศรัณย์ มาทำนา",
    status: "รอชำระเงิน",
    items: [
      { id: "i3", code: "T-003", name: "ฟอกสีฟัน", price: 4500, qty: 1, discount: 500, type: "treatment" },
    ],
  },
  {
    id: "3",
    treatmentCode: "TR-20240425-003",
    date: "2026-04-25T11:00:00",
    patientName: "วิชัย สุขสันต์",
    patientHn: "HN-0003",
    phone: "083-456-7890",
    type: "ทั่วไป",
    coverage: "ชำระเงินเอง",
    dentist: "ทพญ. แดนสนรยา มาทำนา",
    status: "กำลังรักษา",
    items: [],
  },
];

const TABS = [
  { id: "นัดหมายวันนี้", label: "นัดหมายวันนี้", count: 0 },
  { id: "รอคิว", label: "รอคิว", count: 0 },
  { id: "กำลังรักษา", label: "กำลังรักษา", count: 1 },
  { id: "รอชำระเงิน", label: "รอชำระเงิน", count: 2 },
  { id: "สำเร็จ", label: "สำเร็จ", count: 0 },
];

export default function TreatmentsPage() {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  const [treatments, setTreatments] = useState<TreatmentRecord[]>(initialTreatments);
  const [activeTab, setActiveTab] = useState<string>("รอชำระเงิน");
  const [searchQuery, setSearchQuery] = useState("");

  // Payment Modal State
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<TreatmentRecord | null>(null);
  const [billItems, setBillItems] = useState<BillItem[]>([]);

  // Payment Options State
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "credit" | "transfer" | "deposit" | null>(null);
  const [cashReceived, setCashReceived] = useState<number>(0);
  const [discountPrivilege, setDiscountPrivilege] = useState<number>(0);

  // Add Product Modal State
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [productSearch, setProductSearch] = useState("");
  const [tempProducts, setTempProducts] = useState<BillItem[]>([]);

  // QR Code Modal State
  const [qrModalOpen, setQrModalOpen] = useState(false);

  // Success Popup State
  const [successPopupOpen, setSuccessPopupOpen] = useState(false);

  // ─── Filtered Data ─────────────────────────────────────
  const filteredTreatments = useMemo(() => {
    return treatments.filter(t => {
      const matchTab = t.status === activeTab;
      const matchSearch = t.patientName.includes(searchQuery) ||
        t.treatmentCode.includes(searchQuery) ||
        t.phone.includes(searchQuery);
      return matchTab && matchSearch;
    });
  }, [treatments, activeTab, searchQuery]);

  // Tab counts
  const tabCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    treatments.forEach(t => {
      counts[t.status] = (counts[t.status] || 0) + 1;
    });
    return counts;
  }, [treatments]);

  // ─── Billing Math ──────────────────────────────────────
  const billTotal = billItems.reduce((sum, item) => sum + (item.price * item.qty) - item.discount, 0);
  const finalTotal = billTotal - discountPrivilege;

  // ─── Handlers ──────────────────────────────────────────
  const handleOpenPayment = (record: TreatmentRecord) => {
    setSelectedRecord(record);
    setBillItems([...record.items]);
    setPaymentMethod(null);
    setCashReceived(0);
    setDiscountPrivilege(0);
    setPaymentModalOpen(true);
  };

  const handleUpdateItemQty = (id: string, newQty: number) => {
    if (newQty < 1) return;
    setBillItems(prev => prev.map(item => item.id === id ? { ...item, qty: newQty } : item));
  };

  const handleDeleteItem = (id: string) => {
    setBillItems(prev => prev.filter(item => item.id !== id));
  };

  const handleOpenAddProduct = () => {
    setProductSearch("");
    setTempProducts([]);
    setProductModalOpen(true);
  };

  const handleAddTempProduct = (p: ProductInfo) => {
    const existing = tempProducts.find(item => item.code === p.id);
    if (existing) {
      setTempProducts(prev => prev.map(item => item.code === p.id ? { ...item, qty: item.qty + 1 } : item));
    } else {
      setTempProducts(prev => [...prev, {
        id: `p-${Date.now()}-${p.id}`,
        code: p.id,
        name: p.name,
        price: p.price,
        qty: 1,
        discount: 0,
        type: "product"
      }]);
    }
  };

  const handleConfirmProducts = () => {
    setBillItems(prev => [...prev, ...tempProducts]);
    setProductModalOpen(false);
  };

  const handleSubmitPaymentClick = () => {
    if (!selectedRecord) return;
    if (paymentMethod === 'transfer') {
      setQrModalOpen(true);
    } else {
      handleConfirmPayment();
    }
  };

  const handleConfirmPayment = () => {
    if (!selectedRecord) return;
    // Update record status to สำเร็จ
    setTreatments(prev => prev.map(t => t.id === selectedRecord.id ? { ...t, status: "สำเร็จ", items: billItems } : t));
    setPaymentModalOpen(false);
    setQrModalOpen(false);
    setSuccessPopupOpen(true);

    // Auto-hide popup after 2 seconds
    setTimeout(() => {
      setSuccessPopupOpen(false);
    }, 2000);
  };

  // Utility 
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', { style: 'decimal', minimumFractionDigits: 2 }).format(amount);
  };

  if (!isMounted) return null;

  return (
    <>
      <div className="space-y-6 animate-fade-in">
        {/* ═══ Header ═══ */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[#1E293B]">จัดการรักษา</h2>
            <p className="text-sm text-[#64748B] mt-0.5">ระบบจัดการสถานะการรักษา การขายสินค้า และชำระเงิน</p>
          </div>
        </div>

        {/* ═══ Tabs ═══ */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap
              ${activeTab === tab.id
                  ? "bg-[#1E40AF] text-white shadow-md"
                  : "bg-white text-[#64748B] border border-[#E2E8F0] hover:bg-[#F8FAFC]"}
            `}
            >
              {tab.label}
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${activeTab === tab.id ? "bg-white/20 text-white" : "bg-[#F1F5F9] text-[#94A3B8]"}`}>
                {tabCounts[tab.id] || 0}
              </span>
            </button>
          ))}
        </div>

        {/* ═══ Main Content / Table ═══ */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E2E8F0] overflow-hidden">
          {/* Toolbar */}
          <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
            <div className="relative w-[320px]">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหา HN, ชื่อ, เบอร์โทร..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-[#E2E8F0] text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/50 transition-all"
              />
            </div>
            <div className="text-sm text-[#64748B]">
              ผลลัพธ์: <span className="font-semibold text-[#1E293B]">{filteredTreatments.length}</span> รายการ
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#F3F4F6] border-b border-[#E2E8F0]">
                  <th className="px-5 py-3.5 text-xs font-semibold text-[#475569] uppercase tracking-wider">รหัสการรักษา</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-[#475569] uppercase tracking-wider">เวลา</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-[#475569] uppercase tracking-wider">ชื่อ-นามสกุล</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-[#475569] uppercase tracking-wider">ติดต่อ</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-[#475569] uppercase tracking-wider">ประเภท</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-[#475569] uppercase tracking-wider">สิทธิรักษ์</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-[#475569] uppercase tracking-wider">ทันตแพทย์</th>
                  <th className="w-34 px-5 py-3.5 text-xs font-semibold text-[#475569] uppercase tracking-wider">สถานะ</th>
                  <th className="w-32 px-5 py-3.5 text-center text-xs font-semibold text-[#475569] uppercase tracking-wider">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {filteredTreatments.length > 0 ? (
                  filteredTreatments.map((t) => (
                    <tr key={t.id} className="hover:bg-[#F8FAFC] transition-colors">
                      <td className="px-5 py-4 text-sm font-medium text-[#1E293B]">{t.treatmentCode}</td>
                      <td className="px-5 py-4 text-sm text-[#475569]">{new Date(t.date).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}</td>
                      <td className="px-5 py-4">
                        <div className="font-medium text-[#1E293B]">{t.patientName}</div>
                        <div className="text-xs text-[#94A3B8]">{t.patientHn}</div>
                      </td>
                      <td className="px-5 py-4 text-sm text-[#64748B]">{t.phone}</td>
                      <td className="px-5 py-4">
                        {t.type === 'VIP'
                          ? <span className="px-2.5 py-1 text-xs font-semibold bg-blue-100 text-blue-700 rounded-lg">VIP</span>
                          : <span className="px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-lg">ทั่วไป</span>
                        }
                      </td>
                      <td className="px-5 py-4 text-sm text-[#475569]">{t.coverage}</td>
                      <td className="px-5 py-4 text-sm text-[#475569]">{t.dentist}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full
                        ${t.status === 'รอชำระเงิน' ? 'bg-[#FFFBEB] text-[#F59E0B] border border-[#FDE68A]' : ''}
                        ${t.status === 'กำลังรักษา' ? 'bg-blue-50 text-blue-600 border border-blue-200' : ''}
                        ${t.status === 'สำเร็จ' ? 'bg-green-50 text-green-600 border border-green-200' : ''}
                      `}>
                          <span className={`w-1.5 h-1.5 rounded-full ${t.status === 'รอชำระเงิน' ? 'bg-[#F59E0B]' : t.status === 'กำลังรักษา' ? 'bg-blue-500' : 'bg-green-500'}`}></span>
                          {t.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        {t.status === 'รอชำระเงิน' && (
                          <button
                            onClick={() => handleOpenPayment(t)}
                            className="px-4 py-1.5 bg-[#1E40AF] text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-[#1E3A8A] transition-colors"
                          >
                            ชำระเงิน
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="px-5 py-16 text-center text-[#94A3B8]">
                      <svg className="w-12 h-12 mx-auto mb-3 text-[#CBD5E1]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
                      ไม่มีรายการ{activeTab}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* ═══════════════════════════════════════════════════════════════
           PAYMENT MODAL
         ═══════════════════════════════════════════════════════════════ */}
      {paymentModalOpen && selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-fade-in">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setPaymentModalOpen(false)}></div>

          {/* Modal Container */}
          <div className="relative w-full max-w-6xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[95vh] overflow-hidden" style={{ animation: "modal-pop 0.3s ease-out" }}>

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-[#1E40AF] text-white shrink-0">
              <div className="flex items-center gap-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <h3 className="text-xl font-bold">ชำระเงิน</h3>
              </div>
              <button onClick={() => setPaymentModalOpen(false)} className="p-1 hover:bg-white/20 rounded-lg transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Body */}
            <div className="flex flex-1 overflow-hidden flex-col lg:flex-row">

              {/* Left Column (Items & Info) */}
              <div className="flex-1 overflow-y-auto p-6 border-r border-[#E2E8F0] bg-[#F8FAFC]">

                {/* Info Cards */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {/* Patient Info */}
                  <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-sm font-semibold text-[#64748B]">ข้อมูลคนไข้</h4>
                      {selectedRecord.type === 'VIP' && <span className="bg-[#DBEAFE] text-[#1E40AF] px-2 py-0.5 rounded text-[10px] font-bold">VIP</span>}
                    </div>
                    <div className="font-bold text-[#1E293B] text-lg">{selectedRecord.patientName}</div>
                    <div className="text-sm text-[#64748B] mb-3">HN: {selectedRecord.patientHn}</div>
                    <div className="bg-[#DBEAFE] p-2.5 rounded-lg flex justify-between items-center">
                      <span className="text-xs text-[#1E40AF] font-medium">เงินฝากคงเหลือ</span>
                      <span className="font-bold text-[#1E40AF]">฿0.00</span>
                    </div>
                  </div>
                  {/* Doctor Info */}
                  <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-sm">
                    <h4 className="text-sm font-semibold text-[#64748B] mb-2">ข้อมูลผู้ให้บริการ</h4>
                    <div className="text-sm mb-1"><span className="text-[#94A3B8]">แพทย์:</span> <span className="font-medium text-[#1E293B]">{selectedRecord.dentist}</span></div>
                    <div className="text-sm mb-1"><span className="text-[#94A3B8]">ผู้บันทึก:</span> <span className="font-medium text-[#1E293B]">Admin System</span></div>
                    <div className="text-sm"><span className="text-[#94A3B8]">วันที่:</span> <span className="font-medium text-[#1E293B]">{new Date().toLocaleDateString('th-TH')}</span></div>
                  </div>
                </div>

                {/* Items Table */}
                <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden flex flex-col">
                  <div className="px-4 py-3 bg-[#F1F5F9] border-b border-[#E2E8F0] flex justify-between items-center">
                    <h4 className="font-bold text-[#1E293B]">รายการรักษา & สินค้า</h4>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="border-b border-[#E2E8F0] text-[#64748B] bg-[#FAFBFC]">
                          <th className="px-4 py-2 font-medium w-12">#</th>
                          <th className="px-4 py-2 font-medium">รายละเอียด</th>
                          <th className="px-4 py-2 font-medium text-center w-24">จำนวน</th>
                          <th className="px-4 py-2 font-medium text-right w-28">ราคา/หน่วย</th>
                          <th className="px-4 py-2 font-medium text-right w-24">ส่วนลด</th>
                          <th className="px-4 py-2 font-medium text-right w-28">รวม</th>
                          <th className="px-4 py-2 font-medium text-center w-12"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#F1F5F9]">
                        {billItems.map((item, idx) => (
                          <tr key={item.id} className="hover:bg-[#F8FAFC]">
                            <td className="px-4 py-3 text-[#94A3B8]">{idx + 1}</td>
                            <td className="px-4 py-3">
                              <div className="font-medium text-[#1E293B] flex items-center gap-2">
                                {item.name}
                                {item.type === 'treatment' && <span className="bg-green-100 text-green-700 text-[10px] px-1.5 py-0.5 rounded">รักษา</span>}
                                {item.type === 'product' && <span className="bg-blue-100 text-blue-700 text-[10px] px-1.5 py-0.5 rounded">สินค้า</span>}
                              </div>
                              <div className="text-xs text-[#94A3B8]">{item.code}</div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center justify-center gap-2 bg-[#F1F5F9] rounded-lg p-1">
                                <button onClick={() => handleUpdateItemQty(item.id, item.qty - 1)} className="w-6 h-6 flex justify-center items-center rounded bg-white text-[#64748B] hover:text-[#1E293B] shadow-sm">-</button>
                                <span className="w-4 text-center font-semibold">{item.qty}</span>
                                <button onClick={() => handleUpdateItemQty(item.id, item.qty + 1)} className="w-6 h-6 flex justify-center items-center rounded bg-white text-[#64748B] hover:text-[#1E293B] shadow-sm">+</button>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-right text-[#475569]">{formatCurrency(item.price)}</td>
                            <td className="px-4 py-3 text-right text-red-500">{item.discount > 0 ? `-${formatCurrency(item.discount)}` : '-'}</td>
                            <td className="px-4 py-3 text-right font-semibold text-[#1E293B]">{formatCurrency((item.price * item.qty) - item.discount)}</td>
                            <td className="px-4 py-3 text-center">
                              <button onClick={() => handleDeleteItem(item.id)} className="text-red-400 hover:text-red-600 p-1">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                              </button>
                            </td>
                          </tr>
                        ))}
                        {billItems.length === 0 && (
                          <tr>
                            <td colSpan={7} className="px-4 py-8 text-center text-[#94A3B8]">ไม่มีรายการในบิลชำระเงินนี้</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Add Product Button */}
                  <div className="p-4 border-t border-[#E2E8F0] bg-white">
                    <button onClick={handleOpenAddProduct} className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-[#1E40AF] text-[#1E40AF] font-bold rounded-xl hover:bg-[#EFF6FF] transition-colors w-max">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                      ขายสินค้า / เพิ่มรายการ
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column (Summary & Payment) */}
              <div className="w-full lg:w-[400px] bg-white flex flex-col shrink-0">
                <div className="p-6 flex-1 overflow-y-auto space-y-6">

                  {/* Summary Box */}
                  <div className="bg-[#F8FAFC] rounded-xl p-5 border border-[#E2E8F0] space-y-3">
                    <div className="flex justify-between text-[#64748B] text-sm">
                      <span>ยอดรวม (Total)</span>
                      <span className="font-medium text-[#1E293B]">฿{formatCurrency(billTotal)}</span>
                    </div>
                    <div className="flex justify-between text-[#64748B] text-sm">
                      <span>ส่วนลดโปรโมชั่น/จัดรายการ</span>
                      <span className="text-red-500 font-medium">- ฿0.00</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#64748B] text-sm">ส่วนลดพิเศษ (ถ้ามี)</span>
                      <input
                        type="number"
                        value={discountPrivilege || ''}
                        onChange={(e) => setDiscountPrivilege(Number(e.target.value))}
                        className="w-24 px-2 py-1 border border-[#E2E8F0] rounded-lg text-right text-sm"
                        placeholder="0.00"
                      />
                    </div>
                    <div className="pt-3 border-t border-[#E2E8F0]">
                      <div className="flex justify-between items-end">
                        <span className="font-bold text-[#1E293B]">ยอดชำระสุทธิสุทธิ</span>
                        <span className="text-3xl font-extrabold text-[#1E40AF] tracking-tight">฿{formatCurrency(finalTotal)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Methods */}
                  <div>
                    <h4 className="font-bold text-[#1E293B] mb-3">ช่องทางการชำระ (Payment Methods)</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setPaymentMethod('cash')}
                        className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all
                          ${paymentMethod === 'cash' ? 'border-[#1E40AF] bg-[#EFF6FF]' : 'border-[#E2E8F0] bg-white hover:border-[#1E40AF]/40 hover:bg-[#EFF6FF]/30'}`}
                      >
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={paymentMethod === 'cash' ? "#1E40AF" : "#64748B"} strokeWidth="1.5" className="mb-2"><rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="12" cy="12" r="2" /><path d="M6 12h.01M18 12h.01" /></svg>
                        <span className={`text-sm font-semibold ${paymentMethod === 'cash' ? 'text-[#1E40AF]' : 'text-[#64748B]'}`}>เงินสด</span>
                      </button>
                      <button
                        onClick={() => setPaymentMethod('transfer')}
                        className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all
                          ${paymentMethod === 'transfer' ? 'border-[#1E40AF] bg-[#EFF6FF]' : 'border-[#E2E8F0] bg-white hover:border-[#1E40AF]/40 hover:bg-[#EFF6FF]/30'}`}
                      >
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={paymentMethod === 'transfer' ? "#1E40AF" : "#64748B"} strokeWidth="1.5" className="mb-2"><path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11m16-11v11M8 14v3m4-3v3m4-3v3" /></svg>
                        <span className={`text-sm font-semibold ${paymentMethod === 'transfer' ? 'text-[#1E40AF]' : 'text-[#64748B]'}`}>โอนผ่านธนาคาร</span>
                      </button>
                      <button
                        onClick={() => setPaymentMethod('credit')}
                        className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all
                          ${paymentMethod === 'credit' ? 'border-[#1E40AF] bg-[#EFF6FF]' : 'border-[#E2E8F0] bg-white hover:border-[#1E40AF]/40 hover:bg-[#EFF6FF]/30'}`}
                      >
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={paymentMethod === 'credit' ? "#1E40AF" : "#64748B"} strokeWidth="1.5" className="mb-2"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></svg>
                        <span className={`text-sm font-semibold ${paymentMethod === 'credit' ? 'text-[#1E40AF]' : 'text-[#64748B]'}`}>บัตรเครดิต</span>
                      </button>
                      <button
                        onClick={() => setPaymentMethod('deposit')}
                        className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all opacity-50 cursor-not-allowed`}
                        disabled
                      >
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="1.5" className="mb-2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                        <span className={`text-sm font-semibold text-[#94A3B8]`}>เงินฝาก (฿0.00)</span>
                      </button>
                    </div>
                  </div>

                  {/* Cash Receive Input */}
                  {paymentMethod === 'cash' && (
                    <div className="bg-[#EFF6FF] p-4 rounded-xl border border-[#1E40AF]/20 animate-fade-in">
                      <label className="block text-sm font-bold text-[#1E40AF] mb-2">รับเงินทอน</label>
                      <input
                        type="number"
                        value={cashReceived || ''}
                        onChange={(e) => setCashReceived(Number(e.target.value))}
                        className="w-full p-3 rounded-lg border-2 border-[#1E40AF]/30 focus:border-[#1E40AF] text-xl font-bold text-right outline-none transition-colors"
                        placeholder="0.00"
                      />
                      {cashReceived >= finalTotal && (
                        <div className="flex justify-between items-center mt-3 pt-3 border-t border-[#1E40AF]/10">
                          <span className="font-semibold text-[#1E40AF]">เงินทอน</span>
                          <span className="text-lg font-bold text-[#10B981]">฿{formatCurrency(cashReceived - finalTotal)}</span>
                        </div>
                      )}
                    </div>
                  )}

                </div>

                {/* Footer Action */}
                <div className="p-6 border-t border-[#E2E8F0] bg-white">
                  <button
                    onClick={handleSubmitPaymentClick}
                    disabled={!paymentMethod || (paymentMethod === 'cash' && cashReceived < finalTotal)}
                    className="w-full py-4 rounded-xl bg-[#1E40AF] text-white font-bold text-lg hover:bg-[#1E3A8A] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-[#1E40AF]/20 flex items-center justify-center gap-2"
                  >
                    ยืนยันการชำระเงิน <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                  </button>
                  <button
                    onClick={() => setPaymentModalOpen(false)}
                    className="w-full py-3 mt-3 rounded-xl border border-[#E2E8F0] text-[#64748B] font-semibold hover:bg-[#F1F5F9] transition-colors"
                  >
                    ยกเลิก
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
           ADD PRODUCT / ITEM MODAL
         ═══════════════════════════════════════════════════════════════ */}
      {productModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col h-[600px] overflow-hidden" style={{ animation: "modal-pop 0.2s ease-out" }}>
            {/* Header */}
            <div className="p-5 border-b border-[#E2E8F0] flex justify-between items-center bg-[#F8FAFC]">
              <h3 className="text-lg font-bold text-[#1E293B] flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1E40AF" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                เพิ่มรายการสินค้า
              </h3>
              <button onClick={() => setProductModalOpen(false)} className="text-[#94A3B8] hover:text-[#1E293B]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>

            <div className="flex flex-1 overflow-hidden">
              {/* Product Selection List */}
              <div className="flex-1 flex flex-col border-r border-[#E2E8F0]">
                <div className="p-4 border-b border-[#E2E8F0]">
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                    <input
                      type="text"
                      placeholder="ค้นหาชื่อสินค้า..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 border border-[#E2E8F0] rounded-xl text-sm focus:outline-none focus:border-[#1E40AF]"
                    />
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-2">
                  <div className="grid grid-cols-2 gap-2">
                    {mockProducts.filter(p => p.name.includes(productSearch) || p.id.includes(productSearch)).map(p => (
                      <div key={p.id} className="border border-[#E2E8F0] rounded-xl p-3 flex justify-between items-center hover:border-[#1E40AF] hover:shadow-sm transition-all group bg-white">
                        <div>
                          <div className="font-semibold text-[#1E293B] text-sm leading-tight mb-1">{p.name}</div>
                          <div className="text-xs text-[#94A3B8]">{p.id} • คงเหลือ {p.stock} {p.unit}</div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className="font-bold text-[#1E40AF] text-sm">฿{p.price}</span>
                          <button onClick={() => handleAddTempProduct(p)} className="bg-[#EFF6FF] text-[#1E40AF] p-1.5 rounded-lg group-hover:bg-[#1E40AF] group-hover:text-white transition-colors">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Selected List Sidebar */}
              <div className="w-[320px] bg-[#FAFBFC] flex flex-col">
                <div className="p-4 border-b border-[#E2E8F0] font-bold text-[#1E293B] text-sm">
                  รายการที่เลือก ({tempProducts.length})
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {tempProducts.length === 0 ? (
                    <div className="text-center text-[#94A3B8] text-sm mt-8">ยังไม่มีสินค้าตัวเลือก</div>
                  ) : (
                    tempProducts.map((item, idx) => (
                      <div key={idx} className="bg-white border border-[#E2E8F0] rounded-xl p-3 relative shadow-sm">
                        <button
                          onClick={() => setTempProducts(prev => prev.filter(p => p.code !== item.code))}
                          className="absolute -top-2 -right-2 bg-red-100 text-red-500 rounded-full p-1 border border-white hover:bg-red-500 hover:text-white transition-colors"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                        </button>
                        <div className="font-semibold text-sm text-[#1E293B] line-clamp-1 mb-2">{item.name}</div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center bg-[#F1F5F9] rounded-lg p-0.5">
                            <button onClick={() => setTempProducts(prev => prev.map(p => p.code === item.code ? { ...p, qty: Math.max(1, p.qty - 1) } : p))} className="w-6 h-6 flex items-center justify-center font-bold text-[#64748B] hover:bg-white rounded">-</button>
                            <span className="w-8 text-center text-sm font-semibold">{item.qty}</span>
                            <button onClick={() => setTempProducts(prev => prev.map(p => p.code === item.code ? { ...p, qty: p.qty + 1 } : p))} className="w-6 h-6 flex items-center justify-center font-bold text-[#64748B] hover:bg-white rounded">+</button>
                          </div>
                          <span className="font-bold text-[#1E40AF]">฿{formatCurrency(item.price * item.qty)}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="p-4 border-t border-[#E2E8F0] bg-white mt-auto">
                  <div className="flex justify-between mb-4">
                    <span className="text-sm font-semibold text-[#64748B]">รวมทั้งหมด</span>
                    <span className="font-bold text-lg text-[#1E293B]">฿{formatCurrency(tempProducts.reduce((sum, i) => sum + (i.price * i.qty), 0))}</span>
                  </div>
                  <button
                    onClick={handleConfirmProducts}
                    disabled={tempProducts.length === 0}
                    className="w-full py-3 bg-[#1E40AF] text-white rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#1E3A8A] transition-colors shadow-lg shadow-[#1E40AF]/20"
                  >
                    ยืนยันการขาย ({tempProducts.length} รายการ)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
           QR CODE MODAL
         ═══════════════════════════════════════════════════════════════ */}
      {qrModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl flex flex-col overflow-hidden text-center" style={{ animation: "modal-pop 0.2s ease-out" }}>
            <div className="bg-[#1E40AF] p-4 text-white">
              <h3 className="font-bold text-lg">สแกนเพื่อชำระเงิน</h3>
              <p className="text-sm text-white/80">PromptPay / Mobile Banking</p>
            </div>
            <div className="p-6 flex flex-col items-center">
              <div className="bg-white p-2 rounded-xl shadow-sm border border-[#E2E8F0] mb-4">
                {/* Mock QR Code Icon */}
                <svg width="180" height="180" viewBox="0 0 24 24" fill="none" stroke="#1E293B" strokeWidth="1" strokeLinecap="square" strokeLinejoin="miter">
                  <path d="M3 3h8v8H3zM13 3h8v8h-8zM3 13h8v8H3z" /><path d="M6 6h2v2H6zM16 6h2v2h-2zM6 16h2v2H6z" /><path d="M14 14h2v2h-2zM18 14h2v2h-2zM14 18h2v2h-2zM18 18h2v2h-2zM16 16h2v2h-2z" />
                </svg>
              </div>
              <div className="text-sm justify-between w-full text-[#64748B] mb-1">ยอดชำระ</div>
              <div className="text-3xl font-extrabold text-[#1E40AF] mb-6">฿{formatCurrency(finalTotal)}</div>

              <button
                onClick={handleConfirmPayment}
                className="w-full py-3 bg-[#1E40AF] text-white rounded-xl font-bold hover:bg-[#1E3A8A] transition-colors shadow-lg shadow-[#1E40AF]/20"
              >
                ยืนยันการรับเงินสแกนสำเร็จ
              </button>
              <button
                onClick={() => setQrModalOpen(false)}
                className="w-full py-3 mt-2 text-[#64748B] font-semibold hover:bg-[#F1F5F9] rounded-xl transition-colors"
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
           SUCCESS POPUP
         ═══════════════════════════════════════════════════════════════ */}
      {successPopupOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl w-[320px] shadow-2xl flex flex-col items-center justify-center p-8 text-center" style={{ animation: "modal-pop 0.3s ease-out" }}>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            <h3 className="text-xl font-bold text-[#1E293B] mb-2">ชำระเงินสำเร็จ</h3>
            <p className="text-sm text-[#64748B]">ทำรายการชำระเงินเรียบร้อยแล้ว</p>
          </div>
        </div>
      )}
    </>
  );
}
