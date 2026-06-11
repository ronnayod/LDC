# 🦷lunithic management — ระบบจัดการคลินิก

ระบบ CRM สำหรับจัดการคลินิกlunithic management  — จัดการคนไข้ นัดหมาย รักษา บัญชี และอื่นๆ

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
cd lunithic management
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
lunithic management/
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

## 🔀 คำสั่ง Git ที่ใช้บ่อย

### พื้นฐาน — Add / Commit / Push / Pull

```bash
# ดูสถานะไฟล์ (มีอะไรเปลี่ยนบ้าง)
git status

# เพิ่มไฟล์ทั้งหมดเข้า staging
git add .

# เพิ่มเฉพาะไฟล์ที่ต้องการ
git add src/app/page.tsx

# Commit พร้อมข้อความ
git commit -m "feat: เพิ่มหน้า dashboard"

# Push ขึ้น remote (origin) branch main
git push origin main

# Pull ดึงโค้ดล่าสุดจาก remote
git pull origin main

# Push ครั้งแรก (ตั้ง upstream)
git push -u origin main
```

### Branch — สร้าง / สลับ / ลบ

```bash
# ดู branch ทั้งหมด
git branch

# ดู branch ทั้งหมด (รวม remote)
git branch -a

# สร้าง branch ใหม่
git branch feature/new-page

# สลับไป branch อื่น
git checkout feature/new-page

# สร้าง + สลับไป branch ใหม่ (ทางลัด)
git checkout -b feature/new-page

# ลบ branch ที่ merge แล้ว
git branch -d feature/new-page

# ลบ branch แบบบังคับ (ยังไม่ merge)
git branch -D feature/new-page
```

### Merge / Rebase

```bash
# Merge branch เข้า main
git checkout main
git merge feature/new-page

# Rebase (เรียง commit ใหม่ให้เป็นเส้นตรง)
git checkout feature/new-page
git rebase main

# ยกเลิก merge ที่มี conflict
git merge --abort

# ยกเลิก rebase ที่มี conflict
git rebase --abort
```

### ย้อนกลับ / แก้ไข

```bash
# แก้ไข commit ล่าสุด (เปลี่ยนข้อความ)
git commit --amend -m "fix: แก้ข้อความ commit"

# เพิ่มไฟล์เข้า commit ล่าสุด (ไม่เปลี่ยนข้อความ)
git add .
git commit --amend --no-edit

# ยกเลิกการ add (unstage)
git reset HEAD src/app/page.tsx

# ย้อนไฟล์กลับเป็นเหมือน commit ล่าสุด (⚠️ ข้อมูลหาย)
git checkout -- src/app/page.tsx

# ย้อน commit ล่าสุด (เก็บไฟล์ไว้ใน staging)
git reset --soft HEAD~1

# ย้อน commit ล่าสุด (เก็บไฟล์ไว้แต่ unstage)
git reset --mixed HEAD~1

# ย้อน commit ล่าสุด (⚠️ ลบทุกอย่าง)
git reset --hard HEAD~1

# สร้าง commit ใหม่ที่ย้อนการเปลี่ยนแปลง (ปลอดภัย)
git revert HEAD
```

### Stash — เก็บงานชั่วคราว

```bash
# เก็บงานที่ยังไม่เสร็จไว้ชั่วคราว
git stash

# เก็บพร้อมตั้งชื่อ
git stash save "กำลังทำหน้า login"

# ดู stash ทั้งหมด
git stash list

# เอางานกลับมา (ลบ stash)
git stash pop

# เอางานกลับมา (เก็บ stash ไว้)
git stash apply
```

### Log / ดูประวัติ

```bash
# ดูประวัติ commit
git log

# ดูแบบย่อ 1 บรรทัด
git log --oneline

# ดู 5 commit ล่าสุด
git log --oneline -5

# ดูประวัติแบบกราฟ
git log --oneline --graph --all

# ดูว่าไฟล์ถูกแก้อะไรบ้าง
git diff

# ดูความต่างของไฟล์ที่ add แล้ว
git diff --staged
```

### Remote — จัดการ Repository

```bash
# ดู remote ทั้งหมด
git remote -v

# เพิ่ม remote ใหม่
git remote add origin https://github.com/user/repo.git

# เปลี่ยน URL ของ remote
git remote set-url origin https://github.com/user/new-repo.git

# ดึงข้อมูล remote (ไม่ merge)
git fetch origin

# ลบ branch บน remote
git push origin --delete feature/old-branch
```

### Clone / Init

```bash
# Clone โปรเจคจาก GitHub
git clone https://github.com/user/repo.git

# Clone เฉพาะ branch
git clone -b develop https://github.com/user/repo.git

# สร้าง Git repo ใหม่ในโฟลเดอร์ปัจจุบัน
git init
```

### 💡 ลำดับการทำงานปกติ (Workflow)

```bash
# 1. ดึงโค้ดล่าสุด
git pull origin main

# 2. สร้าง branch ใหม่
git checkout -b feature/my-feature

# 3. เขียนโค้ด...

# 4. ดูสถานะ
git status

# 5. Add ไฟล์
git add .

# 6. Commit
git commit -m "feat: เพิ่มฟีเจอร์ใหม่"

# 7. Push ขึ้น remote
git push origin feature/my-feature

# 8. สร้าง Pull Request บน GitHub
# 9. หลัง merge แล้ว กลับมา main
git checkout main
git pull origin main
```

---

## 📚 แหล่งข้อมูลเพิ่มเติม

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
