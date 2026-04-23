"use client";

import { useState, useEffect, useRef } from "react";

// ─── Types ─────────────────────────────────────────────
interface Patient {
  id: string;
  hn: string;
  idCard: string;
  prefix: string;
  firstName: string;
  lastName: string;
  nickname: string;
  phone: string;
  email: string;
  gender: "ชาย" | "หญิง";
  age: number;
  dob: string;
  nationality: string;
  bloodType: string;
  group: string;
  lastVisit: string;
  isActive: boolean;
  // Medical
  allergies: string;
  chronicDiseases: string;
  surgeryHistory: string;
  isADHD: boolean;
  isPregnant: boolean;
  alcohol: string;
  smoking: string;
  // Contact
  facebook: string;
  lineId: string;
  // Address
  houseNo: string;
  moo: string;
  road: string;
  soi: string;
  subDistrict: string;
  district: string;
  province: string;
  postalCode: string;
  // Other
  referralSource: string;
  referrerName: string;
  branch: string;
}

// ─── Initial Form State ─────────────────────────────────
const emptyPatient: Omit<Patient, "id" | "hn" | "age" | "lastVisit"> = {
  idCard: "",
  prefix: "นาย",
  firstName: "",
  lastName: "",
  nickname: "",
  phone: "",
  email: "",
  gender: "ชาย",
  dob: "",
  nationality: "ไทย",
  bloodType: "",
  group: "ทั่วไป",
  isActive: true,
  allergies: "",
  chronicDiseases: "",
  surgeryHistory: "",
  isADHD: false,
  isPregnant: false,
  alcohol: "ไม่ดื่ม",
  smoking: "ไม่สูบ",
  facebook: "",
  lineId: "",
  houseNo: "",
  moo: "",
  road: "",
  soi: "",
  subDistrict: "",
  district: "",
  province: "",
  postalCode: "",
  referralSource: "",
  referrerName: "",
  branch: "ศรีนครินทร์",
};

