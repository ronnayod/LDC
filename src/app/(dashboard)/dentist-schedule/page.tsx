"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";

// ─── Types ─────────────────────────────────────────────
interface DentistSchedule {
  id: string;
  dentistId: string;
  dentistName: string;
  room: string;
  dayOfWeek: number; // 0=อาทิตย์, 1=จันทร์, ...
  timeStart: string;
  timeEnd: string;
  month: number; // 0-based (0=มกราคม)
  year: number;
  color: string;
}

interface DentistOption {
  id: string;
  name: string;
  specialty: string;
}

// ─── Constants ─────────────────────────────────────────
const ROOMS = ["SNO1", "SNO2", "SNO3", "SNO4", "SNO5", "SNO6", "SNO7"];

const ROOM_COLORS: Record<string, { bg: string; bgLight: string; text: string; border: string; dot: string }> = {
  SNO1: { bg: "bg-blue-500", bgLight: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", dot: "bg-blue-500" },
  SNO2: { bg: "bg-emerald-500", bgLight: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-500" },
  SNO3: { bg: "bg-slate-400", bgLight: "bg-slate-50", text: "text-slate-700", border: "border-slate-200", dot: "bg-slate-400" },
  SNO4: { bg: "bg-amber-500", bgLight: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", dot: "bg-amber-500" },
  SNO5: { bg: "bg-red-500", bgLight: "bg-red-50", text: "text-red-700", border: "border-red-200", dot: "bg-red-500" },
  SNO6: { bg: "bg-purple-500", bgLight: "bg-purple-50", text: "text-purple-700", border: "border-purple-200", dot: "bg-purple-500" },
  SNO7: { bg: "bg-cyan-500", bgLight: "bg-cyan-50", text: "text-cyan-700", border: "border-cyan-200", dot: "bg-cyan-500" },
};

const ROOM_HEX: Record<string, string> = {
  SNO1: "#3B82F6",
  SNO2: "#10B981",
  SNO3: "#94A3B8",
  SNO4: "#F59E0B",
  SNO5: "#EF4444",
  SNO6: "#8B5CF6",
  SNO7: "#06B6D4",
};

const THAI_DAYS_FULL = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];
const THAI_DAYS_SHORT = ["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."];
const THAI_MONTHS = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];

const HOURS = Array.from({ length: 13 }, (_, i) => i + 8); // 08:00 - 20:00

const dentistOptions: DentistOption[] = [
  { id: "D1", name: "ทพญ. แพรวพรรณ สุขใจ", specialty: "ทันตกรรมทั่วไป" },
  { id: "D2", name: "ทพ. ศรัณย์ มาทำนา", specialty: "อุดฟัน / ถอนฟัน" },
  { id: "D3", name: "ทพญ. แดนสนรยา มาทำนา", specialty: "รักษารากฟัน" },
  { id: "D4", name: "ทพ. ณัฐพล ชัยยง", specialty: "จัดฟัน" },
  { id: "D5", name: "ทพญ. กมลชนก ศรีสุข", specialty: "ทันตกรรมสำหรับเด็ก" },
  { id: "D6", name: "ทพ. กิตติ วงศ์ใหญ่", specialty: "ศัลยกรรมช่องปาก" },
];

// ─── Mock data ─────────────────────────────────────────
const now = new Date();
const currentMonth = now.getMonth();
const currentYear = now.getFullYear();

const initialSchedules: DentistSchedule[] = [
  { id: "1", dentistId: "D1", dentistName: "ทพญ. แพรวพรรณ สุขใจ", room: "SNO1", dayOfWeek: 1, timeStart: "09:00", timeEnd: "12:00", month: currentMonth, year: currentYear, color: "#3B82F6" },
  { id: "2", dentistId: "D1", dentistName: "ทพญ. แพรวพรรณ สุขใจ", room: "SNO1", dayOfWeek: 3, timeStart: "09:00", timeEnd: "12:00", month: currentMonth, year: currentYear, color: "#3B82F6" },
  { id: "3", dentistId: "D1", dentistName: "ทพญ. แพรวพรรณ สุขใจ", room: "SNO1", dayOfWeek: 5, timeStart: "09:00", timeEnd: "12:00", month: currentMonth, year: currentYear, color: "#3B82F6" },
  { id: "4", dentistId: "D2", dentistName: "ทพ. ศรัณย์ มาทำนา", room: "SNO2", dayOfWeek: 1, timeStart: "09:00", timeEnd: "16:00", month: currentMonth, year: currentYear, color: "#10B981" },
  { id: "5", dentistId: "D2", dentistName: "ทพ. ศรัณย์ มาทำนา", room: "SNO2", dayOfWeek: 2, timeStart: "09:00", timeEnd: "16:00", month: currentMonth, year: currentYear, color: "#10B981" },
  { id: "6", dentistId: "D2", dentistName: "ทพ. ศรัณย์ มาทำนา", room: "SNO2", dayOfWeek: 4, timeStart: "13:00", timeEnd: "18:00", month: currentMonth, year: currentYear, color: "#10B981" },
  { id: "7", dentistId: "D3", dentistName: "ทพญ. แดนสนรยา มาทำนา", room: "SNO3", dayOfWeek: 2, timeStart: "10:00", timeEnd: "15:00", month: currentMonth, year: currentYear, color: "#94A3B8" },
  { id: "8", dentistId: "D3", dentistName: "ทพญ. แดนสนรยา มาทำนา", room: "SNO3", dayOfWeek: 4, timeStart: "09:00", timeEnd: "14:00", month: currentMonth, year: currentYear, color: "#94A3B8" },
  { id: "9", dentistId: "D4", dentistName: "ทพ. ณัฐพล ชัยยง", room: "SNO4", dayOfWeek: 1, timeStart: "13:00", timeEnd: "18:00", month: currentMonth, year: currentYear, color: "#F59E0B" },
  { id: "10", dentistId: "D4", dentistName: "ทพ. ณัฐพล ชัยยง", room: "SNO4", dayOfWeek: 3, timeStart: "13:00", timeEnd: "18:00", month: currentMonth, year: currentYear, color: "#F59E0B" },
  { id: "11", dentistId: "D5", dentistName: "ทพญ. กมลชนก ศรีสุข", room: "SNO5", dayOfWeek: 3, timeStart: "09:00", timeEnd: "12:00", month: currentMonth, year: currentYear, color: "#EF4444" },
  { id: "12", dentistId: "D5", dentistName: "ทพญ. กมลชนก ศรีสุข", room: "SNO5", dayOfWeek: 5, timeStart: "13:00", timeEnd: "17:00", month: currentMonth, year: currentYear, color: "#EF4444" },
  { id: "13", dentistId: "D6", dentistName: "ทพ. กิตติ วงศ์ใหญ่", room: "SNO6", dayOfWeek: 2, timeStart: "09:00", timeEnd: "12:00", month: currentMonth, year: currentYear, color: "#8B5CF6" },
  { id: "14", dentistId: "D6", dentistName: "ทพ. กิตติ วงศ์ใหญ่", room: "SNO6", dayOfWeek: 5, timeStart: "09:00", timeEnd: "14:00", month: currentMonth, year: currentYear, color: "#8B5CF6" },
  { id: "15", dentistId: "D1", dentistName: "ทพญ. แพรวพรรณ สุขใจ", room: "SNO7", dayOfWeek: 4, timeStart: "09:00", timeEnd: "12:00", month: currentMonth, year: currentYear, color: "#06B6D4" },
  { id: "16", dentistId: "D3", dentistName: "ทพญ. แดนสนรยา มาทำนา", room: "SNO1", dayOfWeek: 2, timeStart: "13:00", timeEnd: "17:00", month: currentMonth, year: currentYear, color: "#3B82F6" },
  { id: "17", dentistId: "D4", dentistName: "ทพ. ณัฐพล ชัยยง", room: "SNO7", dayOfWeek: 6, timeStart: "09:00", timeEnd: "13:00", month: currentMonth, year: currentYear, color: "#06B6D4" },
];

type ModalMode = "closed" | "add" | "edit" | "delete" | "view";
type ViewMode = "day" | "week";

const emptyForm = {
  dentistId: "",
  dentistName: "",
  month: currentMonth,
  year: currentYear,
  selectedDays: [] as number[],
  room: "",
  timeStart: "",
  timeEnd: "",
};

// ─── Helper: time string to hour offset ────────────────
function timeToHour(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h + m / 60;
}

export default function DentistSchedulePage() {
  // ─── State ────────────────────────────────────────────
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const [schedules, setSchedules] = useState<DentistSchedule[]>(initialSchedules);
  const [viewMode, setViewMode] = useState<ViewMode>("week");
  const [viewDate, setViewDate] = useState(new Date());
  const [search, setSearch] = useState("");
  const [dentistFilter, setDentistFilter] = useState("ทั้งหมด");

  // Modal
  const [modalMode, setModalMode] = useState<ModalMode>("closed");
  const [selectedSchedule, setSelectedSchedule] = useState<DentistSchedule | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState<Record<string, boolean>>({});
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Context menu on schedule block
  const [contextMenu, setContextMenu] = useState<{ id: string; x: number; y: number } | null>(null);
  const contextRef = useRef<HTMLDivElement>(null);

  // Close context menu on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (contextRef.current && !contextRef.current.contains(e.target as Node)) {
        setContextMenu(null);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // ─── View Date Helpers ────────────────────────────────
  const viewYear = viewDate.getFullYear();
  const viewMonth = viewDate.getMonth();
  const viewDay = viewDate.getDay(); // 0=Sun

  // Get Monday of current week
  const getWeekStart = useCallback((date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday
    return new Date(d.setDate(diff));
  }, []);

  const weekStart = useMemo(() => getWeekStart(viewDate), [viewDate, getWeekStart]);

  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(weekStart);
      d.setDate(d.getDate() + i);
      return d;
    });
  }, [weekStart]);

  const goToday = () => setViewDate(new Date());
  const goPrev = () => {
    const d = new Date(viewDate);
    if (viewMode === "week") d.setDate(d.getDate() - 7);
    else d.setDate(d.getDate() - 1);
    setViewDate(d);
  };
  const goNext = () => {
    const d = new Date(viewDate);
    if (viewMode === "week") d.setDate(d.getDate() + 7);
    else d.setDate(d.getDate() + 1);
    setViewDate(d);
  };

  // ─── Filter schedules ────────────────────────────────
  const filteredSchedules = useMemo(() => {
    return schedules.filter((s) => {
      const matchSearch =
        s.dentistName.toLowerCase().includes(search.toLowerCase()) ||
        s.room.toLowerCase().includes(search.toLowerCase());
      const matchDentist = dentistFilter === "ทั้งหมด" || s.dentistName === dentistFilter;
      return matchSearch && matchDentist;
    });
  }, [schedules, search, dentistFilter]);

  // ─── Get schedules for a specific day ─────────────────
  const getSchedulesForDay = useCallback(
    (dayOfWeek: number, month: number, year: number) => {
      return filteredSchedules.filter(
        (s) => s.dayOfWeek === dayOfWeek && s.month === month && s.year === year
      );
    },
    [filteredSchedules]
  );

  // ─── Get schedules for a room on a day ────────────────
  const getSchedulesForRoomDay = useCallback(
    (room: string, dayOfWeek: number, month: number, year: number) => {
      return filteredSchedules.filter(
        (s) => s.room === room && s.dayOfWeek === dayOfWeek && s.month === month && s.year === year
      );
    },
    [filteredSchedules]
  );

  // ─── Format helpers ───────────────────────────────────
  const formatDateHeader = (date: Date) => {
    const day = date.getDate();
    const month = THAI_MONTHS[date.getMonth()];
    const year = date.getFullYear() + 543;
    return `${day} ${month} ${year}`;
  };

  const formatWeekRange = () => {
    const start = weekDays[0];
    const end = weekDays[6];
    const sameMonth = start.getMonth() === end.getMonth();
    if (sameMonth) {
      return `${start.getDate()} - ${end.getDate()} ${THAI_MONTHS[start.getMonth()]} ${start.getFullYear() + 543}`;
    }
    return `${start.getDate()} ${THAI_MONTHS[start.getMonth()]} - ${end.getDate()} ${THAI_MONTHS[end.getMonth()]} ${end.getFullYear() + 543}`;
  };

  const todayStr = now.toISOString().split("T")[0];

  const isToday = (date: Date) => {
    return date.toISOString().split("T")[0] === todayStr;
  };

  // ─── CRUD Handlers ───────────────────────────────────
  const openAdd = (preRoom?: string, preDayOfWeek?: number) => {
    setFormData({
      ...emptyForm,
      room: preRoom || "",
      selectedDays: preDayOfWeek !== undefined ? [preDayOfWeek] : [],
      month: viewDate.getMonth(),
      year: viewDate.getFullYear(),
    });
    setFormErrors({});
    setModalMode("add");
    setContextMenu(null);
  };

  const openEdit = (s: DentistSchedule) => {
    setSelectedSchedule(s);
    setFormData({
      dentistId: s.dentistId,
      dentistName: s.dentistName,
      month: s.month,
      year: s.year,
      selectedDays: [s.dayOfWeek],
      room: s.room,
      timeStart: s.timeStart,
      timeEnd: s.timeEnd,
    });
    setFormErrors({});
    setModalMode("edit");
    setContextMenu(null);
  };

  const openView = (s: DentistSchedule) => {
    setSelectedSchedule(s);
    setModalMode("view");
    setContextMenu(null);
  };

  const openDelete = (s: DentistSchedule) => {
    setSelectedSchedule(s);
    setModalMode("delete");
    setContextMenu(null);
  };

  const updateField = (field: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) setFormErrors((prev) => ({ ...prev, [field]: false }));
  };

  const toggleDay = (day: number) => {
    setFormData((prev) => {
      const days = prev.selectedDays.includes(day)
        ? prev.selectedDays.filter((d) => d !== day)
        : [...prev.selectedDays, day];
      return { ...prev, selectedDays: days };
    });
    if (formErrors.selectedDays) setFormErrors((prev) => ({ ...prev, selectedDays: false }));
  };

  const validateForm = () => {
    const errors: Record<string, boolean> = {};
    if (!formData.dentistId) errors.dentistId = true;
    if (!formData.room) errors.room = true;
    if (formData.selectedDays.length === 0) errors.selectedDays = true;
    if (!formData.timeStart) errors.timeStart = true;
    if (!formData.timeEnd) errors.timeEnd = true;
    if (formData.timeStart && formData.timeEnd && formData.timeStart >= formData.timeEnd) errors.timeEnd = true;
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const dentist = dentistOptions.find((d) => d.id === formData.dentistId);
    if (!dentist) return;

    const roomColor = ROOM_HEX[formData.room] || "#3B82F6";

    if (modalMode === "add") {
      const newSchedules: DentistSchedule[] = formData.selectedDays.map((day) => ({
        id: String(Date.now()) + "-" + day,
        dentistId: formData.dentistId,
        dentistName: dentist.name,
        room: formData.room,
        dayOfWeek: day,
        timeStart: formData.timeStart,
        timeEnd: formData.timeEnd,
        month: formData.month,
        year: formData.year,
        color: roomColor,
      }));
      setSchedules((prev) => [...prev, ...newSchedules]);
    } else if (modalMode === "edit" && selectedSchedule) {
      setSchedules((prev) =>
        prev.map((s) =>
          s.id === selectedSchedule.id
            ? {
              ...s,
              dentistId: formData.dentistId,
              dentistName: dentist.name,
              room: formData.room,
              dayOfWeek: formData.selectedDays[0],
              timeStart: formData.timeStart,
              timeEnd: formData.timeEnd,
              month: formData.month,
              year: formData.year,
              color: roomColor,
            }
            : s
        )
      );
    }

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setModalMode("closed");
      setSelectedSchedule(null);
    }, 800);
  };

  const handleDelete = () => {
    if (selectedSchedule) {
      setSchedules((prev) => prev.filter((s) => s.id !== selectedSchedule.id));
    }
    setModalMode("closed");
    setSelectedSchedule(null);
  };

  const handleBlockContextMenu = (e: React.MouseEvent, schedule: DentistSchedule) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      id: schedule.id,
      x: Math.min(e.clientX, window.innerWidth - 200),
      y: Math.min(e.clientY, window.innerHeight - 200),
    });
  };

  const handleBlockClick = (schedule: DentistSchedule) => {
    if (contextMenu) {
      setContextMenu(null);
    } else {
      openView(schedule);
    }
  };

  // ─── Schedule Block Component ─────────────────────────
  const ScheduleBlock = ({ schedule, hourHeight }: { schedule: DentistSchedule; hourHeight: number }) => {
    const startHour = timeToHour(schedule.timeStart);
    const endHour = timeToHour(schedule.timeEnd);
    const top = (startHour - 8) * hourHeight;
    const height = (endHour - startHour) * hourHeight;
    const rc = ROOM_COLORS[schedule.room] || ROOM_COLORS.SNO1;

    return (
      <div
        className={`absolute left-1 right-1 rounded-lg ${rc.bgLight} ${rc.border} border cursor-pointer overflow-hidden group/block transition-all duration-200 hover:shadow-md hover:z-10 hover:scale-[1.02]`}
        style={{ top: `${top}px`, height: `${height}px`, minHeight: "28px" }}
        onClick={() => handleBlockClick(schedule)}
        onContextMenu={(e) => handleBlockContextMenu(e, schedule)}
        title={`${schedule.dentistName}\n${schedule.timeStart} - ${schedule.timeEnd}\nห้อง ${schedule.room}`}
      >
        <div className={`h-full px-2 py-1.5 flex flex-col justify-start`}>
          <div className="flex items-center gap-1">
            <span className={`w-1.5 h-1.5 rounded-full ${rc.dot} flex-shrink-0`} />
            <span className={`text-[10px] font-bold ${rc.text} truncate leading-tight`}>
              {schedule.dentistName.length > 12 ? schedule.dentistName.slice(0, 12) + "..." : schedule.dentistName}
            </span>
          </div>
          {height > 40 && (
            <span className={`text-[9px] ${rc.text} opacity-70 mt-0.5`}>
              {schedule.timeStart}-{schedule.timeEnd}
            </span>
          )}
        </div>
        {/* Hover action buttons */}
        <div className="absolute top-1 right-1 flex gap-0.5 opacity-0 group-hover/block:opacity-100 transition-opacity">
          <button
            onClick={(e) => { e.stopPropagation(); openEdit(schedule); }}
            className="w-5 h-5 rounded bg-white/90 shadow-sm flex items-center justify-center hover:bg-white transition-colors"
            title="แก้ไข"
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); openDelete(schedule); }}
            className="w-5 h-5 rounded bg-white/90 shadow-sm flex items-center justify-center hover:bg-red-50 transition-colors"
            title="ลบ"
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
          </button>
        </div>
      </div>
    );
  };

  // ─── Render ───────────────────────────────────────────
  if (!isMounted) {
    return null;
  }

  return (
    <div className="space-y-5">
      {/* ═══ Header ═══ */}
      <div className="flex items-center justify-between animate-fade-in">
        <div>
          <h2 className="text-2xl font-bold text-[#1E293B]">ตารางลงตรวจทันตแพทย์</h2>
          <p className="text-sm text-[#64748B] mt-0.5">จัดการตารางเวลาลงตรวจของทันตแพทย์</p>
        </div>
        <button
          id="btn-add-schedule"
          onClick={() => openAdd()}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00C6FF] to-[#0072FF] text-white font-semibold text-sm shadow-lg shadow-[#0072FF]/20 hover:shadow-xl hover:brightness-110 active:scale-[0.98] transition-all duration-200"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          วันลงตรวจ
        </button>
      </div>

      {/* ═══ Controls Bar ═══ */}
      <div className="flex flex-wrap items-center gap-3 animate-fade-in">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px] max-w-sm">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          <input
            id="input-search-schedule"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ค้นหาชื่อทันตแพทย์"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#E2E8F0] text-sm text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#00C6FF]/30 focus:border-[#00C6FF] transition-all"
          />
        </div>

        {/* Today Button */}
        <button
          onClick={goToday}
          className="px-4 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-sm font-medium text-[#475569] hover:bg-[#F1F5F9] transition-all"
        >
          วันนี้
        </button>

        {/* Navigation */}
        <div className="flex items-center gap-1">
          <button onClick={goPrev} className="p-2.5 rounded-xl border border-[#E2E8F0] bg-white hover:bg-[#F1F5F9] transition-all" title="ก่อนหน้า">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
          </button>
          <button onClick={goNext} className="p-2.5 rounded-xl border border-[#E2E8F0] bg-white hover:bg-[#F1F5F9] transition-all" title="ถัดไป">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
          </button>
        </div>

        {/* Date Label */}
        <span className="text-sm font-semibold text-[#1E293B] min-w-[200px]">
          {viewMode === "week" ? formatWeekRange() : formatDateHeader(viewDate)}
        </span>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Dentist Filter */}
        <select
          id="filter-dentist"
          value={dentistFilter}
          onChange={(e) => setDentistFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl bg-white border border-[#E2E8F0] text-sm text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#00C6FF]/30 cursor-pointer"
        >
          <option value="ทั้งหมด">ทันตแพทย์: ทั้งหมด</option>
          {dentistOptions.map((d) => (
            <option key={d.id} value={d.name}>{d.name}</option>
          ))}
        </select>

        {/* View Mode Toggle */}
        <div className="flex gap-1 bg-white rounded-xl p-1 shadow-sm border border-[#E2E8F0]">
          <button
            onClick={() => setViewMode("day")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${viewMode === "day" ? "bg-gradient-to-r from-[#00C6FF] to-[#0072FF] text-white shadow-sm" : "text-[#64748B] hover:text-[#1E293B] hover:bg-[#F1F5F9]"}`}
          >
            วัน
          </button>
          <button
            onClick={() => setViewMode("week")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${viewMode === "week" ? "bg-gradient-to-r from-[#00C6FF] to-[#0072FF] text-white shadow-sm" : "text-[#64748B] hover:text-[#1E293B] hover:bg-[#F1F5F9]"}`}
          >
            สัปดาห์
          </button>
        </div>
      </div>

      {/* ═══ Room Color Legend ═══ */}
      <div className="flex items-center gap-4 px-1 animate-fade-in">
        <span className="text-xs text-[#94A3B8] font-medium">ห้องตรวจ:</span>
        {ROOMS.map((room) => {
          const rc = ROOM_COLORS[room];
          return (
            <div key={room} className="flex items-center gap-1.5">
              <span className={`w-3 h-3 rounded ${rc.dot}`} />
              <span className="text-xs font-medium text-[#475569]">{room}</span>
            </div>
          );
        })}
      </div>

      {/* ═══════════════════════════════════════════════════
           WEEKLY VIEW
         ═══════════════════════════════════════════════════ */}
      {viewMode === "week" && (
        <div className="bg-white rounded-2xl shadow-sm border border-[#E2E8F0] overflow-hidden animate-fade-in">
          <div className="overflow-x-auto">
            <div className="min-w-[900px]">
              {/* Room Column Headers */}
              <div className="grid grid-cols-[70px_repeat(7,1fr)] sticky top-0 z-20">
                {/* Time Label Corner */}
                <div className="bg-[#F8FAFC] border-b border-r border-[#E2E8F0] p-3 flex items-center justify-center">
                  <span className="text-xs font-semibold text-[#94A3B8]">เวลา</span>
                </div>
                {/* Room Headers with Color Bars */}
                {ROOMS.map((room) => {
                  const rc = ROOM_COLORS[room];
                  return (
                    <div key={room} className="border-b border-r border-[#E2E8F0] last:border-r-0">
                      <div className={`h-1.5 ${rc.bg}`} />
                      <div className="px-3 py-2.5 bg-[#F8FAFC]">
                        <div className="flex items-center justify-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${rc.dot}`} />
                          <span className="text-sm font-bold text-[#1E293B]">{room}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Timeline Grid */}
              <div className="grid grid-cols-[70px_repeat(7,1fr)] relative">
                {/* Time Labels */}
                <div className="border-r border-[#E2E8F0]">
                  {HOURS.map((hour) => (
                    <div key={hour} className="h-[60px] border-b border-[#F1F5F9] flex items-start justify-end pr-3 pt-1">
                      <span className="text-[11px] font-medium text-[#94A3B8]">
                        {String(hour).padStart(2, "0")}:00 น.
                      </span>
                    </div>
                  ))}
                </div>

                {/* Room Columns */}
                {ROOMS.map((room) => (
                  <div key={room} className="border-r border-[#E2E8F0] last:border-r-0 relative">
                    {/* Hour Grid Lines */}
                    {HOURS.map((hour) => (
                      <div
                        key={hour}
                        className="h-[60px] border-b border-[#F1F5F9] hover:bg-[#F8FAFC]/50 transition-colors cursor-pointer"
                        onClick={() => openAdd(room)}
                      >
                        {/* Half-hour line */}
                        <div className="h-1/2 border-b border-dashed border-[#F1F5F9]/80" />
                      </div>
                    ))}
                    {/* Schedule Blocks for this room across all week days */}
                    {weekDays.map((date) => {
                      const daySchedules = getSchedulesForRoomDay(room, date.getDay(), date.getMonth(), date.getFullYear());
                      return daySchedules.map((s) => (
                        <ScheduleBlock key={s.id} schedule={s} hourHeight={60} />
                      ));
                    })}
                    {/* Also show schedules that match any day regardless of specific date */}
                    {filteredSchedules
                      .filter((s) => s.room === room && s.month === viewMonth && s.year === viewYear)
                      .filter((s, _i, arr) => {
                        // Deduplicate - only keep schedules not already shown by weekDays
                        const weekDayNums = weekDays.map(d => d.getDay());
                        return weekDayNums.includes(s.dayOfWeek);
                      })
                      .filter((value, index, self) => self.findIndex(v => v.id === value.id) === index)
                      .map((s) => (
                        <ScheduleBlock key={`week-${s.id}`} schedule={s} hourHeight={60} />
                      ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════
           DAILY VIEW
         ═══════════════════════════════════════════════════ */}
      {viewMode === "day" && (
        <div className="bg-white rounded-2xl shadow-sm border border-[#E2E8F0] overflow-hidden animate-fade-in">
          {/* Day Header */}
          <div className="px-6 py-3 bg-gradient-to-r from-[#F8FAFC] to-white border-b border-[#E2E8F0]">
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-sm font-bold ${isToday(viewDate) ? "bg-gradient-to-r from-[#00C6FF] to-[#0072FF] text-white" : "bg-[#F1F5F9] text-[#475569]"}`}>
                {viewDate.getDate()}
              </span>
              <div>
                <span className="text-sm font-semibold text-[#1E293B]">
                  {THAI_DAYS_FULL[viewDate.getDay()]}
                </span>
                <span className="text-xs text-[#94A3B8] ml-2">
                  {formatDateHeader(viewDate)}
                </span>
              </div>
              {isToday(viewDate) && (
                <span className="ml-2 text-[10px] font-bold text-white bg-gradient-to-r from-[#00C6FF] to-[#0072FF] px-2 py-0.5 rounded-full">วันนี้</span>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[900px]">
              {/* Room Column Headers */}
              <div className="grid grid-cols-[70px_repeat(7,1fr)] sticky top-0 z-20">
                <div className="bg-[#F8FAFC] border-b border-r border-[#E2E8F0] p-3 flex items-center justify-center">
                  <span className="text-xs font-semibold text-[#94A3B8]">เวลา</span>
                </div>
                {ROOMS.map((room) => {
                  const rc = ROOM_COLORS[room];
                  return (
                    <div key={room} className="border-b border-r border-[#E2E8F0] last:border-r-0">
                      <div className={`h-1.5 ${rc.bg}`} />
                      <div className="px-3 py-2.5 bg-[#F8FAFC]">
                        <div className="flex items-center justify-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${rc.dot}`} />
                          <span className="text-sm font-bold text-[#1E293B]">{room}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Timeline Grid */}
              <div className="grid grid-cols-[70px_repeat(7,1fr)] relative">
                {/* Time Labels */}
                <div className="border-r border-[#E2E8F0]">
                  {HOURS.map((hour) => (
                    <div key={hour} className="h-[60px] border-b border-[#F1F5F9] flex items-start justify-end pr-3 pt-1">
                      <span className="text-[11px] font-medium text-[#94A3B8]">
                        {String(hour).padStart(2, "0")}:00 น.
                      </span>
                    </div>
                  ))}
                </div>

                {/* Room Columns */}
                {ROOMS.map((room) => {
                  const daySchedules = getSchedulesForRoomDay(room, viewDate.getDay(), viewDate.getMonth(), viewDate.getFullYear());
                  return (
                    <div key={room} className="border-r border-[#E2E8F0] last:border-r-0 relative">
                      {HOURS.map((hour) => (
                        <div
                          key={hour}
                          className="h-[60px] border-b border-[#F1F5F9] hover:bg-[#F8FAFC]/50 transition-colors cursor-pointer"
                          onClick={() => openAdd(room, viewDate.getDay())}
                        >
                          <div className="h-1/2 border-b border-dashed border-[#F1F5F9]/80" />
                        </div>
                      ))}
                      {daySchedules.map((s) => (
                        <ScheduleBlock key={s.id} schedule={s} hourHeight={60} />
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════
           CONTEXT MENU
         ═══════════════════════════════════════════════════ */}
      {contextMenu && (
        <div
          ref={contextRef}
          className="fixed z-[90] w-48 bg-white rounded-xl shadow-xl border border-[#E2E8F0] py-1.5 animate-fade-in"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          {(() => {
            const s = schedules.find((s) => s.id === contextMenu.id);
            if (!s) return null;
            return (
              <>
                <button
                  onClick={() => openView(s)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0072FF] transition-colors"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                  รายละเอียด
                </button>
                <button
                  onClick={() => openEdit(s)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0072FF] transition-colors"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                  แก้ไข
                </button>
                <div className="border-t border-[#F1F5F9] my-1" />
                <button
                  onClick={() => openDelete(s)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                  ลบ
                </button>
              </>
            );
          })()}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
           MODALS
         ═══════════════════════════════════════════════════════════════ */}

      {/* ─── Delete Confirmation Modal ─── */}
      {modalMode === "delete" && selectedSchedule && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl mx-4" style={{ animation: "modal-pop 0.25s ease-out" }}>
            <div className="flex justify-center mb-5">
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
              </div>
            </div>
            <h3 className="text-xl font-bold text-[#1E293B] text-center mb-2">ยืนยันการลบตารางลงตรวจ?</h3>
            <p className="text-sm text-[#64748B] text-center mb-8">
              คุณแน่ใจหรือไม่ว่าต้องการลบตารางของ<br />
              <span className="font-semibold text-[#1E293B]">{selectedSchedule.dentistName}</span><br />
              วัน{THAI_DAYS_FULL[selectedSchedule.dayOfWeek]} เวลา {selectedSchedule.timeStart} - {selectedSchedule.timeEnd} ห้อง {selectedSchedule.room}<br />
              <span className="text-red-400 text-xs mt-2 block">การดำเนินการนี้ไม่สามารถย้อนกลับได้</span>
            </p>
            <div className="flex gap-3">
              <button id="btn-cancel-delete" onClick={() => { setModalMode("closed"); setSelectedSchedule(null); }} className="flex-1 px-5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm font-semibold text-[#475569] hover:bg-[#F1F5F9] transition-all">ยกเลิก</button>
              <button id="btn-confirm-delete" onClick={handleDelete} className="flex-1 px-5 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 active:scale-[0.98] transition-all shadow-lg shadow-red-500/20">ยืนยันลบ</button>
            </div>
          </div>
        </div>
      )}

      {/* ─── View Detail Modal ─── */}
      {modalMode === "view" && selectedSchedule && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl mx-4 max-h-[90vh] flex flex-col" style={{ animation: "modal-pop 0.25s ease-out" }}>
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-5 border-b border-[#E2E8F0] flex-shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: selectedSchedule.color + "20" }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={selectedSchedule.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#1E293B]">รายละเอียดตารางลงตรวจ</h3>
                  <p className="text-sm text-[#64748B]">{selectedSchedule.dentistName}</p>
                </div>
              </div>
              <button onClick={() => { setModalMode("closed"); setSelectedSchedule(null); }} className="p-2 rounded-lg hover:bg-[#F1F5F9] transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>
            {/* Body */}
            <div className="overflow-y-auto p-8 space-y-5 flex-1">
              <div className="grid grid-cols-2 gap-4">
                <InfoItem label="ทันตแพทย์" value={selectedSchedule.dentistName} />
                <InfoItem label="ห้องตรวจ" value={selectedSchedule.room} />
                <InfoItem label="วัน" value={THAI_DAYS_FULL[selectedSchedule.dayOfWeek]} />
                <InfoItem label="เวลา" value={`${selectedSchedule.timeStart} - ${selectedSchedule.timeEnd}`} />
                <InfoItem label="เดือน" value={`${THAI_MONTHS[selectedSchedule.month]} ${selectedSchedule.year + 543}`} />
              </div>
            </div>
            {/* Footer */}
            <div className="flex justify-end gap-3 px-8 py-5 border-t border-[#E2E8F0] flex-shrink-0">
              <button onClick={() => openEdit(selectedSchedule)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00C6FF] to-[#0072FF] text-white font-semibold text-sm shadow-lg shadow-[#0072FF]/20 hover:shadow-xl hover:brightness-110 active:scale-[0.98] transition-all duration-200">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                แก้ไข
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Add / Edit Schedule Form Modal ─── */}
      {(modalMode === "add" || modalMode === "edit") && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl mx-4 max-h-[90vh] flex flex-col" style={{ animation: "modal-pop 0.25s ease-out" }}>
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-5 border-b border-[#E2E8F0] flex-shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#00C6FF] to-[#0072FF] flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#1E293B]">{modalMode === "add" ? "วันลงตรวจทันตแพทย์" : "แก้ไขตารางลงตรวจ"}</h3>
                  <p className="text-sm text-[#64748B] mt-0.5">{modalMode === "add" ? "กำหนดวันและเวลาลงตรวจ" : `แก้ไขตาราง ${selectedSchedule?.dentistName}`}</p>
                </div>
              </div>
              <button onClick={() => { setModalMode("closed"); setSelectedSchedule(null); }} className="p-2 rounded-lg hover:bg-[#F1F5F9] transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>

            {/* Form Body */}
            <div className="overflow-y-auto p-8 space-y-6 flex-1">
              {/* Dentist Selection */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wide">
                  ทันตแพทย์ <span className="text-red-400 ml-1">*</span>
                </label>
                <select
                  value={formData.dentistId}
                  onChange={(e) => {
                    const d = dentistOptions.find((d) => d.id === e.target.value);
                    updateField("dentistId", e.target.value);
                    if (d) updateField("dentistName", d.name);
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-white border text-sm text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#00C6FF]/30 focus:border-[#00C6FF] transition-all ${formErrors.dentistId ? "border-red-400 ring-2 ring-red-400/20" : "border-[#E2E8F0]"}`}
                >
                  <option value="">-- เลือกทันตแพทย์ --</option>
                  {dentistOptions.map((d) => (
                    <option key={d.id} value={d.id}>{d.name} — {d.specialty}</option>
                  ))}
                </select>
                {formErrors.dentistId && <p className="text-xs text-red-400 mt-0.5">กรุณาเลือกทันตแพทย์</p>}
              </div>

              {/* Month */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wide">เดือน</label>
                  <select
                    value={formData.month}
                    onChange={(e) => updateField("month", parseInt(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E2E8F0] text-sm text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#00C6FF]/30 focus:border-[#00C6FF] transition-all"
                  >
                    {THAI_MONTHS.map((m, i) => (
                      <option key={i} value={i}>{m}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wide">ปี (พ.ศ.)</label>
                  <select
                    value={formData.year}
                    onChange={(e) => updateField("year", parseInt(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E2E8F0] text-sm text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#00C6FF]/30 focus:border-[#00C6FF] transition-all"
                  >
                    {[currentYear - 1, currentYear, currentYear + 1].map((y) => (
                      <option key={y} value={y}>{y + 543}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Day of Week Toggles */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wide">
                  วัน <span className="text-red-400 ml-1">*</span>
                </label>
                <div className="flex gap-2">
                  {THAI_DAYS_SHORT.map((dayLabel, dayIdx) => {
                    const isSelected = formData.selectedDays.includes(dayIdx);
                    const isSunday = dayIdx === 0;
                    const isSaturday = dayIdx === 6;
                    return (
                      <button
                        key={dayIdx}
                        type="button"
                        onClick={() => toggleDay(dayIdx)}
                        className={`w-11 h-11 rounded-full text-xs font-bold transition-all duration-200 border-2 flex items-center justify-center
                          ${isSelected
                            ? "bg-gradient-to-r from-[#00C6FF] to-[#0072FF] text-white border-transparent shadow-md shadow-[#0072FF]/20 scale-110"
                            : isSunday
                              ? "border-red-200 text-red-400 hover:bg-red-50 hover:border-red-300"
                              : isSaturday
                                ? "border-blue-200 text-blue-400 hover:bg-blue-50 hover:border-blue-300"
                                : "border-[#E2E8F0] text-[#64748B] hover:bg-[#F1F5F9] hover:border-[#CBD5E1]"
                          }`}
                      >
                        {dayLabel}
                      </button>
                    );
                  })}
                </div>
                {formErrors.selectedDays && <p className="text-xs text-red-400 mt-0.5">กรุณาเลือกอย่างน้อย 1 วัน</p>}
              </div>

              {/* Room */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wide">
                  ห้อง <span className="text-red-400 ml-1">*</span>
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {ROOMS.map((room) => {
                    const isSelected = formData.room === room;
                    const rc = ROOM_COLORS[room];
                    return (
                      <button
                        key={room}
                        type="button"
                        onClick={() => updateField("room", room)}
                        className={`px-4 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all duration-200 flex items-center justify-center gap-2
                          ${isSelected
                            ? `${rc.bgLight} ${rc.border} ${rc.text} shadow-sm scale-105`
                            : "border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC] hover:border-[#CBD5E1]"
                          }`}
                      >
                        <span className={`w-2.5 h-2.5 rounded-full ${isSelected ? rc.dot : "bg-[#CBD5E1]"}`} />
                        {room}
                      </button>
                    );
                  })}
                </div>
                {formErrors.room && <p className="text-xs text-red-400 mt-0.5">กรุณาเลือกห้อง</p>}
              </div>

              {/* Time Range */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wide">
                    เวลา จาก <span className="text-red-400 ml-1">*</span>
                  </label>
                  <input
                    type="time"
                    value={formData.timeStart}
                    onChange={(e) => updateField("timeStart", e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-xl bg-white border text-sm text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#00C6FF]/30 focus:border-[#00C6FF] transition-all ${formErrors.timeStart ? "border-red-400 ring-2 ring-red-400/20" : "border-[#E2E8F0]"}`}
                  />
                  {formErrors.timeStart && <p className="text-xs text-red-400 mt-0.5">กรุณาระบุเวลา</p>}
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wide">
                    ถึง <span className="text-red-400 ml-1">*</span>
                  </label>
                  <input
                    type="time"
                    value={formData.timeEnd}
                    onChange={(e) => updateField("timeEnd", e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-xl bg-white border text-sm text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#00C6FF]/30 focus:border-[#00C6FF] transition-all ${formErrors.timeEnd ? "border-red-400 ring-2 ring-red-400/20" : "border-[#E2E8F0]"}`}
                  />
                  {formErrors.timeEnd && <p className="text-xs text-red-400 mt-0.5">กรุณาระบุเวลาที่ถูกต้อง</p>}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-8 py-5 border-t border-[#E2E8F0] flex-shrink-0">
              <p className="text-xs text-[#94A3B8]"><span className="text-red-400">*</span> จำเป็นต้องกรอก</p>
              <div className="flex gap-3">
                <button
                  onClick={() => { setModalMode("closed"); setSelectedSchedule(null); }}
                  className="px-5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm font-semibold text-[#475569] hover:bg-[#F1F5F9] transition-all"
                >
                  ยกเลิก
                </button>
                <button
                  id="btn-save-schedule"
                  onClick={handleSave}
                  disabled={saveSuccess}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg active:scale-[0.98] ${saveSuccess ? "bg-green-500 text-white shadow-green-500/20" : "bg-gradient-to-r from-[#00C6FF] to-[#0072FF] text-white shadow-[#0072FF]/20 hover:shadow-xl hover:brightness-110"}`}
                >
                  {saveSuccess ? (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                      บันทึกสำเร็จ
                    </>
                  ) : (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>
                      {modalMode === "add" ? "เพิ่มวันลงตรวจ" : "บันทึก"}
                    </>
                  )}
                </button>
              </div>
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

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wide mb-1">{label}</p>
      <p className="text-sm text-[#1E293B] font-medium">{value}</p>
    </div>
  );
}
