import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "LDC Dental Clinic — ระบบจัดการคลินิกทันตกรรม",
  description: "ระบบ CRM สำหรับจัดการคลินิกทันตกรรม LDC — จัดการคนไข้ นัดหมาย รักษา บัญชี และอื่นๆ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={`${inter.variable} h-full`}>
      <body className="min-h-full font-sans antialiased">{children}</body>
    </html>
  );
}
