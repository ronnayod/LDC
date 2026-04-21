"use client";

import { useState, useEffect, useRef, useMemo } from "react";

// ─── Types ─────────────────────────────────────────────
interface Appointment {
  id: string;
  date: string;
  timeStart: string;
  timeEnd: string;
  projectName: string;
  patientName: string;
  patientHn: string;
  phone: string;
  branch: string;
  dentist: string;
  room: string;
  cc: string;
  status: "Check-in" | "รอตรวจ" | "สำเร็จ" | "ยกเลิก";
}

interface PatientOption {
  id: string;
  hn: string;
  name: string;
  phone: string;
  idCard: string;
  gender: string;
  age: number;
}

// ─── Initial Form State ─────────────────────────────────
const emptyForm = {
  date: "",
  timeStart: "",
  timeEnd: "",
  projectName: "",
  patientName: "",
  patientHn: "",
  phone: "",
  branch: "ศรีนครินทร์",
  dentist: "",
  room: "",
  cc: "",
  status: "รอตรวจ" as Appointment["status"],
};

// ─── Mock Patient Data ──────────────────────────────────
const mockPatients: PatientOption[] = [
  { id: "1", hn: "HN-0001", name: "สมชาย ใจดี", phone: "081-234-5678", idCard: "1100100100001", gender: "ชาย", age: 35 },
  { id: "2", hn: "HN-0002", name: "สมหญิง รักสวย", phone: "082-345-6789", idCard: "1100100100002", gender: "หญิง", age: 28 },
  { id: "3", hn: "HN-0003", name: "วิชัย สุขสันต์", phone: "083-456-7890", idCard: "1100100100003", gender: "ชาย", age: 42 },
  { id: "4", hn: "HN-0004", name: "นภา ดวงจันทร์", phone: "084-567-8901", idCard: "1100100100004", gender: "หญิง", age: 31 },
  { id: "5", hn: "HN-0005", name: "พิชัย กล้าหาญ", phone: "085-678-9012", idCard: "1100100100005", gender: "ชาย", age: 55 },
  { id: "6", hn: "HN-0006", name: "สุดา แก้วมณี", phone: "086-789-0123", idCard: "1100100100006", gender: "หญิง", age: 24 },
  { id: "7", hn: "HN-0007", name: "ประเสริฐ ศรีสะอาด", phone: "087-890-1234", idCard: "1100100100007", gender: "ชาย", age: 48 },
  { id: "8", hn: "HN-0008", name: "รัชนี ดอกไม้", phone: "088-901-2345", idCard: "1100100100008", gender: "หญิง", age: 36 },
  { id: "9", hn: "HN-0009", name: "ชัยวัฒน์ มั่นคง", phone: "089-012-3456", idCard: "1100100100009", gender: "ชาย", age: 62 },
  { id: "10", hn: "HN-0010", name: "กัลยา สวัสดี", phone: "080-123-4567", idCard: "1100100100010", gender: "หญิง", age: 29 },
];

