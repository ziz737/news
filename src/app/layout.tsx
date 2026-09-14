import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "المنصة الإخبارية العاجلة | أخبار السياسة والحروب لحظة بلحظة",
  description: "منصة أخبار عاجلة متخصصة في الشأن السياسي والحروب الدائرة حول العالم - تحديث تلقائي لحظي",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className="antialiased min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
