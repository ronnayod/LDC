import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Lunithic Mockup — ระบบจัดการคลินิกทันตกรรม",
  description: "ระบบ CRM สำหรับจัดการคลินิกทันตกรรม Lunithic Mockup  — จัดการคนไข้ นัดหมาย รักษา บัญชี และอื่นๆ",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    viewportFit: "cover",
  },
  themeColor: "#0E1726",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={`${inter.variable} h-full`} suppressHydrationWarning>
      <body className="min-h-full font-sans antialiased" suppressHydrationWarning>{children}</body>
    </html>
  );
}