// ─── Mock Appointment Data ──────────────────────────────
const initialAppointments: Appointment[] = [
  { id: "1", date: "2026-04-21", timeStart: "09:00", timeEnd: "10:00", projectName: "ตรวจสุขภาพฟัน", patientName: "สมชาย ใจดี", patientHn: "HN-0001", phone: "081-234-5678", branch: "ศรีนครินทร์", dentist: "ทพญ. แพรวพรรณ สุขใจ", room: "SN01", cc: "ตรวจฟัน ขูดหินปูน", status: "Check-in" },
  { id: "2", date: "2026-04-21", timeStart: "09:30", timeEnd: "10:30", projectName: "อุดฟัน", patientName: "สมหญิง รักสวย", patientHn: "HN-0002", phone: "082-345-6789", branch: "ศรีนครินทร์", dentist: "ทพ. ศรัณย์ มาทำนา", room: "SN02", cc: "อุดฟันกรามล่างซ้าย", status: "รอตรวจ" },
  { id: "3", date: "2026-04-21", timeStart: "10:00", timeEnd: "11:30", projectName: "รักษารากฟัน", patientName: "วิชัย สุขสันต์", patientHn: "HN-0003", phone: "083-456-7890", branch: "ศรีนครินทร์", dentist: "ทพญ. แดนสนรยา มาทำนา", room: "SN03", cc: "รักษารากฟันซี่ 36", status: "รอตรวจ" },
  { id: "4", date: "2026-04-21", timeStart: "10:30", timeEnd: "11:30", projectName: "ถอนฟัน", patientName: "นภา ดวงจันทร์", patientHn: "HN-0004", phone: "084-567-8901", branch: "ศรีนครินทร์", dentist: "ทพ. ศรัณย์ มาทำนา", room: "SN02", cc: "ถอนฟันคุดบน", status: "สำเร็จ" },
  { id: "5", date: "2026-04-21", timeStart: "11:00", timeEnd: "12:00", projectName: "จัดฟัน", patientName: "พิชัย กล้าหาญ", patientHn: "HN-0005", phone: "085-678-9012", branch: "ศรีนครินทร์", dentist: "ทพญ. แพรวพรรณ สุขใจ", room: "SN01", cc: "ปรับเหล็กจัดฟัน", status: "รอตรวจ" },
  { id: "6", date: "2026-04-21", timeStart: "13:00", timeEnd: "14:00", projectName: "ทำฟันปลอม", patientName: "สุดา แก้วมณี", patientHn: "HN-0006", phone: "086-789-0123", branch: "ศรีนครินทร์", dentist: "ทพญ. แดนสนรยา มาทำนา", room: "SN04", cc: "ทำฟันปลอมแบบถอดได้", status: "รอตรวจ" },
  { id: "7", date: "2026-04-21", timeStart: "13:30", timeEnd: "14:30", projectName: "ฟอกสีฟัน", patientName: "ประเสริฐ ศรีสะอาด", patientHn: "HN-0007", phone: "087-890-1234", branch: "ศรีนครินทร์", dentist: "ทพ. ศรัณย์ มาทำนา", room: "SN05", cc: "ฟอกสีฟัน", status: "ยกเลิก" },
  { id: "8", date: "2026-04-22", timeStart: "09:00", timeEnd: "10:00", projectName: "ตรวจสุขภาพฟัน", patientName: "รัชนี ดอกไม้", patientHn: "HN-0008", phone: "088-901-2345", branch: "ศรีนครินทร์", dentist: "ทพญ. แพรวพรรณ สุขใจ", room: "SN01", cc: "ตรวจฟัน", status: "รอตรวจ" },
  { id: "9", date: "2026-04-22", timeStart: "10:00", timeEnd: "11:00", projectName: "ขูดหินปูน", patientName: "ชัยวัฒน์ มั่นคง", patientHn: "HN-0009", phone: "089-012-3456", branch: "ศรีนครินทร์", dentist: "ทพญ. แดนสนรยา มาทำนา", room: "SN03", cc: "ขูดหินปูนทั้งปาก", status: "รอตรวจ" },
  { id: "10", date: "2026-04-22", timeStart: "11:00", timeEnd: "12:00", projectName: "ผ่าฟันคุด", patientName: "กัลยา สวัสดี", patientHn: "HN-0010", phone: "080-123-4567", branch: "ศรีนครินทร์", dentist: "ทพ. ศรัณย์ มาทำนา", room: "SN02", cc: "ผ่าฟันคุดล่างขวา", status: "รอตรวจ" },
  { id: "11", date: "2026-04-20", timeStart: "09:00", timeEnd: "10:00", projectName: "ตรวจสุขภาพฟัน", patientName: "สมชาย ใจดี", patientHn: "HN-0001", phone: "081-234-5678", branch: "ศรีนครินทร์", dentist: "ทพญ. แพรวพรรณ สุขใจ", room: "SN01", cc: "ตรวจฟัน follow-up", status: "สำเร็จ" },
  { id: "12", date: "2026-04-20", timeStart: "14:00", timeEnd: "15:00", projectName: "จัดฟัน", patientName: "สมหญิง รักสวย", patientHn: "HN-0002", phone: "082-345-6789", branch: "ศรีนครินทร์", dentist: "ทพญ. แพรวพรรณ สุขใจ", room: "SN01", cc: "ปรึกษาจัดฟัน", status: "สำเร็จ" },
  { id: "13", date: "2026-04-25", timeStart: "09:00", timeEnd: "10:00", projectName: "จัดฟัน", patientName: "สุดา แก้วมณี", patientHn: "HN-0006", phone: "086-789-0123", branch: "ศรีนครินทร์", dentist: "ทพญ. แพรวพรรณ สุขใจ", room: "SN01", cc: "ติดเหล็กจัดฟัน", status: "รอตรวจ" },
  { id: "14", date: "2026-04-25", timeStart: "10:30", timeEnd: "11:30", projectName: "ขูดหินปูน", patientName: "ประเสริฐ ศรีสะอาด", patientHn: "HN-0007", phone: "087-890-1234", branch: "ศรีนครินทร์", dentist: "ทพ. ศรัณย์ มาทำนา", room: "SN02", cc: "ขูดหินปูน ต่อนัดทำสะพานฟัน", status: "รอตรวจ" },
  { id: "15", date: "2026-04-28", timeStart: "13:00", timeEnd: "14:30", projectName: "รักษารากฟัน", patientName: "ชัยวัฒน์ มั่นคง", patientHn: "HN-0009", phone: "089-012-3456", branch: "ศรีนครินทร์", dentist: "ทพญ. แดนสนรยา มาทำนา", room: "SN03", cc: "รักษารากฟันรอบ 2", status: "รอตรวจ" },
  { id: "16", date: "2026-04-30", timeStart: "09:30", timeEnd: "10:30", projectName: "อุดฟัน", patientName: "กัลยา สวัสดี", patientHn: "HN-0010", phone: "080-123-4567", branch: "ศรีนครินทร์", dentist: "ทพ. ศรัณย์ มาทำนา", room: "SN02", cc: "อุดฟัน 2 ซี่", status: "รอตรวจ" },
];

const statusOptions = ["ทั้งหมด", "Check-in", "รอตรวจ", "สำเร็จ", "ยกเลิก"];
const branchOptions = ["ทั้งหมด", "ศรีนครินทร์", "พระราม 2", "รังสิต"];
const roomOptions = ["SN01", "SN02", "SN03", "SN04", "SN05", "SN06", "SN07", "SN08", "SN09", "SN10", "SN11"];
const dentistOptions = ["ทพญ. แพรวพรรณ สุขใจ", "ทพ. ศรัณย์ มาทำนา", "ทพญ. แดนสนรยา มาทำนา", "ทพ. ณัฐพล ชัยยง"];

const THAI_DAYS = ["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."];
const THAI_MONTHS = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];

type ModalMode = "closed" | "add" | "edit" | "view" | "delete";
type ViewMode = "calendar" | "table";

