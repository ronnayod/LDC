import { ProductInfo, PatientInfo } from "./types";

export const mockProducts: ProductInfo[] = [
  { id: "1", code: "SET001", name: "ชุดอุปกรณ์ทำความสะอาดหลังรักษาโรคเหงือก", price: 1000, stock: 25, unit: "ชุด", category: "ชุดอุปกรณ์" },
  { id: "2", code: "SET002", name: "ชุดดูแลหลังจัดฟัน", price: 850, stock: 30, unit: "ชุด", category: "ชุดอุปกรณ์" },
  { id: "3", code: "P-001", name: "ยาสีฟัน สูตรเซนซิทีฟ", price: 150, stock: 50, unit: "หลอด", category: "ยาสีฟัน" },
  { id: "4", code: "P-002", name: "แปรงสีฟัน ขนนุ่มพิเศษ", price: 80, stock: 100, unit: "ด้าม", category: "แปรงสีฟัน" },
  { id: "5", code: "P-003", name: "น้ำยาบ้วนปาก 500ml", price: 120, stock: 40, unit: "ขวด", category: "น้ำยาบ้วนปาก" },
  { id: "6", code: "P-004", name: "ไหมขัดฟัน เคลือบแว็กซ์", price: 60, stock: 80, unit: "กล่อง", category: "อุปกรณ์" },
  { id: "7", code: "P-005", name: "ยาพาราเซตามอล 500mg", price: 50, stock: 200, unit: "แผง", category: "ยา" },
  { id: "8", code: "P-006", name: "เจลฟลูออไรด์ทาฟัน", price: 250, stock: 35, unit: "หลอด", category: "ยาสีฟัน" },
  { id: "9", code: "SET003", name: "ชุดฟอกสีฟัน Home Use", price: 2500, stock: 15, unit: "ชุด", category: "ชุดอุปกรณ์" },
  { id: "10", code: "P-007", name: "แผ่นฟอกสีฟัน 14 แผ่น", price: 490, stock: 20, unit: "กล่อง", category: "อุปกรณ์" },
  { id: "11", code: "P-008", name: "ยาแก้ปวด Ibuprofen 400mg", price: 65, stock: 150, unit: "แผง", category: "ยา" },
  { id: "12", code: "P-009", name: "น้ำยาบ้วนปากสูตรเด็ก 250ml", price: 95, stock: 60, unit: "ขวด", category: "น้ำยาบ้วนปาก" },
];

export const mockPatients: PatientInfo[] = [
  { id: "1", hn: "RK-122094223", name: "สิทธิชัย โสภา", phone: "081-234-5678", idCard: "1-2501-01490-43-3", gender: "ชาย", age: 35, lastVisit: "12/06/66", type: "VIP", deposit: 5000 },
  { id: "2", hn: "RK-122094224", name: "พรรษา ธาดาวรวงศ์", phone: "082-345-6789", idCard: "1-3401-00123-45-6", gender: "หญิง", age: 28, lastVisit: "15/06/66", type: "ทั่วไป", deposit: 0 },
  { id: "3", hn: "RK-122094225", name: "จีรารัตน์ ธรรมวงศ์", phone: "083-456-7890", idCard: "1-1001-01234-56-7", gender: "หญิง", age: 42, lastVisit: "20/06/66", type: "VIP", deposit: 2000 },
  { id: "4", hn: "RK-122094226", name: "สมชาย ใจดี", phone: "084-567-8901", idCard: "1-5601-09876-54-3", gender: "ชาย", age: 50, lastVisit: "01/07/66", type: "ทั่วไป", deposit: 0 },
  { id: "5", hn: "RK-122094227", name: "นภาพร ศรีสุวรรณ", phone: "085-678-9012", idCard: "1-7301-05678-12-9", gender: "หญิง", age: 31, lastVisit: "05/07/66", type: "ทั่วไป", deposit: 1000 },
  { id: "6", hn: "RK-122094228", name: "ปรมินทร์ เจริญสุข", phone: "086-789-0123", idCard: "1-1002-04567-89-0", gender: "ชาย", age: 27, lastVisit: "10/07/66", type: "VIP", deposit: 3000 },
];
