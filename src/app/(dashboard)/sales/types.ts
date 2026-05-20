// ─── Sales Types ─────────────────────────────────────────
export interface ProductInfo {
  id: string;
  code: string;
  name: string;
  price: number;
  stock: number;
  unit: string;
  category: string;
}

export interface CartItem {
  id: string;
  code: string;
  name: string;
  price: number;
  qty: number;
  discount: number;
}

export interface PatientInfo {
  id: string;
  hn: string;
  name: string;
  phone: string;
  idCard: string;
  gender: "ชาย" | "หญิง";
  age: number;
  lastVisit: string;
  type: "ทั่วไป" | "VIP";
  deposit: number;
}

export interface SaleRecord {
  id: string;
  receiptNo: string;
  date: string;
  patientName: string;
  patientHn: string;
  items: CartItem[];
  total: number;
  paymentMethod: string;
}
