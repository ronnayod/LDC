# 🦷 LDC Dental Clinic — ระบบจัดการคลินิกทันตกรรม

ระบบ CRM สำหรับจัดการคลินิกทันตกรรม LDC — จัดการคนไข้ นัดหมาย รักษา บัญชี และอื่นๆ

---

## 📋 สารบัญ

- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [การติดตั้งโปรเจค](#-การติดตั้งโปรเจค)
- [Dependencies ที่ติดตั้ง](#-dependencies-ที่ติดตั้ง)
- [โครงสร้างโปรเจค](#-โครงสร้างโปรเจค)
- [คำสั่งที่ใช้งาน](#-คำสั่งที่ใช้งาน)
- [การตั้งค่า](#-การตั้งค่า)

---

## 🛠 Tech Stack

| เทคโนโลยี | เวอร์ชัน | คำอธิบาย |
|---|---|---|
| **Next.js** | `16.2.3` | React Framework (App Router) |
| **React** | `19.2.4` | UI Library |
| **TypeScript** | `^5` | Type-safe JavaScript |
| **Tailwind CSS** | `v4` | Utility-first CSS Framework |
| **Node.js** | `v24.13.0` | JavaScript Runtime |

---

## ✅ Prerequisites

ก่อนติดตั้งโปรเจคนี้ ต้องมีสิ่งเหล่านี้ในเครื่อง:

- **Node.js** >= 20.x — [ดาวน์โหลด](https://nodejs.org/)
- **npm** >= 10.x (มากับ Node.js)
- **Git** — [ดาวน์โหลด](https://git-scm.com/)

---

## 🚀 การติดตั้งโปรเจค

### 1. Clone โปรเจค

```bash
git clone <repository-url>
cd ldc
```

### 2. ติดตั้ง Dependencies ทั้งหมด

```bash
npm install
```

### 3. รัน Development Server

```bash
npm run dev
```

เปิดเบราว์เซอร์ไปที่ [http://localhost:3000](http://localhost:3000)

---

## 📦 Dependencies ที่ติดตั้ง

### Production Dependencies

| แพ็กเกจ | เวอร์ชัน | คำอธิบาย |
|---|---|---|
| `next` | `16.2.3` | React Framework สำหรับ SSR/SSG พร้อม App Router |
| `react` | `19.2.4` | ไลบรารีหลักสำหรับสร้าง UI |
| `react-dom` | `19.2.4` | React renderer สำหรับ Browser DOM |

### Dev Dependencies

| แพ็กเกจ | เวอร์ชัน | คำอธิบาย |
|---|---|---|
| `tailwindcss` | `^4` | Utility-first CSS Framework |
| `@tailwindcss/postcss` | `^4` | PostCSS Plugin สำหรับ Tailwind CSS v4 |
| `typescript` | `^5` | TypeScript Compiler |
| `@types/node` | `^20` | TypeScript types สำหรับ Node.js |
| `@types/react` | `^19` | TypeScript types สำหรับ React |
| `@types/react-dom` | `^19` | TypeScript types สำหรับ React DOM |
| `eslint` | `^9` | JavaScript/TypeScript Linter |
| `eslint-config-next` | `16.2.3` | ESLint config จาก Next.js (รวม Core Web Vitals + TypeScript rules) |

### Fonts & Icons

| รายการ | แหล่งที่มา | คำอธิบาย |
|---|---|---|
| **Inter** | `next/font/google` | ฟอนต์หลักของระบบ (Google Fonts, โหลดผ่าน Next.js) |
| **SVG Icons** | `/public/` | ไอคอน SVG ที่ใช้ในโปรเจค (`file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg`) |
| **Inline SVG Icons** | Components | ไอคอนที่วาดด้วย SVG inline ภายใน Components (Sidebar, Topbar, StatCard) |

---

### 📥 คำสั่งติดตั้งย้อนหลัง (สำหรับอ้างอิง)

โปรเจคนี้ถูกสร้างและติดตั้งไลบรารีตามลำดับดังนี้:

```bash
# 1. สร้างโปรเจค Next.js 16 ด้วย create-next-app
npx -y create-next-app@latest ./ --typescript --tailwind --eslint --app --src-dir --no-turbopack

# 2. Dependencies ทั้งหมดถูกติดตั้งโดยอัตโนมัติผ่าน create-next-app:
#    - next@16.2.3
#    - react@19.2.4
#    - react-dom@19.2.4
#    - tailwindcss@^4
#    - @tailwindcss/postcss@^4
#    - typescript@^5
#    - @types/node@^20
#    - @types/react@^19
#    - @types/react-dom@^19
#    - eslint@^9
#    - eslint-config-next@16.2.3
```

> **หมายเหตุ:** โปรเจคนี้ยังไม่ได้ติดตั้ง icon library เพิ่มเติม (เช่น `lucide-react`, `react-icons`) — ไอคอนทั้งหมดเป็น inline SVG ที่วาดเองภายใน Components

---

## 📁 โครงสร้างโปรเจค

```
ldc/
├── public/                     # Static assets (SVG icons, favicon)
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── src/
│   ├── app/
│   │   ├── globals.css         # Design System (Tailwind v4 theme, animations, glassmorphism)
│   │   ├── layout.tsx          # Root Layout (Inter font, metadata)
│   │   ├── favicon.ico
│   │   ├── login/              # หน้า Login
│   │   │   └── page.tsx
│   │   └── (dashboard)/        # Route Group — Dashboard Layout
│   │       ├── layout.tsx      # Dashboard Layout (Sidebar + Topbar)
│   │       ├── page.tsx        # หน้า Dashboard หลัก
│   │       ├── patients/       # จัดการคนไข้
│   │       ├── appointments/   # ตารางนัดหมาย
│   │       ├── appointment-management/  # จัดการนัดหมาย
│   │       ├── treatments/     # การรักษา
│   │       ├── dentist-schedule/ # ตารางทันตแพทย์
│   │       ├── accounting/     # บัญชี
│   │       ├── sales/          # การขาย
│   │       ├── lab/            # แลป
│   │       ├── crm/            # CRM
│   │       ├── reports/        # รายงาน
│   │       └── forms/          # แบบฟอร์ม
│   └── components/
│       ├── Sidebar.tsx         # Sidebar Navigation
│       ├── Topbar.tsx          # Top Bar (search, notifications, user)
│       ├── StatCard.tsx        # Stat Card Component
│       └── BarChart.tsx        # Bar Chart Component
├── next.config.ts              # Next.js Configuration
├── tsconfig.json               # TypeScript Configuration (path alias: @/* → ./src/*)
├── postcss.config.mjs          # PostCSS Configuration (Tailwind CSS v4 plugin)
├── eslint.config.mjs           # ESLint Configuration (Next.js + TypeScript rules)
├── package.json
└── package-lock.json
```

---

## ⚡ คำสั่งที่ใช้งาน

| คำสั่ง | คำอธิบาย |
|---|---|
| `npm run dev` | รัน Development Server (http://localhost:3000) |
| `npm run build` | Build สำหรับ Production |
| `npm run start` | รัน Production Server |
| `npm run lint` | ตรวจสอบโค้ดด้วย ESLint |

---

## ⚙️ การตั้งค่า

### Path Alias

ใช้ `@/*` แทน `./src/*` ในการ import:

```tsx
import Sidebar from "@/components/Sidebar";
```

### Tailwind CSS v4

ใช้ Tailwind CSS v4 ผ่าน PostCSS Plugin — ตั้งค่า theme ใน `globals.css` ด้วย `@theme inline`:

```css
@import "tailwindcss";

@theme inline {
  --color-primary: #2B5998;
  --font-sans: "Inter", system-ui, -apple-system, sans-serif;
  /* ... */
}
```

### ESLint

ใช้ ESLint v9 (Flat Config) พร้อม Next.js Core Web Vitals + TypeScript rules:

```js
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
```

---

## 📚 แหล่งข้อมูลเพิ่มเติม

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