// ─── Compute age from DOB ─────────────────────────────
function calcAge(dob: string): number {
  if (!dob) return 0;
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

// ─── Mock Data ─────────────────────────────────────────
const initialPatients: Patient[] = [
  { id: "1", hn: "HN-0001", idCard: "1100100100001", prefix: "นาย", firstName: "สมชาย", lastName: "ใจดี", nickname: "ชาย", phone: "081-234-5678", email: "somchai@email.com", gender: "ชาย", age: 35, dob: "1991-03-15", nationality: "ไทย", bloodType: "A", group: "VIP", lastVisit: "12/04/2026", isActive: true, allergies: "เพนนิซิลิน", chronicDiseases: "-", surgeryHistory: "-", isADHD: false, isPregnant: false, alcohol: "ดื่มบ้าง", smoking: "ไม่สูบ", facebook: "", lineId: "", houseNo: "123", moo: "5", road: "ศรีนครินทร์", soi: "25", subDistrict: "หนองบอน", district: "ประเวศ", province: "กรุงเทพมหานคร", postalCode: "10250", referralSource: "เพื่อนแนะนำ", referrerName: "", branch: "ศรีนครินทร์" },
  { id: "2", hn: "HN-0002", idCard: "1100100100002", prefix: "นาง", firstName: "สมหญิง", lastName: "รักสวย", nickname: "หญิง", phone: "082-345-6789", email: "", gender: "หญิง", age: 28, dob: "1998-07-22", nationality: "ไทย", bloodType: "B", group: "ทั่วไป", lastVisit: "12/04/2026", isActive: true, allergies: "-", chronicDiseases: "-", surgeryHistory: "-", isADHD: false, isPregnant: false, alcohol: "ไม่ดื่ม", smoking: "ไม่สูบ", facebook: "", lineId: "", houseNo: "456", moo: "", road: "สุขุมวิท", soi: "77", subDistrict: "สวนหลวง", district: "สวนหลวง", province: "กรุงเทพมหานคร", postalCode: "10250", referralSource: "Facebook", referrerName: "", branch: "ศรีนครินทร์" },
  { id: "3", hn: "HN-0003", idCard: "1100100100003", prefix: "นาย", firstName: "วิชัย", lastName: "สุขสันต์", nickname: "ชัย", phone: "083-456-7890", email: "", gender: "ชาย", age: 42, dob: "1984-01-10", nationality: "ไทย", bloodType: "O", group: "ทั่วไป", lastVisit: "11/04/2026", isActive: true, allergies: "-", chronicDiseases: "เบาหวาน", surgeryHistory: "-", isADHD: false, isPregnant: false, alcohol: "ไม่ดื่ม", smoking: "สูบ", facebook: "", lineId: "", houseNo: "789", moo: "3", road: "ลาดกระบัง", soi: "10", subDistrict: "ลาดกระบัง", district: "ลาดกระบัง", province: "กรุงเทพมหานคร", postalCode: "10520", referralSource: "Google", referrerName: "", branch: "ศรีนครินทร์" },
  { id: "4", hn: "HN-0004", idCard: "1100100100004", prefix: "นางสาว", firstName: "นภา", lastName: "ดวงจันทร์", nickname: "นภา", phone: "084-567-8901", email: "napa@email.com", gender: "หญิง", age: 31, dob: "1995-05-05", nationality: "ไทย", bloodType: "AB", group: "VIP", lastVisit: "11/04/2026", isActive: true, allergies: "-", chronicDiseases: "-", surgeryHistory: "ผ่าฟันคุด", isADHD: false, isPregnant: false, alcohol: "ไม่ดื่ม", smoking: "ไม่สูบ", facebook: "", lineId: "napa_moon", houseNo: "321", moo: "", road: "พัฒนาการ", soi: "44", subDistrict: "สวนหลวง", district: "สวนหลวง", province: "กรุงเทพมหานคร", postalCode: "10250", referralSource: "เว็บไซต์", referrerName: "", branch: "ศรีนครินทร์" },
  { id: "5", hn: "HN-0005", idCard: "1100100100005", prefix: "นาย", firstName: "พิชัย", lastName: "กล้าหาญ", nickname: "ชัย", phone: "085-678-9012", email: "", gender: "ชาย", age: 55, dob: "1971-11-20", nationality: "ไทย", bloodType: "O", group: "ทั่วไป", lastVisit: "10/04/2026", isActive: true, allergies: "ยาพาราเซตามอล", chronicDiseases: "ความดันโลหิตสูง", surgeryHistory: "-", isADHD: false, isPregnant: false, alcohol: "ดื่มบ้าง", smoking: "เลิกแล้ว", facebook: "", lineId: "", houseNo: "654", moo: "1", road: "บางนา", soi: "12", subDistrict: "บางนาเหนือ", district: "บางนา", province: "กรุงเทพมหานคร", postalCode: "10260", referralSource: "เพื่อนแนะนำ", referrerName: "คุณวิชัย", branch: "ศรีนครินทร์" },
  { id: "6", hn: "HN-0006", idCard: "1100100100006", prefix: "นางสาว", firstName: "สุดา", lastName: "แก้วมณี", nickname: "ดา", phone: "086-789-0123", email: "suda@email.com", gender: "หญิง", age: 24, dob: "2002-02-14", nationality: "ไทย", bloodType: "A", group: "นักเรียน", lastVisit: "10/04/2026", isActive: true, allergies: "-", chronicDiseases: "-", surgeryHistory: "-", isADHD: false, isPregnant: false, alcohol: "ไม่ดื่ม", smoking: "ไม่สูบ", facebook: "suda.kaew", lineId: "suda_k", houseNo: "987", moo: "7", road: "อ่อนนุช", soi: "55", subDistrict: "ประเวศ", district: "ประเวศ", province: "กรุงเทพมหานคร", postalCode: "10250", referralSource: "Instagram", referrerName: "", branch: "ศรีนครินทร์" },
  { id: "7", hn: "HN-0007", idCard: "1100100100007", prefix: "นาย", firstName: "ประเสริฐ", lastName: "ศรีสะอาด", nickname: "เสริฐ", phone: "087-890-1234", email: "", gender: "ชาย", age: 48, dob: "1978-09-01", nationality: "ไทย", bloodType: "B", group: "VIP", lastVisit: "09/04/2026", isActive: true, allergies: "-", chronicDiseases: "-", surgeryHistory: "-", isADHD: false, isPregnant: false, alcohol: "ดื่ม", smoking: "สูบ", facebook: "", lineId: "", houseNo: "159", moo: "", road: "รามคำแหง", soi: "99", subDistrict: "หัวหมาก", district: "บางกะปิ", province: "กรุงเทพมหานคร", postalCode: "10240", referralSource: "โฆษณา", referrerName: "", branch: "ศรีนครินทร์" },
  { id: "8", hn: "HN-0008", idCard: "1100100100008", prefix: "นาง", firstName: "รัชนี", lastName: "ดอกไม้", nickname: "นี", phone: "088-901-2345", email: "", gender: "หญิง", age: 36, dob: "1990-06-18", nationality: "ไทย", bloodType: "AB", group: "ทั่วไป", lastVisit: "09/04/2026", isActive: true, allergies: "-", chronicDiseases: "-", surgeryHistory: "-", isADHD: false, isPregnant: true, alcohol: "ไม่ดื่ม", smoking: "ไม่สูบ", facebook: "", lineId: "", houseNo: "753", moo: "2", road: "เทพารักษ์", soi: "8", subDistrict: "เทพารักษ์", district: "เมืองสมุทรปราการ", province: "สมุทรปราการ", postalCode: "10270", referralSource: "Google", referrerName: "", branch: "ศรีนครินทร์" },
  { id: "9", hn: "HN-0009", idCard: "1100100100009", prefix: "นาย", firstName: "ชัยวัฒน์", lastName: "มั่นคง", nickname: "วัฒน์", phone: "089-012-3456", email: "", gender: "ชาย", age: 62, dob: "1964-04-30", nationality: "ไทย", bloodType: "O", group: "ผู้สูงอายุ", lastVisit: "08/04/2026", isActive: true, allergies: "แอสไพริน", chronicDiseases: "เบาหวาน, ความดัน", surgeryHistory: "ผ่าตัดหัวใจ", isADHD: false, isPregnant: false, alcohol: "ไม่ดื่ม", smoking: "เลิกแล้ว", facebook: "", lineId: "", houseNo: "258", moo: "10", road: "ศรีนครินทร์", soi: "48", subDistrict: "หนองบอน", district: "ประเวศ", province: "กรุงเทพมหานคร", postalCode: "10250", referralSource: "เพื่อนแนะนำ", referrerName: "คุณพิชัย", branch: "ศรีนครินทร์" },
  { id: "10", hn: "HN-0010", idCard: "1100100100010", prefix: "นางสาว", firstName: "กัลยา", lastName: "สวัสดี", nickname: "ยา", phone: "080-123-4567", email: "kanlaya@email.com", gender: "หญิง", age: 29, dob: "1997-12-25", nationality: "ไทย", bloodType: "A", group: "ทั่วไป", lastVisit: "08/04/2026", isActive: true, allergies: "-", chronicDiseases: "-", surgeryHistory: "-", isADHD: false, isPregnant: false, alcohol: "ไม่ดื่ม", smoking: "ไม่สูบ", facebook: "kanlaya.s", lineId: "kanlaya_s", houseNo: "369", moo: "", road: "พระราม 9", soi: "33", subDistrict: "ห้วยขวาง", district: "ห้วยขวาง", province: "กรุงเทพมหานคร", postalCode: "10310", referralSource: "Line", referrerName: "", branch: "ศรีนครินทร์" },
  { id: "11", hn: "HN-0011", idCard: "1100100100011", prefix: "นาง", firstName: "ธนาพร", lastName: "วงษ์สุวรรณ", nickname: "พร", phone: "091-234-5678", email: "", gender: "หญิง", age: 33, dob: "1993-08-08", nationality: "ไทย", bloodType: "B", group: "VIP", lastVisit: "07/04/2026", isActive: true, allergies: "-", chronicDiseases: "-", surgeryHistory: "-", isADHD: false, isPregnant: false, alcohol: "ไม่ดื่ม", smoking: "ไม่สูบ", facebook: "", lineId: "", houseNo: "147", moo: "", road: "สุขุมวิท", soi: "101", subDistrict: "บางจาก", district: "พระโขนง", province: "กรุงเทพมหานคร", postalCode: "10260", referralSource: "Facebook", referrerName: "", branch: "ศรีนครินทร์" },
  { id: "12", hn: "HN-0012", idCard: "1100100100012", prefix: "นาย", firstName: "วีระ", lastName: "พลายงาม", nickname: "ระ", phone: "092-345-6789", email: "", gender: "ชาย", age: 45, dob: "1981-10-12", nationality: "ไทย", bloodType: "O", group: "ทั่วไป", lastVisit: "07/04/2026", isActive: true, allergies: "-", chronicDiseases: "-", surgeryHistory: "-", isADHD: false, isPregnant: false, alcohol: "ดื่มบ้าง", smoking: "ไม่สูบ", facebook: "", lineId: "", houseNo: "852", moo: "4", road: "บางนา-ตราด", soi: "25", subDistrict: "บางนา", district: "บางนา", province: "กรุงเทพมหานคร", postalCode: "10260", referralSource: "เพื่อนแนะนำ", referrerName: "", branch: "ศรีนครินทร์" },
];

const genderOptions = ["ทั้งหมด", "ชาย", "หญิง"];
const groupOptions = ["ทั้งหมด", "VIP", "ทั่วไป", "นักเรียน", "ผู้สูงอายุ"];
const prefixOptions = ["นาย", "นาง", "นางสาว", "เด็กชาย", "เด็กหญิง"];
const bloodTypes = ["", "A", "B", "O", "AB"];
const referralSources = ["", "เพื่อนแนะนำ", "Facebook", "Instagram", "Google", "Line", "เว็บไซต์", "โฆษณา", "อื่นๆ"];

type ModalMode = "closed" | "add" | "edit" | "view" | "delete";

export default function PatientsPage() {
  // ─── State ────────────────────────────────────────────
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [activeTab, setActiveTab] = useState("รายชื่อ");
  const [search, setSearch] = useState("");
  const [genderFilter, setGenderFilter] = useState("ทั้งหมด");
  const [groupFilter, setGroupFilter] = useState("ทั้งหมด");
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 8;

  // Modal
  const [modalMode, setModalMode] = useState<ModalMode>("closed");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [formData, setFormData] = useState(emptyPatient);
  const [formErrors, setFormErrors] = useState<Record<string, boolean>>({});
  const [saveSuccess, setSaveSuccess] = useState(false);

  // 3-dot menu
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // ─── Filtering ────────────────────────────────────────
  const filtered = patients.filter((p) => {
    const fullName = `${p.firstName} ${p.lastName}`;
    const matchSearch =
      p.hn.toLowerCase().includes(search.toLowerCase()) ||
      fullName.includes(search) ||
      p.idCard.includes(search) ||
      p.phone.includes(search);
    const matchGender = genderFilter === "ทั้งหมด" || p.gender === genderFilter;
    const matchGroup = groupFilter === "ทั้งหมด" || p.group === groupFilter;
    return matchSearch && matchGender && matchGroup;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  // ─── Helpers ──────────────────────────────────────────
  const groupBadge: Record<string, string> = {
    VIP: "bg-amber-100 text-amber-700",
    "ทั่วไป": "bg-blue-100 text-blue-700",
    "นักเรียน": "bg-green-100 text-green-700",
    "ผู้สูงอายุ": "bg-purple-100 text-purple-700",
  };

  const nextHn = () => {
    const maxNum = patients.reduce((max, p) => {
      const n = parseInt(p.hn.replace("HN-", ""), 10);
      return n > max ? n : max;
    }, 0);
    return `HN-${String(maxNum + 1).padStart(4, "0")}`;
  };

  // ─── Open Modals ──────────────────────────────────────
  const openAdd = () => {
    setFormData(emptyPatient);
    setFormErrors({});
    setModalMode("add");
    setOpenMenu(null);
  };

  const openEdit = (p: Patient) => {
    setSelectedPatient(p);
    setFormData({
      idCard: p.idCard,
      prefix: p.prefix,
      firstName: p.firstName,
      lastName: p.lastName,
      nickname: p.nickname,
      phone: p.phone,
      email: p.email,
      gender: p.gender,
      dob: p.dob,
      nationality: p.nationality,
      bloodType: p.bloodType,
      group: p.group,
      isActive: p.isActive,
      allergies: p.allergies,
      chronicDiseases: p.chronicDiseases,
      surgeryHistory: p.surgeryHistory,
      isADHD: p.isADHD,
      isPregnant: p.isPregnant,
      alcohol: p.alcohol,
      smoking: p.smoking,
      facebook: p.facebook,
      lineId: p.lineId,
      houseNo: p.houseNo,
      moo: p.moo,
      road: p.road,
      soi: p.soi,
      subDistrict: p.subDistrict,
      district: p.district,
      province: p.province,
      postalCode: p.postalCode,
      referralSource: p.referralSource,
      referrerName: p.referrerName,
      branch: p.branch,
    });
    setFormErrors({});
    setModalMode("edit");
    setOpenMenu(null);
  };

  const openView = (p: Patient) => {
    setSelectedPatient(p);
    setModalMode("view");
    setOpenMenu(null);
  };

  const openDelete = (p: Patient) => {
    setSelectedPatient(p);
    setModalMode("delete");
    setOpenMenu(null);
  };

  // ─── Form Handlers ───────────────────────────────────
  const updateField = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: false }));
    }
  };

  const validateForm = () => {
    const errors: Record<string, boolean> = {};
    if (!formData.idCard.trim()) errors.idCard = true;
    if (!formData.firstName.trim()) errors.firstName = true;
    if (!formData.lastName.trim()) errors.lastName = true;
    if (!formData.dob) errors.dob = true;
    if (!formData.phone.trim()) errors.phone = true;
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    if (modalMode === "add") {
      const newPatient: Patient = {
        id: String(Date.now()),
        hn: nextHn(),
        age: calcAge(formData.dob),
        lastVisit: "-",
        ...formData,
      };
      setPatients((prev) => [newPatient, ...prev]);
    } else if (modalMode === "edit" && selectedPatient) {
      setPatients((prev) =>
        prev.map((p) =>
          p.id === selectedPatient.id
            ? { ...p, ...formData, age: calcAge(formData.dob) }
            : p
        )
      );
    }

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setModalMode("closed");
      setSelectedPatient(null);
    }, 800);
  };

  const handleDelete = () => {
    if (selectedPatient) {
      setPatients((prev) => prev.filter((p) => p.id !== selectedPatient.id));
    }
    setModalMode("closed");
    setSelectedPatient(null);
  };

  // ─── Render ───────────────────────────────────────────
  if (!isMounted) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* ═══ Header ═══ */}
      <div className="flex items-center justify-between animate-fade-in">
        <div>
          <h2 className="text-2xl font-bold text-[#1E293B]">คนไข้</h2>
          <p className="text-sm text-[#64748B] mt-0.5">จัดการข้อมูลคนไข้ทั้งหมด</p>
        </div>
        <button
          id="btn-add-patient"
          onClick={openAdd}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00C6FF] to-[#0072FF] text-white font-semibold text-sm shadow-lg shadow-[#0072FF]/20 hover:shadow-xl hover:brightness-110 active:scale-[0.98] transition-all duration-200"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          เพิ่มคนไข้ใหม่
        </button>
      </div>



      {/* ═══ Filters ═══ */}
      <div className="flex flex-wrap items-center gap-3 animate-fade-in">
        {/* Search */}
        <div className="relative flex-1 min-w-[280px] max-w-md">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            id="input-search-patient"
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            placeholder="ค้นหาด้วย HN, ชื่อ, เบอร์โทร..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#E2E8F0] text-sm text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#00C6FF]/30 focus:border-[#00C6FF] transition-all"
          />
        </div>

        {/* Gender filter */}
        <select
          id="filter-gender"
          value={genderFilter}
          onChange={(e) => { setGenderFilter(e.target.value); setCurrentPage(1); }}
          className="px-4 py-2.5 rounded-xl bg-white border border-[#E2E8F0] text-sm text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#00C6FF]/30 cursor-pointer"
        >
          {genderOptions.map((g) => (
            <option key={g} value={g}>เพศ: {g}</option>
          ))}
        </select>

        {/* Group filter */}
        <select
          id="filter-group"
          value={groupFilter}
          onChange={(e) => { setGroupFilter(e.target.value); setCurrentPage(1); }}
          className="px-4 py-2.5 rounded-xl bg-white border border-[#E2E8F0] text-sm text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#00C6FF]/30 cursor-pointer"
        >
          {groupOptions.map((g) => (
            <option key={g} value={g}>กลุ่ม: {g}</option>
          ))}
        </select>

        <span className="text-sm text-[#64748B] ml-2">
          พบ <span className="font-semibold text-[#1E293B]">{filtered.length}</span> รายการ
        </span>
      </div>

      {/* ═══ Table ═══ */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#E2E8F0] overflow-hidden animate-fade-in">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#1E3A5F]">
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-white uppercase tracking-wider">HN</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-white uppercase tracking-wider">ชื่อ-สกุล</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-white uppercase tracking-wider">เบอร์โทร</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-white uppercase tracking-wider">เพศ</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-white uppercase tracking-wider">อายุ</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-white uppercase tracking-wider">วันที่รักษาสุดท้าย</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-white uppercase tracking-wider">กลุ่มลูกค้า</th>
                <th className="text-center px-6 py-3.5 text-xs font-semibold text-white uppercase tracking-wider">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {paginated.map((p, i) => (
                <tr key={p.id} className={`${i % 2 === 1 ? "bg-[#F8FAFC]" : "bg-white"} hover:bg-[#E0EAFF]/30 transition-colors`}>
                  <td className="px-6 py-3.5 text-sm font-mono font-medium text-[#2B5998]">{p.hn}</td>
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00C6FF]/20 to-[#0072FF]/20 flex items-center justify-center text-[#0072FF] text-xs font-bold flex-shrink-0">
                        {p.firstName.charAt(0)}
                      </div>
                      <span className="text-sm font-medium text-[#1E293B]">{p.firstName} {p.lastName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3.5 text-sm text-[#475569]">{p.phone}</td>
                  <td className="px-6 py-3.5 text-sm text-[#475569]">{p.gender}</td>
                  <td className="px-6 py-3.5 text-sm text-[#475569]">{p.age} ปี</td>
                  <td className="px-6 py-3.5 text-sm text-[#64748B]">{p.lastVisit}</td>
                  <td className="px-6 py-3.5">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${groupBadge[p.group] || "bg-gray-100 text-gray-600"}`}>
                      {p.group}
                    </span>
                  </td>
                  <td className="px-6 py-3.5">
                    <div className="flex items-center justify-center relative" ref={openMenu === p.id ? menuRef : undefined}>
                      <button
                        onClick={() => setOpenMenu(openMenu === p.id ? null : p.id)}
                        className="p-2 rounded-lg hover:bg-[#F1F5F9] transition-colors"
                        title="ตัวเลือก"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#64748B]">
                          <circle cx="12" cy="5" r="1" />
                          <circle cx="12" cy="12" r="1" />
                          <circle cx="12" cy="19" r="1" />
                        </svg>
                      </button>

                      {/* Dropdown Menu */}
                      {openMenu === p.id && (
                        <div className="absolute right-0 top-10 z-50 w-44 bg-white rounded-xl shadow-xl border border-[#E2E8F0] py-1.5 animate-fade-in">
                          <button
                            onClick={() => openView(p)}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0072FF] transition-colors"
                          >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                            รายละเอียด
                          </button>
                          <button
                            onClick={() => openEdit(p)}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0072FF] transition-colors"
                          >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                            แก้ไข
                          </button>
                          <div className="border-t border-[#F1F5F9] my-1" />
                          <button
                            onClick={() => openDelete(p)}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                          >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </svg>
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
                  <td colSpan={8} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <line x1="17" y1="11" x2="23" y2="11" />
                      </svg>
                      <p className="text-[#94A3B8] text-sm">ไม่พบข้อมูลคนไข้</p>
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
            <p className="text-sm text-[#64748B]">
              หน้า {currentPage} จาก {totalPages}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-[#64748B] hover:bg-[#F1F5F9] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                ← ก่อนหน้า
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition-all duration-200 ${page === currentPage
                    ? "bg-gradient-to-r from-[#00C6FF] to-[#0072FF] text-white shadow-sm"
                    : "text-[#64748B] hover:bg-[#F1F5F9]"
                    }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-[#64748B] hover:bg-[#F1F5F9] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                ถัดไป →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════════════
           MODALS
         ═══════════════════════════════════════════════════════════════ */}

      {/* ─── Delete Confirmation Modal ─── */}
      {modalMode === "delete" && selectedPatient && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl mx-4" style={{ animation: "modal-pop 0.25s ease-out" }}>
            {/* Icon */}
            <div className="flex justify-center mb-5">
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-bold text-[#1E293B] text-center mb-2">ยืนยันการลบคนไข้?</h3>
            <p className="text-sm text-[#64748B] text-center mb-8">
              คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลของ<br />
              <span className="font-semibold text-[#1E293B]">{selectedPatient.firstName} {selectedPatient.lastName}</span> ({selectedPatient.hn})?<br />
              การดำเนินการนี้ไม่สามารถย้อนกลับได้
            </p>
            <div className="flex gap-3">
              <button
                id="btn-cancel-delete"
                onClick={() => { setModalMode("closed"); setSelectedPatient(null); }}
                className="flex-1 px-5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm font-semibold text-[#475569] hover:bg-[#F1F5F9] transition-all"
              >
                ยกเลิก
              </button>
              <button
                id="btn-confirm-delete"
                onClick={handleDelete}
                className="flex-1 px-5 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 active:scale-[0.98] transition-all shadow-lg shadow-red-500/20"
              >
                ยืนยันลบ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── View Patient Detail Modal ─── */}
      {modalMode === "view" && selectedPatient && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl mx-4 max-h-[90vh] flex flex-col" style={{ animation: "modal-pop 0.25s ease-out" }}>
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-5 border-b border-[#E2E8F0] flex-shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00C6FF] to-[#0072FF] flex items-center justify-center text-white font-bold text-lg">
                  {selectedPatient.firstName.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#1E293B]">{selectedPatient.prefix}{selectedPatient.firstName} {selectedPatient.lastName}</h3>
                  <p className="text-sm text-[#64748B]">{selectedPatient.hn} · {selectedPatient.gender} · {selectedPatient.age} ปี</p>
                </div>
              </div>
              <button
                onClick={() => { setModalMode("closed"); setSelectedPatient(null); }}
                className="p-2 rounded-lg hover:bg-[#F1F5F9] transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="overflow-y-auto p-8 space-y-6 flex-1">
              {/* Info Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <InfoItem label="เลขบัตรประชาชน" value={selectedPatient.idCard} />
                <InfoItem label="วันเกิด" value={selectedPatient.dob} />
                <InfoItem label="หมู่เลือด" value={selectedPatient.bloodType || "-"} />
                <InfoItem label="สัญชาติ" value={selectedPatient.nationality} />
                <InfoItem label="เบอร์โทรศัพท์" value={selectedPatient.phone} />
                <InfoItem label="อีเมล" value={selectedPatient.email || "-"} />
                <InfoItem label="กลุ่มลูกค้า" value={selectedPatient.group} />
                <InfoItem label="Facebook" value={selectedPatient.facebook || "-"} />
                <InfoItem label="Line ID" value={selectedPatient.lineId || "-"} />
              </div>

              {/* Medical History */}
              <div>
                <h4 className="text-sm font-semibold text-[#1E293B] mb-3 flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0072FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                  ประวัติทางการแพทย์
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 bg-[#F8FAFC] rounded-xl p-4">
                  <InfoItem label="ยาที่แพ้" value={selectedPatient.allergies || "-"} />
                  <InfoItem label="โรคประจำตัว" value={selectedPatient.chronicDiseases || "-"} />
                  <InfoItem label="ประวัติผ่าตัด" value={selectedPatient.surgeryHistory || "-"} />
                  <InfoItem label="ADHD/ออทิสติก" value={selectedPatient.isADHD ? "ใช่" : "ไม่"} />
                  <InfoItem label="ตั้งครรภ์" value={selectedPatient.isPregnant ? "ใช่" : "ไม่"} />
                  <InfoItem label="แอลกอฮอล์" value={selectedPatient.alcohol} />
                  <InfoItem label="สูบบุหรี่" value={selectedPatient.smoking} />
                </div>
              </div>

              {/* Address */}
              <div>
                <h4 className="text-sm font-semibold text-[#1E293B] mb-3 flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0072FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  ที่อยู่
                </h4>
                <div className="bg-[#F8FAFC] rounded-xl p-4">
                  <p className="text-sm text-[#475569]">
                    {selectedPatient.houseNo && `${selectedPatient.houseNo} `}
                    {selectedPatient.moo && `หมู่ ${selectedPatient.moo} `}
                    {selectedPatient.soi && `ซอย${selectedPatient.soi} `}
                    {selectedPatient.road && `ถนน${selectedPatient.road} `}
                    {selectedPatient.subDistrict && `แขวง/ตำบล${selectedPatient.subDistrict} `}
                    {selectedPatient.district && `เขต/อำเภอ${selectedPatient.district} `}
                    {selectedPatient.province && `${selectedPatient.province} `}
                    {selectedPatient.postalCode}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 px-8 py-5 border-t border-[#E2E8F0] flex-shrink-0">
              <button
                onClick={() => openEdit(selectedPatient)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00C6FF] to-[#0072FF] text-white font-semibold text-sm shadow-lg shadow-[#0072FF]/20 hover:shadow-xl hover:brightness-110 active:scale-[0.98] transition-all duration-200"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                แก้ไขข้อมูล
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Add / Edit Patient Form Modal ─── */}
      {(modalMode === "add" || modalMode === "edit") && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl mx-4 max-h-[90vh] flex flex-col" style={{ animation: "modal-pop 0.25s ease-out" }}>
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-5 border-b border-[#E2E8F0] flex-shrink-0">
              <div>
                <h3 className="text-lg font-bold text-[#1E293B]">
                  {modalMode === "add" ? "เพิ่มคนไข้ใหม่" : "แก้ไขข้อมูลคนไข้"}
                </h3>
                <p className="text-sm text-[#64748B] mt-0.5">
                  {modalMode === "add" ? "กรอกข้อมูลคนไข้ด้านล่าง" : `แก้ไขข้อมูล ${selectedPatient?.hn}`}
                </p>
              </div>
              <button
                onClick={() => { setModalMode("closed"); setSelectedPatient(null); }}
                className="p-2 rounded-lg hover:bg-[#F1F5F9] transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Form Body */}
            <div className="overflow-y-auto p-8 space-y-8 flex-1">
              {/* ─── Section: ข้อมูลส่วนตัว ─── */}
              <FormSection title="ข้อมูลส่วนตัว" icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0072FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              }>
                {/* Active Toggle */}
                <div className="col-span-full flex items-center gap-3 mb-2">
                  <span className="text-sm text-[#475569]">สถานะ:</span>
                  <button
                    type="button"
                    onClick={() => updateField("isActive", !formData.isActive)}
                    className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${formData.isActive ? "bg-[#0072FF]" : "bg-[#CBD5E1]"}`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${formData.isActive ? "translate-x-6" : ""}`} />
                  </button>
                  <span className={`text-sm font-medium ${formData.isActive ? "text-[#0072FF]" : "text-[#94A3B8]"}`}>
                    {formData.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                <FormField label="เลขบัตรประชาชน / Passport" required error={formErrors.idCard}>
                  <input
                    id="input-idCard"
                    type="text"
                    value={formData.idCard}
                    onChange={(e) => updateField("idCard", e.target.value)}
                    placeholder="x-xxxx-xxxxx-xx-x"
                    className={inputClass(formErrors.idCard)}
                  />
                </FormField>

                <FormField label="คำนำหน้า">
                  <select value={formData.prefix} onChange={(e) => updateField("prefix", e.target.value)} className={inputClass()}>
                    {prefixOptions.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </FormField>

                <FormField label="ชื่อ" required error={formErrors.firstName}>
                  <input
                    id="input-firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => updateField("firstName", e.target.value)}
                    placeholder="ชื่อ"
                    className={inputClass(formErrors.firstName)}
                  />
                </FormField>

                <FormField label="นามสกุล" required error={formErrors.lastName}>
                  <input
                    id="input-lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => updateField("lastName", e.target.value)}
                    placeholder="นามสกุล"
                    className={inputClass(formErrors.lastName)}
                  />
                </FormField>

                <FormField label="ชื่อเล่น">
                  <input
                    type="text"
                    value={formData.nickname}
                    onChange={(e) => updateField("nickname", e.target.value)}
                    placeholder="ชื่อเล่น"
                    className={inputClass()}
                  />
                </FormField>

                <FormField label="วันเกิด" required error={formErrors.dob}>
                  <input
                    id="input-dob"
                    type="date"
                    value={formData.dob}
                    onChange={(e) => updateField("dob", e.target.value)}
                    className={inputClass(formErrors.dob)}
                  />
                </FormField>

                <FormField label="สัญชาติ">
                  <input
                    type="text"
                    value={formData.nationality}
                    onChange={(e) => updateField("nationality", e.target.value)}
                    placeholder="สัญชาติ"
                    className={inputClass()}
                  />
                </FormField>

                <FormField label="เพศ">
                  <div className="flex gap-4 h-[42px] items-center">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="gender" value="ชาย" checked={formData.gender === "ชาย"} onChange={(e) => updateField("gender", e.target.value)} className="w-4 h-4 accent-[#0072FF]" />
                      <span className="text-sm text-[#475569]">ชาย</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="gender" value="หญิง" checked={formData.gender === "หญิง"} onChange={(e) => updateField("gender", e.target.value)} className="w-4 h-4 accent-[#0072FF]" />
                      <span className="text-sm text-[#475569]">หญิง</span>
                    </label>
                  </div>
                </FormField>

                <FormField label="หมู่เลือด">
                  <div className="flex gap-2 h-[42px] items-center">
                    {bloodTypes.filter(Boolean).map((bt) => (
                      <button
                        key={bt}
                        type="button"
                        onClick={() => updateField("bloodType", formData.bloodType === bt ? "" : bt)}
                        className={`px-3.5 py-1.5 rounded-lg text-sm font-medium border transition-all ${formData.bloodType === bt
                          ? "bg-[#0072FF] text-white border-[#0072FF]"
                          : "bg-white text-[#475569] border-[#E2E8F0] hover:border-[#0072FF]/50"
                          }`}
                      >
                        {bt}
                      </button>
                    ))}
                  </div>
                </FormField>

                <FormField label="กลุ่มลูกค้า">
                  <select value={formData.group} onChange={(e) => updateField("group", e.target.value)} className={inputClass()}>
                    {groupOptions.filter((g) => g !== "ทั้งหมด").map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </FormField>

                {/* Checkboxes */}
                <div className="col-span-full flex flex-wrap gap-6 mt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={formData.isADHD} onChange={(e) => updateField("isADHD", e.target.checked)} className="w-4 h-4 accent-[#0072FF] rounded" />
                    <span className="text-sm text-[#475569]">ADHD / ออทิสติก</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={formData.isPregnant} onChange={(e) => updateField("isPregnant", e.target.checked)} className="w-4 h-4 accent-[#0072FF] rounded" />
                    <span className="text-sm text-[#475569]">ตั้งครรภ์</span>
                  </label>
                </div>
              </FormSection>

              {/* ─── Section: ประวัติทางการแพทย์ ─── */}
              <FormSection title="ประวัติทางการแพทย์" icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0072FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              }>
                <FormField label="ยาที่แพ้">
                  <input type="text" value={formData.allergies} onChange={(e) => updateField("allergies", e.target.value)} placeholder="ระบุยาที่แพ้" className={inputClass()} />
                </FormField>
                <FormField label="โรคประจำตัว">
                  <input type="text" value={formData.chronicDiseases} onChange={(e) => updateField("chronicDiseases", e.target.value)} placeholder="ระบุโรคประจำตัว" className={inputClass()} />
                </FormField>
                <FormField label="ประวัติการผ่าตัด">
                  <input type="text" value={formData.surgeryHistory} onChange={(e) => updateField("surgeryHistory", e.target.value)} placeholder="ระบุประวัติการผ่าตัด" className={inputClass()} />
                </FormField>
                <FormField label="ดื่มแอลกอฮอล์">
                  <div className="flex gap-3 h-[42px] items-center">
                    {["ไม่ดื่ม", "ดื่มบ้าง", "ดื่ม"].map((opt) => (
                      <label key={opt} className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="alcohol" value={opt} checked={formData.alcohol === opt} onChange={(e) => updateField("alcohol", e.target.value)} className="w-4 h-4 accent-[#0072FF]" />
                        <span className="text-sm text-[#475569]">{opt}</span>
                      </label>
                    ))}
                  </div>
                </FormField>
                <FormField label="สูบบุหรี่">
                  <div className="flex gap-3 h-[42px] items-center">
                    {["ไม่สูบ", "สูบ", "เลิกแล้ว"].map((opt) => (
                      <label key={opt} className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="smoking" value={opt} checked={formData.smoking === opt} onChange={(e) => updateField("smoking", e.target.value)} className="w-4 h-4 accent-[#0072FF]" />
                        <span className="text-sm text-[#475569]">{opt}</span>
                      </label>
                    ))}
                  </div>
                </FormField>
              </FormSection>

              {/* ─── Section: ข้อมูลติดต่อ ─── */}
              <FormSection title="ข้อมูลติดต่อ" icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0072FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              }>
                <FormField label="เบอร์โทรศัพท์" required error={formErrors.phone}>
                  <input
                    id="input-phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    placeholder="0xx-xxx-xxxx"
                    className={inputClass(formErrors.phone)}
                  />
                </FormField>
                <FormField label="อีเมล">
                  <input type="email" value={formData.email} onChange={(e) => updateField("email", e.target.value)} placeholder="example@email.com" className={inputClass()} />
                </FormField>
                <FormField label="Facebook">
                  <input type="text" value={formData.facebook} onChange={(e) => updateField("facebook", e.target.value)} placeholder="Facebook ID" className={inputClass()} />
                </FormField>
                <FormField label="Line ID">
                  <input type="text" value={formData.lineId} onChange={(e) => updateField("lineId", e.target.value)} placeholder="Line ID" className={inputClass()} />
                </FormField>
              </FormSection>

              {/* ─── Section: ที่อยู่ ─── */}
              <FormSection title="ที่อยู่" icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0072FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              }>
                <FormField label="บ้านเลขที่">
                  <input type="text" value={formData.houseNo} onChange={(e) => updateField("houseNo", e.target.value)} placeholder="บ้านเลขที่" className={inputClass()} />
                </FormField>
                <FormField label="หมู่">
                  <input type="text" value={formData.moo} onChange={(e) => updateField("moo", e.target.value)} placeholder="หมู่" className={inputClass()} />
                </FormField>
                <FormField label="ถนน">
                  <input type="text" value={formData.road} onChange={(e) => updateField("road", e.target.value)} placeholder="ถนน" className={inputClass()} />
                </FormField>
                <FormField label="ซอย">
                  <input type="text" value={formData.soi} onChange={(e) => updateField("soi", e.target.value)} placeholder="ซอย" className={inputClass()} />
                </FormField>
                <FormField label="แขวง/ตำบล">
                  <input type="text" value={formData.subDistrict} onChange={(e) => updateField("subDistrict", e.target.value)} placeholder="แขวง/ตำบล" className={inputClass()} />
                </FormField>
                <FormField label="เขต/อำเภอ">
                  <input type="text" value={formData.district} onChange={(e) => updateField("district", e.target.value)} placeholder="เขต/อำเภอ" className={inputClass()} />
                </FormField>
                <FormField label="จังหวัด">
                  <input type="text" value={formData.province} onChange={(e) => updateField("province", e.target.value)} placeholder="จังหวัด" className={inputClass()} />
                </FormField>
                <FormField label="รหัสไปรษณีย์">
                  <input type="text" value={formData.postalCode} onChange={(e) => updateField("postalCode", e.target.value)} placeholder="xxxxx" className={inputClass()} />
                </FormField>
              </FormSection>

              {/* ─── Section: ข้อมูลเพิ่มเติม ─── */}
              <FormSection title="ข้อมูลเพิ่มเติม" icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0072FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
              }>
                <FormField label="ทราบข่าว LDC จาก">
                  <select value={formData.referralSource} onChange={(e) => updateField("referralSource", e.target.value)} className={inputClass()}>
                    {referralSources.map((s) => (
                      <option key={s} value={s}>{s || "-- เลือก --"}</option>
                    ))}
                  </select>
                </FormField>
                <FormField label="ชื่อผู้แนะนำ">
                  <input type="text" value={formData.referrerName} onChange={(e) => updateField("referrerName", e.target.value)} placeholder="ชื่อผู้แนะนำ" className={inputClass()} />
                </FormField>
                <FormField label="สาขาที่ใช้บริการ">
                  <input type="text" value={formData.branch} onChange={(e) => updateField("branch", e.target.value)} placeholder="สาขา" className={inputClass()} />
                </FormField>
              </FormSection>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-8 py-5 border-t border-[#E2E8F0] flex-shrink-0">
              <p className="text-xs text-[#94A3B8]"><span className="text-red-400">*</span> จำเป็นต้องกรอก</p>
              <div className="flex gap-3">
                <button
                  onClick={() => { setModalMode("closed"); setSelectedPatient(null); }}
                  className="px-5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm font-semibold text-[#475569] hover:bg-[#F1F5F9] transition-all"
                >
                  ยกเลิก
                </button>
                <button
                  id="btn-save-patient"
                  onClick={handleSave}
                  disabled={saveSuccess}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg active:scale-[0.98] ${saveSuccess
                    ? "bg-green-500 text-white shadow-green-500/20"
                    : "bg-gradient-to-r from-[#00C6FF] to-[#0072FF] text-white shadow-[#0072FF]/20 hover:shadow-xl hover:brightness-110"
                    }`}
                >
                  {saveSuccess ? (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      บันทึกสำเร็จ
                    </>
                  ) : (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                        <polyline points="17 21 17 13 7 13 7 21" />
                        <polyline points="7 3 7 8 15 8" />
                      </svg>
                      บันทึก
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
          from {
            opacity: 0;
            transform: scale(0.95) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
        {children}
      </div>
    </div>
  );
}

function FormField({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wide">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
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
  return `w-full px-3.5 py-2.5 rounded-xl bg-white border text-sm text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#00C6FF]/30 focus:border-[#00C6FF] transition-all ${error ? "border-red-400 ring-2 ring-red-400/20" : "border-[#E2E8F0]"
    }`;
}