export default function AppointmentsPage() {
  // ─── State ────────────────────────────────────────────
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [viewMode, setViewMode] = useState<ViewMode>("calendar");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ทั้งหมด");
  const [branchFilter, setBranchFilter] = useState("ทั้งหมด");
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 8;

  // Calendar
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [dayPopupPos, setDayPopupPos] = useState<{ x: number; y: number } | null>(null);
  const dayPopupRef = useRef<HTMLDivElement>(null);

  // Modal
  const [modalMode, setModalMode] = useState<ModalMode>("closed");
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState<Record<string, boolean>>({});
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Patient picker
  const [showPatientPicker, setShowPatientPicker] = useState(false);
  const [patientSearch, setPatientSearch] = useState("");

  // Checkbox selection (table view)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // 3-dot menu
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpenMenu(null);
      if (dayPopupRef.current && !dayPopupRef.current.contains(e.target as Node)) {
        setSelectedDate(null);
        setDayPopupPos(null);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // ─── Calendar Helpers ─────────────────────────────────
  const calYear = calendarDate.getFullYear();
  const calMonth = calendarDate.getMonth();

  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(calYear, calMonth, 1).getDay();

  const prevMonth = () => setCalendarDate(new Date(calYear, calMonth - 1, 1));
  const nextMonth = () => setCalendarDate(new Date(calYear, calMonth + 1, 1));
  const goToday = () => setCalendarDate(new Date());

  // Map: dateStr -> appointments
  const appointmentsByDate = useMemo(() => {
    const map: Record<string, Appointment[]> = {};
    appointments.forEach((a) => {
      if (!map[a.date]) map[a.date] = [];
      map[a.date].push(a);
    });
    // Sort each day's appointments by time
    Object.values(map).forEach((arr) => arr.sort((a, b) => a.timeStart.localeCompare(b.timeStart)));
    return map;
  }, [appointments]);

  const todayStr = new Date().toISOString().split("T")[0];

  const handleDayClick = (day: number, e: React.MouseEvent) => {
    const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const dayApps = appointmentsByDate[dateStr];
    if (dayApps && dayApps.length > 0) {
      setSelectedDate(dateStr);
      // Calculate popup position relative to viewport
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      setDayPopupPos({
        x: Math.min(rect.left, window.innerWidth - 460),
        y: rect.bottom + 8,
      });
    } else {
      // Open add form with this date pre-filled
      setFormData({ ...emptyForm, date: dateStr });
      setFormErrors({});
      setModalMode("add");
    }
  };

  // ─── Table Filtering ──────────────────────────────────
  const filtered = appointments.filter((a) => {
    const matchSearch =
      a.patientName.toLowerCase().includes(search.toLowerCase()) ||
      a.patientHn.toLowerCase().includes(search.toLowerCase()) ||
      a.phone.includes(search) ||
      a.projectName.toLowerCase().includes(search.toLowerCase()) ||
      a.dentist.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "ทั้งหมด" || a.status === statusFilter;
    const matchBranch = branchFilter === "ทั้งหมด" || a.branch === branchFilter;
    return matchSearch && matchStatus && matchBranch;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  // ─── Status Badge Styles ──────────────────────────────
  const statusBadge: Record<string, string> = {
    "Check-in": "bg-blue-100 text-blue-700",
    "รอตรวจ": "bg-amber-100 text-amber-700",
    "สำเร็จ": "bg-emerald-100 text-emerald-700",
    "ยกเลิก": "bg-red-100 text-red-700",
  };

  const statusDot: Record<string, string> = {
    "Check-in": "bg-blue-500",
    "รอตรวจ": "bg-amber-500",
    "สำเร็จ": "bg-emerald-500",
    "ยกเลิก": "bg-red-500",
  };

  const statusDotSmall: Record<string, string> = {
    "Check-in": "bg-blue-400",
    "รอตรวจ": "bg-amber-400",
    "สำเร็จ": "bg-emerald-400",
    "ยกเลิก": "bg-red-400",
  };

  // ─── Helpers ──────────────────────────────────────────
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return d.toLocaleDateString("th-TH", { day: "2-digit", month: "2-digit", year: "numeric" });
  };

  const formatDateLong = (dateStr: string) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    const day = d.getDate();
    const month = THAI_MONTHS[d.getMonth()];
    const year = d.getFullYear() + 543;
    const weekday = THAI_DAYS[d.getDay()];
    return `${weekday} ${day} ${month} ${year}`;
  };

  // ─── Checkbox ─────────────────────────────────────────
  const toggleSelectAll = () => {
    if (selectedIds.size === paginated.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(paginated.map((a) => a.id)));
  };
  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelectedIds(next);
  };

  // ─── Open Modals ──────────────────────────────────────
  const openAdd = (preDate?: string) => {
    setFormData({ ...emptyForm, date: preDate || new Date().toISOString().split("T")[0] });
    setFormErrors({});
    setModalMode("add");
    setOpenMenu(null);
    setSelectedDate(null);
    setDayPopupPos(null);
  };

  const openEdit = (a: Appointment) => {
    setSelectedAppointment(a);
    setFormData({
      date: a.date, timeStart: a.timeStart, timeEnd: a.timeEnd, projectName: a.projectName,
      patientName: a.patientName, patientHn: a.patientHn, phone: a.phone, branch: a.branch,
      dentist: a.dentist, room: a.room, cc: a.cc, status: a.status,
    });
    setFormErrors({});
    setModalMode("edit");
    setOpenMenu(null);
    setSelectedDate(null);
    setDayPopupPos(null);
  };

  const openView = (a: Appointment) => {
    setSelectedAppointment(a);
    setModalMode("view");
    setOpenMenu(null);
    setSelectedDate(null);
    setDayPopupPos(null);
  };

  const openDelete = (a: Appointment) => {
    setSelectedAppointment(a);
    setModalMode("delete");
    setOpenMenu(null);
    setSelectedDate(null);
    setDayPopupPos(null);
  };

  // ─── Patient Picker ───────────────────────────────────
  const filteredPatients = mockPatients.filter((p) =>
    p.name.toLowerCase().includes(patientSearch.toLowerCase()) ||
    p.hn.toLowerCase().includes(patientSearch.toLowerCase()) ||
    p.phone.includes(patientSearch) ||
    p.idCard.includes(patientSearch)
  );

  const selectPatient = (p: PatientOption) => {
    setFormData((prev) => ({ ...prev, patientName: p.name, patientHn: p.hn, phone: p.phone }));
    setShowPatientPicker(false);
    setPatientSearch("");
    if (formErrors.patientName) setFormErrors((prev) => ({ ...prev, patientName: false }));
  };

  // ─── Form Handlers ───────────────────────────────────
  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) setFormErrors((prev) => ({ ...prev, [field]: false }));
  };

  const validateForm = () => {
    const errors: Record<string, boolean> = {};
    if (!formData.date) errors.date = true;
    if (!formData.timeStart) errors.timeStart = true;
    if (!formData.timeEnd) errors.timeEnd = true;
    if (!formData.patientName.trim()) errors.patientName = true;
    if (!formData.room) errors.room = true;
    if (!formData.dentist) errors.dentist = true;
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;
    if (modalMode === "add") {
      const newApp: Appointment = { id: String(Date.now()), ...formData };
      setAppointments((prev) => [newApp, ...prev]);
    } else if (modalMode === "edit" && selectedAppointment) {
      setAppointments((prev) => prev.map((a) => a.id === selectedAppointment.id ? { ...a, ...formData } : a));
    }
    setSaveSuccess(true);
    setTimeout(() => { setSaveSuccess(false); setModalMode("closed"); setSelectedAppointment(null); }, 800);
  };

  const handleDelete = () => {
    if (selectedAppointment) setAppointments((prev) => prev.filter((a) => a.id !== selectedAppointment.id));
    setModalMode("closed");
    setSelectedAppointment(null);
  };

  const handleBulkDelete = () => {
    setAppointments((prev) => prev.filter((a) => !selectedIds.has(a.id)));
    setSelectedIds(new Set());
  };

  // ─── Build Calendar Grid ─────────────────────────────
  const calendarCells: (number | null)[] = [];
  for (let i = 0; i < firstDayOfWeek; i++) calendarCells.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarCells.push(d);
  while (calendarCells.length % 7 !== 0) calendarCells.push(null);

  // ─── Render ───────────────────────────────────────────
  if (!isMounted) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* ═══ Header ═══ */}
      <div className="flex items-center justify-between animate-fade-in">
        <div>
          <h2 className="text-2xl font-bold text-[#1E293B]">ตารางนัดหมาย</h2>
          <p className="text-sm text-[#64748B] mt-0.5">จัดการนัดหมายทั้งหมด</p>
        </div>
        <div className="flex items-center gap-3">
          {selectedIds.size > 0 && viewMode === "table" && (
            <button onClick={handleBulkDelete} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500 text-white font-semibold text-sm shadow-lg shadow-red-500/20 hover:bg-red-600 active:scale-[0.98] transition-all duration-200">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              ลบที่เลือก ({selectedIds.size})
            </button>
          )}
          <button id="btn-add-appointment" onClick={() => openAdd()} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00C6FF] to-[#0072FF] text-white font-semibold text-sm shadow-lg shadow-[#0072FF]/20 hover:shadow-xl hover:brightness-110 active:scale-[0.98] transition-all duration-200">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            เพิ่มนัดหมาย
          </button>
        </div>
      </div>

      {/* ═══ View Mode Toggle ═══ */}
      <div className="flex gap-1 bg-white rounded-xl p-1 shadow-sm border border-[#E2E8F0] w-fit animate-fade-in">
        <button onClick={() => setViewMode("calendar")} className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${viewMode === "calendar" ? "bg-gradient-to-r from-[#00C6FF] to-[#0072FF] text-white shadow-sm" : "text-[#64748B] hover:text-[#1E293B] hover:bg-[#F1F5F9]"}`}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          ปฏิทิน
        </button>
        <button onClick={() => setViewMode("table")} className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${viewMode === "table" ? "bg-gradient-to-r from-[#00C6FF] to-[#0072FF] text-white shadow-sm" : "text-[#64748B] hover:text-[#1E293B] hover:bg-[#F1F5F9]"}`}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
          ตาราง
        </button>
      </div>

      {/* ═══════════════════════════════════════════════════
           CALENDAR VIEW
         ═══════════════════════════════════════════════════ */}
      {viewMode === "calendar" && (
        <div className="animate-fade-in">
          {/* Calendar Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#E2E8F0] overflow-hidden">
            {/* Calendar Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] bg-gradient-to-r from-[#F8FAFC] to-white">
              <div className="flex items-center gap-3">
                <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-[#F1F5F9] transition-colors" title="เดือนก่อนหน้า">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                </button>
                <h3 className="text-lg font-bold text-[#1E293B] min-w-[200px] text-center">
                  {THAI_MONTHS[calMonth]} {calYear + 543}
                </h3>
                <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-[#F1F5F9] transition-colors" title="เดือนถัดไป">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                </button>
              </div>
              <button onClick={goToday} className="px-4 py-2 rounded-xl border border-[#E2E8F0] text-sm font-medium text-[#475569] hover:bg-[#F1F5F9] transition-all">
                วันนี้
              </button>
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-7 border-b border-[#E2E8F0]">
              {THAI_DAYS.map((day, i) => (
                <div key={day} className={`py-3 text-center text-xs font-semibold uppercase tracking-wider ${i === 0 ? "text-red-400" : i === 6 ? "text-blue-400" : "text-[#64748B]"}`}>
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7">
              {calendarCells.map((day, idx) => {
                if (day === null) {
                  return <div key={`empty-${idx}`} className="min-h-[110px] bg-[#FAFBFC] border-b border-r border-[#F1F5F9]" />;
                }

                const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                const dayApps = appointmentsByDate[dateStr] || [];
                const isToday = dateStr === todayStr;
                const isSelected = dateStr === selectedDate;
                const dayOfWeek = new Date(calYear, calMonth, day).getDay();
                const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

                return (
                  <div
                    key={`day-${day}`}
                    onClick={(e) => handleDayClick(day, e)}
                    className={`min-h-[110px] p-2 border-b border-r border-[#F1F5F9] cursor-pointer transition-all duration-150 group relative
                      ${isToday ? "bg-blue-50/50" : isWeekend ? "bg-[#FAFBFC]" : "bg-white"}
                      ${isSelected ? "ring-2 ring-[#0072FF] ring-inset z-10" : ""}
                      hover:bg-[#E0EAFF]/20
                    `}
                  >
                    {/* Day Number */}
                    <div className="flex items-center justify-between mb-1">
                      <span className={`inline-flex items-center justify-center text-sm font-semibold w-7 h-7 rounded-full transition-colors
                        ${isToday ? "bg-gradient-to-r from-[#00C6FF] to-[#0072FF] text-white" : dayOfWeek === 0 ? "text-red-400" : dayOfWeek === 6 ? "text-blue-400" : "text-[#475569]"}
                      `}>
                        {day}
                      </span>
                      {dayApps.length > 0 && (
                        <span className="text-[10px] font-bold text-[#94A3B8] bg-[#F1F5F9] px-1.5 py-0.5 rounded-md">{dayApps.length}</span>
                      )}
                    </div>

                    {/* Appointment Preview (max 3) */}
                    <div className="space-y-0.5">
                      {dayApps.slice(0, 3).map((a) => (
                        <div
                          key={a.id}
                          className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium truncate leading-tight
                            ${a.status === "Check-in" ? "bg-blue-50 text-blue-700" : ""}
                            ${a.status === "รอตรวจ" ? "bg-amber-50 text-amber-700" : ""}
                            ${a.status === "สำเร็จ" ? "bg-emerald-50 text-emerald-700" : ""}
                            ${a.status === "ยกเลิก" ? "bg-red-50 text-red-500 line-through" : ""}
                          `}
                        >
                          <span className={`w-1 h-1 rounded-full flex-shrink-0 ${statusDotSmall[a.status]}`} />
                          <span className="truncate">{a.timeStart} {a.patientName}</span>
                        </div>
                      ))}
                      {dayApps.length > 3 && (
                        <div className="text-[10px] text-[#94A3B8] px-1.5 font-medium">+{dayApps.length - 3} อื่นๆ</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-6 px-6 py-3 border-t border-[#E2E8F0] bg-[#FAFBFC]">
              <span className="text-xs text-[#94A3B8] font-medium">สถานะ:</span>
              {Object.entries(statusBadge).map(([status, cls]) => (
                <div key={status} className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${statusDot[status]}`} />
                  <span className="text-xs text-[#475569]">{status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ─── Day Popup (on calendar cell click) ─── */}
          {selectedDate && dayPopupPos && appointmentsByDate[selectedDate] && (
            <div
              ref={dayPopupRef}
              className="fixed z-[90] w-[440px] bg-white rounded-2xl shadow-2xl border border-[#E2E8F0] overflow-hidden"
              style={{
                left: Math.max(8, Math.min(dayPopupPos.x, window.innerWidth - 460)),
                top: Math.min(dayPopupPos.y, window.innerHeight - 400),
                animation: "modal-pop 0.2s ease-out",
              }}
            >
              {/* Popup Header */}
              <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-[#1E3A5F] to-[#2B5998]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{formatDateLong(selectedDate)}</h4>
                    <p className="text-xs text-white/60">{appointmentsByDate[selectedDate].length} นัดหมาย</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openAdd(selectedDate)}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white/80 hover:text-white"
                    title="เพิ่มนัดหมาย"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  </button>
                  <button
                    onClick={() => { setSelectedDate(null); setDayPopupPos(null); }}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white/80 hover:text-white"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </div>
              </div>

              {/* Popup Appointment List */}
              <div className="max-h-[300px] overflow-y-auto divide-y divide-[#F1F5F9]">
                {appointmentsByDate[selectedDate].map((a) => (
                  <div key={a.id} className="px-5 py-3 hover:bg-[#F8FAFC] transition-colors group/item">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        {/* Time */}
                        <div className="flex flex-col items-center pt-0.5 flex-shrink-0">
                          <span className="text-sm font-bold text-[#1E293B]">{a.timeStart}</span>
                          <div className="w-px h-2 bg-[#E2E8F0] my-0.5" />
                          <span className="text-[10px] text-[#94A3B8]">{a.timeEnd}</span>
                        </div>

                        {/* Details */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-[#1E293B] truncate">{a.patientName}</span>
                            <span className="text-[10px] font-mono text-[#94A3B8]">{a.patientHn}</span>
                          </div>
                          <p className="text-xs text-[#64748B] mt-0.5 truncate">{a.projectName} · {a.dentist}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusBadge[a.status]}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${statusDot[a.status]}`} />
                              {a.status}
                            </span>
                            <span className="text-[10px] text-[#94A3B8]">ห้อง {a.room}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-0.5 opacity-0 group-hover/item:opacity-100 transition-opacity flex-shrink-0 ml-2">
                        <button onClick={() => openView(a)} className="p-1.5 rounded-md hover:bg-[#E0EAFF] transition-colors" title="ดูรายละเอียด">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0072FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        </button>
                        <button onClick={() => openEdit(a)} className="p-1.5 rounded-md hover:bg-[#E0EAFF] transition-colors" title="แก้ไข">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0072FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        </button>
                        <button onClick={() => openDelete(a)} className="p-1.5 rounded-md hover:bg-red-50 transition-colors" title="ลบ">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════
           TABLE VIEW
         ═══════════════════════════════════════════════════ */}
      {viewMode === "table" && (
        <div className="animate-fade-in space-y-4">
          {/* ═══ Filters ═══ */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 min-w-[280px] max-w-md">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input
                id="input-search-appointment"
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                placeholder="ค้นหาด้วย ชื่อ นามสกุล หรือ เบอร์โทรศัพท์..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#E2E8F0] text-sm text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#00C6FF]/30 focus:border-[#00C6FF] transition-all"
              />
            </div>
            {/* Status filter */}
            <select id="filter-status" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }} className="px-4 py-2.5 rounded-xl bg-white border border-[#E2E8F0] text-sm text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#00C6FF]/30 cursor-pointer">
              {statusOptions.map((s) => (<option key={s} value={s}>สถานะ: {s}</option>))}
            </select>
            {/* Branch filter */}
            <select id="filter-branch" value={branchFilter} onChange={(e) => { setBranchFilter(e.target.value); setCurrentPage(1); }} className="px-4 py-2.5 rounded-xl bg-white border border-[#E2E8F0] text-sm text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#00C6FF]/30 cursor-pointer">
              {branchOptions.map((b) => (<option key={b} value={b}>สาขา: {b}</option>))}
            </select>
            <span className="text-sm text-[#64748B] ml-2">พบ <span className="font-semibold text-[#1E293B]">{filtered.length}</span> รายการ</span>
          </div>

          {/* ═══ Table ═══ */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#E2E8F0] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#1E3A5F]">
                    <th className="px-4 py-3.5 w-12">
                      <input type="checkbox" checked={paginated.length > 0 && selectedIds.size === paginated.length} onChange={toggleSelectAll} className="w-4 h-4 accent-[#00C6FF] rounded cursor-pointer"/>
                    </th>
                    <th className="text-left px-4 py-3.5 text-xs font-semibold text-white uppercase tracking-wider">วันที่</th>
                    <th className="text-left px-4 py-3.5 text-xs font-semibold text-white uppercase tracking-wider">เวลา</th>
                    <th className="text-left px-4 py-3.5 text-xs font-semibold text-white uppercase tracking-wider">ชื่อโครงการ</th>
                    <th className="text-left px-4 py-3.5 text-xs font-semibold text-white uppercase tracking-wider">ชื่อ - นามสกุล</th>
                    <th className="text-left px-4 py-3.5 text-xs font-semibold text-white uppercase tracking-wider">เบอร์โทรศัพท์</th>
                    <th className="text-left px-4 py-3.5 text-xs font-semibold text-white uppercase tracking-wider">สาขา</th>
                    <th className="text-left px-4 py-3.5 text-xs font-semibold text-white uppercase tracking-wider">ทันตแพทย์</th>
                    <th className="text-left px-4 py-3.5 text-xs font-semibold text-white uppercase tracking-wider">สถานะ</th>
                    <th className="text-center px-4 py-3.5 text-xs font-semibold text-white uppercase tracking-wider">จัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9]">
                  {paginated.map((a, i) => (
                    <tr key={a.id} className={`${i % 2 === 1 ? "bg-[#F8FAFC]" : "bg-white"} hover:bg-[#E0EAFF]/30 transition-colors`}>
                      <td className="px-4 py-3.5"><input type="checkbox" checked={selectedIds.has(a.id)} onChange={() => toggleSelect(a.id)} className="w-4 h-4 accent-[#00C6FF] rounded cursor-pointer"/></td>
                      <td className="px-4 py-3.5 text-sm text-[#475569]">{formatDate(a.date)}</td>
                      <td className="px-4 py-3.5 text-sm font-medium text-[#1E293B]">{a.timeStart} - {a.timeEnd}</td>
                      <td className="px-4 py-3.5 text-sm text-[#475569]">{a.projectName}</td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00C6FF]/20 to-[#0072FF]/20 flex items-center justify-center text-[#0072FF] text-xs font-bold flex-shrink-0">{a.patientName.charAt(0)}</div>
                          <div>
                            <span className="text-sm font-medium text-[#1E293B]">{a.patientName}</span>
                            <p className="text-xs text-[#94A3B8]">{a.patientHn}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-sm text-[#475569]">{a.phone}</td>
                      <td className="px-4 py-3.5 text-sm text-[#475569]">{a.branch}</td>
                      <td className="px-4 py-3.5 text-sm text-[#475569]">{a.dentist}</td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${statusBadge[a.status]}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${statusDot[a.status]}`}/>
                          {a.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center justify-center relative" ref={openMenu === a.id ? menuRef : undefined}>
                          <button onClick={() => setOpenMenu(openMenu === a.id ? null : a.id)} className="p-2 rounded-lg hover:bg-[#F1F5F9] transition-colors" title="ตัวเลือก">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#64748B]"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                          </button>
                          {openMenu === a.id && (
                            <div className="absolute right-0 top-10 z-50 w-44 bg-white rounded-xl shadow-xl border border-[#E2E8F0] py-1.5 animate-fade-in">
                              <button onClick={() => openView(a)} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0072FF] transition-colors">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                รายละเอียด
                              </button>
                              <button onClick={() => openEdit(a)} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0072FF] transition-colors">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                แก้ไข
                              </button>
                              <div className="border-t border-[#F1F5F9] my-1"/>
                              <button onClick={() => openDelete(a)} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                                ลบ
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {paginated.length === 0 && (
                    <tr>
                      <td colSpan={10} className="px-6 py-16 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                          <p className="text-[#94A3B8] text-sm">ไม่พบข้อมูลนัดหมาย</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-[#E2E8F0]">
                <p className="text-sm text-[#64748B]">หน้า {currentPage} จาก {totalPages}</p>
                <div className="flex items-center gap-1">
                  <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="px-3 py-1.5 rounded-lg text-sm font-medium text-[#64748B] hover:bg-[#F1F5F9] disabled:opacity-40 disabled:cursor-not-allowed transition-colors">← ก่อนหน้า</button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button key={page} onClick={() => setCurrentPage(page)} className={`w-9 h-9 rounded-lg text-sm font-medium transition-all duration-200 ${page === currentPage ? "bg-gradient-to-r from-[#00C6FF] to-[#0072FF] text-white shadow-sm" : "text-[#64748B] hover:bg-[#F1F5F9]"}`}>{page}</button>
                  ))}
                  <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="px-3 py-1.5 rounded-lg text-sm font-medium text-[#64748B] hover:bg-[#F1F5F9] disabled:opacity-40 disabled:cursor-not-allowed transition-colors">ถัดไป →</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
           MODALS
         ═══════════════════════════════════════════════════════════════ */}

      {/* ─── Delete Confirmation Modal ─── */}
      {modalMode === "delete" && selectedAppointment && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl mx-4" style={{ animation: "modal-pop 0.25s ease-out" }}>
            <div className="flex justify-center mb-5">
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
              </div>
            </div>
            <h3 className="text-xl font-bold text-[#1E293B] text-center mb-2">ยืนยันการลบนัดหมาย?</h3>
            <p className="text-sm text-[#64748B] text-center mb-8">
              คุณแน่ใจหรือไม่ว่าต้องการลบนัดหมายของ<br/>
              <span className="font-semibold text-[#1E293B]">{selectedAppointment.patientName}</span> ({selectedAppointment.patientHn})<br/>
              วันที่ {formatDate(selectedAppointment.date)} เวลา {selectedAppointment.timeStart} - {selectedAppointment.timeEnd}<br/>
              <span className="text-red-400 text-xs mt-2 block">การดำเนินการนี้ไม่สามารถย้อนกลับได้</span>
            </p>
            <div className="flex gap-3">
              <button id="btn-cancel-delete" onClick={() => { setModalMode("closed"); setSelectedAppointment(null); }} className="flex-1 px-5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm font-semibold text-[#475569] hover:bg-[#F1F5F9] transition-all">ยกเลิก</button>
              <button id="btn-confirm-delete" onClick={handleDelete} className="flex-1 px-5 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 active:scale-[0.98] transition-all shadow-lg shadow-red-500/20">ยืนยันลบ</button>
            </div>
          </div>
        </div>
      )}

      {/* ─── View Appointment Detail Modal ─── */}
      {modalMode === "view" && selectedAppointment && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl mx-4 max-h-[90vh] flex flex-col" style={{ animation: "modal-pop 0.25s ease-out" }}>
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-5 border-b border-[#E2E8F0] flex-shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00C6FF] to-[#0072FF] flex items-center justify-center text-white font-bold text-lg">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#1E293B]">รายละเอียดนัดหมาย</h3>
                  <p className="text-sm text-[#64748B]">{selectedAppointment.projectName}</p>
                </div>
              </div>
              <button onClick={() => { setModalMode("closed"); setSelectedAppointment(null); }} className="p-2 rounded-lg hover:bg-[#F1F5F9] transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            {/* Body */}
            <div className="overflow-y-auto p-8 space-y-6 flex-1">
              <div className="flex items-center gap-3">
                <span className="text-sm text-[#64748B]">สถานะ:</span>
                <span className={`inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-full ${statusBadge[selectedAppointment.status]}`}>
                  <span className={`w-2 h-2 rounded-full ${statusDot[selectedAppointment.status]}`}/>
                  {selectedAppointment.status}
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <InfoItem label="วันที่" value={formatDateLong(selectedAppointment.date)} />
                <InfoItem label="เวลา" value={`${selectedAppointment.timeStart} - ${selectedAppointment.timeEnd}`} />
                <InfoItem label="ห้อง" value={selectedAppointment.room} />
                <InfoItem label="ทันตแพทย์" value={selectedAppointment.dentist} />
                <InfoItem label="สาขา" value={selectedAppointment.branch} />
                <InfoItem label="ชื่อโครงการ" value={selectedAppointment.projectName} />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[#1E293B] mb-3 flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0072FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  ข้อมูลคนไข้
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 bg-[#F8FAFC] rounded-xl p-4">
                  <InfoItem label="ชื่อ-นามสกุล" value={selectedAppointment.patientName} />
                  <InfoItem label="HN" value={selectedAppointment.patientHn} />
                  <InfoItem label="เบอร์โทรศัพท์" value={selectedAppointment.phone} />
                </div>
              </div>
              {selectedAppointment.cc && (
                <div>
                  <h4 className="text-sm font-semibold text-[#1E293B] mb-3 flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0072FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                    CC / หมายเหตุ
                  </h4>
                  <div className="bg-[#F8FAFC] rounded-xl p-4">
                    <p className="text-sm text-[#475569]">{selectedAppointment.cc}</p>
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-3 px-8 py-5 border-t border-[#E2E8F0] flex-shrink-0">
              <button onClick={() => openEdit(selectedAppointment)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00C6FF] to-[#0072FF] text-white font-semibold text-sm shadow-lg shadow-[#0072FF]/20 hover:shadow-xl hover:brightness-110 active:scale-[0.98] transition-all duration-200">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                แก้ไขนัดหมาย
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Add / Edit Appointment Form Modal ─── */}
      {(modalMode === "add" || modalMode === "edit") && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl mx-4 max-h-[90vh] flex flex-col" style={{ animation: "modal-pop 0.25s ease-out" }}>
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-5 border-b border-[#E2E8F0] flex-shrink-0">
              <div>
                <h3 className="text-lg font-bold text-[#1E293B]">{modalMode === "add" ? "เพิ่มนัดหมายใหม่" : "แก้ไขนัดหมาย"}</h3>
                <p className="text-sm text-[#64748B] mt-0.5">{modalMode === "add" ? "กรอกข้อมูลนัดหมายด้านล่าง" : `แก้ไขนัดหมาย ${selectedAppointment?.patientName}`}</p>
              </div>
              <button onClick={() => { setModalMode("closed"); setSelectedAppointment(null); }} className="p-2 rounded-lg hover:bg-[#F1F5F9] transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            {/* Form Body */}
            <div className="overflow-y-auto p-8 space-y-8 flex-1">
              {/* ─── Section: ข้อมูลคนไข้ ─── */}
              <FormSection title="ข้อมูลคนไข้" icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0072FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              }>
                <div className="col-span-full">
                  <FormField label="คนไข้" required error={formErrors.patientName}>
                    <div className="flex gap-2">
                      <input type="text" value={formData.patientName ? `${formData.patientName} (${formData.patientHn})` : ""} readOnly placeholder="เลือกคนไข้..." className={`flex-1 ${inputClass(formErrors.patientName)} cursor-pointer bg-[#F8FAFC]`} onClick={() => setShowPatientPicker(true)} />
                      <button type="button" onClick={() => setShowPatientPicker(true)} className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00C6FF] to-[#0072FF] text-white text-sm font-semibold hover:brightness-110 active:scale-[0.98] transition-all flex items-center gap-2">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                        เลือก
                      </button>
                    </div>
                  </FormField>
                </div>
              </FormSection>

              {/* ─── Section: รายละเอียดนัดหมาย ─── */}
              <FormSection title="รายละเอียดนัดหมาย" icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0072FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              }>
                <FormField label="วันที่" required error={formErrors.date}>
                  <input id="input-date" type="date" value={formData.date} onChange={(e) => updateField("date", e.target.value)} className={inputClass(formErrors.date)} />
                </FormField>
                <FormField label="เวลาเริ่มต้น" required error={formErrors.timeStart}>
                  <input id="input-timeStart" type="time" value={formData.timeStart} onChange={(e) => updateField("timeStart", e.target.value)} className={inputClass(formErrors.timeStart)} />
                </FormField>
                <FormField label="เวลาสิ้นสุด" required error={formErrors.timeEnd}>
                  <input id="input-timeEnd" type="time" value={formData.timeEnd} onChange={(e) => updateField("timeEnd", e.target.value)} className={inputClass(formErrors.timeEnd)} />
                </FormField>
                <FormField label="ห้อง" required error={formErrors.room}>
                  <select value={formData.room} onChange={(e) => updateField("room", e.target.value)} className={inputClass(formErrors.room)}>
                    <option value="">-- เลือกห้อง --</option>
                    {roomOptions.map((r) => (<option key={r} value={r}>{r}</option>))}
                  </select>
                </FormField>
                <FormField label="ทันตแพทย์" required error={formErrors.dentist}>
                  <select value={formData.dentist} onChange={(e) => updateField("dentist", e.target.value)} className={inputClass(formErrors.dentist)}>
                    <option value="">-- เลือกทันตแพทย์ --</option>
                    {dentistOptions.map((d) => (<option key={d} value={d}>{d}</option>))}
                  </select>
                </FormField>
                <FormField label="สาขา">
                  <select value={formData.branch} onChange={(e) => updateField("branch", e.target.value)} className={inputClass()}>
                    {branchOptions.filter((b) => b !== "ทั้งหมด").map((b) => (<option key={b} value={b}>{b}</option>))}
                  </select>
                </FormField>
                <FormField label="ชื่อโครงการ/การรักษา">
                  <input type="text" value={formData.projectName} onChange={(e) => updateField("projectName", e.target.value)} placeholder="ระบุชื่อโครงการหรือการรักษา" className={inputClass()} />
                </FormField>
                {modalMode === "edit" && (
                  <FormField label="สถานะ">
                    <select value={formData.status} onChange={(e) => updateField("status", e.target.value)} className={inputClass()}>
                      {statusOptions.filter((s) => s !== "ทั้งหมด").map((s) => (<option key={s} value={s}>{s}</option>))}
                    </select>
                  </FormField>
                )}
                <div className="col-span-full">
                  <FormField label="CC / หมายเหตุ">
                    <textarea value={formData.cc} onChange={(e) => updateField("cc", e.target.value)} placeholder="รายละเอียดเพิ่มเติม หรือ Chief Complaint" rows={3} className={`${inputClass()} resize-none`} />
                  </FormField>
                </div>
              </FormSection>
            </div>
            {/* Footer */}
            <div className="flex items-center justify-between px-8 py-5 border-t border-[#E2E8F0] flex-shrink-0">
              <p className="text-xs text-[#94A3B8]"><span className="text-red-400">*</span> จำเป็นต้องกรอก</p>
              <div className="flex gap-3">
                <button onClick={() => { setModalMode("closed"); setSelectedAppointment(null); }} className="px-5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm font-semibold text-[#475569] hover:bg-[#F1F5F9] transition-all">ยกเลิก</button>
                <button id="btn-save-appointment" onClick={handleSave} disabled={saveSuccess} className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg active:scale-[0.98] ${saveSuccess ? "bg-green-500 text-white shadow-green-500/20" : "bg-gradient-to-r from-[#00C6FF] to-[#0072FF] text-white shadow-[#0072FF]/20 hover:shadow-xl hover:brightness-110"}`}>
                  {saveSuccess ? (
                    <><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>บันทึกสำเร็จ</>
                  ) : (
                    <><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>บันทึก</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Patient Selection Modal ─── */}
      {showPatientPicker && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl mx-4 max-h-[85vh] flex flex-col" style={{ animation: "modal-pop 0.25s ease-out" }}>
            <div className="flex items-center justify-between px-8 py-5 border-b border-[#E2E8F0] flex-shrink-0">
              <div>
                <h3 className="text-lg font-bold text-[#1E293B]">เลือกคนไข้</h3>
                <p className="text-sm text-[#64748B] mt-0.5">ค้นหาและเลือกคนไข้จากรายชื่อ</p>
              </div>
              <button onClick={() => { setShowPatientPicker(false); setPatientSearch(""); }} className="p-2 rounded-lg hover:bg-[#F1F5F9] transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div className="px-8 py-4 border-b border-[#E2E8F0]">
              <div className="relative">
                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input type="text" value={patientSearch} onChange={(e) => setPatientSearch(e.target.value)} placeholder="ค้นหาด้วย HN, ชื่อ, เบอร์โทร, เลขบัตร ปชช...." className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#E2E8F0] text-sm text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#00C6FF]/30 focus:border-[#00C6FF] transition-all" autoFocus />
              </div>
            </div>
            <div className="overflow-y-auto flex-1">
              <table className="w-full">
                <thead className="sticky top-0">
                  <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wider">HN</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wider">ชื่อ-นามสกุล</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wider">เบอร์โทร</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wider">เพศ</th>
                    <th className="text-center px-6 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wider">เลือก</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9]">
                  {filteredPatients.map((p, i) => (
                    <tr key={p.id} className={`${i % 2 === 1 ? "bg-[#F8FAFC]" : "bg-white"} hover:bg-[#E0EAFF]/30 transition-colors cursor-pointer`} onClick={() => selectPatient(p)}>
                      <td className="px-6 py-3 text-sm font-mono font-medium text-[#2B5998]">{p.hn}</td>
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00C6FF]/20 to-[#0072FF]/20 flex items-center justify-center text-[#0072FF] text-xs font-bold flex-shrink-0">{p.name.charAt(0)}</div>
                          <span className="text-sm font-medium text-[#1E293B]">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-3 text-sm text-[#475569]">{p.phone}</td>
                      <td className="px-6 py-3 text-sm text-[#475569]">{p.gender}</td>
                      <td className="px-6 py-3 text-center">
                        <button onClick={(e) => { e.stopPropagation(); selectPatient(p); }} className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#00C6FF] to-[#0072FF] text-white text-xs font-semibold hover:brightness-110 active:scale-[0.95] transition-all">เลือก</button>
                      </td>
                    </tr>
                  ))}
                  {filteredPatients.length === 0 && (
                    <tr><td colSpan={5} className="px-6 py-12 text-center"><p className="text-sm text-[#94A3B8]">ไม่พบข้อมูลคนไข้</p></td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ═══ Modal Animation Style ═══ */}
      <style>{`
        @keyframes modal-pop {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// Sub-components
// ═══════════════════════════════════════════════════════════

function FormSection({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <h4 className="text-sm font-bold text-[#1E293B] uppercase tracking-wide">{title}</h4>
        <div className="flex-1 h-px bg-[#E2E8F0]" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">{children}</div>
    </div>
  );
}

function FormField({ label, required, error, children }: { label: string; required?: boolean; error?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wide">
        {label}{required && <span className="text-red-400 ml-1">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-400 mt-0.5">กรุณากรอกข้อมูล</p>}
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wide mb-1">{label}</p>
      <p className="text-sm text-[#1E293B] font-medium">{value}</p>
    </div>
  );
}

function inputClass(error?: boolean) {
  return `w-full px-3.5 py-2.5 rounded-xl bg-white border text-sm text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#00C6FF]/30 focus:border-[#00C6FF] transition-all ${error ? "border-red-400 ring-2 ring-red-400/20" : "border-[#E2E8F0]"}`;
}
