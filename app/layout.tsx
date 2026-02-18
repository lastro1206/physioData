import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const adClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

export const metadata: Metadata = {
  title: "물리치료 병원 정보 - 전국 재활 병원 데이터",
  description: "전국의 물리치료 및 재활 병원 정보를 제공하는 데이터 대시보드",
  other: {
    "google-adsense-account": adClient || "",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang='ko'
      suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Google AdSense 스크립트 */}
        {/* Next.js Script 컴포넌트는 body에 렌더링되지만, strategy="afterInteractive"로 최적화 */}
        {/* 페이지가 인터랙티브해진 후 로드되어 성능에 최적화됩니다 */}
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adClient}`}
          crossOrigin='anonymous'
          strategy='afterInteractive'
        />
        <ThemeProvider
          attribute='class'
          defaultTheme='light'
          enableSystem={false}
          disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
