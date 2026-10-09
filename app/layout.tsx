import type { Metadata } from "next";
import { Be_Vietnam_Pro, Noto_Serif } from "next/font/google";
import "./globals.css";

const beVietnamPro = Be_Vietnam_Pro({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["vietnamese", "latin"],
  variable: "--font-sans",
  display: "swap",
});

const notoSerif = Noto_Serif({
  weight: ["400", "600", "700"],
  subsets: ["vietnamese", "latin"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tu Tiên Chi Lộ | Đạo Môn Vấn Đỉnh - Text-RPG Cổ Phong",
  description: "Khám phá đại đạo trường sinh: Bế quan tu luyện, đột phá cảnh giới, lịch luyện bí cảnh, độ kiếp trảm ma trong thế giới Tu Chân Thủy Mặc.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="vi"
      className={`${beVietnamPro.variable} ${notoSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
