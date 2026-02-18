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
  // BASE_URL 고정: https:// 프로토콜 포함
  const siteUrl = "https://physio-data.vercel.app";

  // JSON-LD 구조화된 데이터: Organization 스키마 (병원 정보 서비스)
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}#organization`,
    name: "PhysioData",
    alternateName: "물리치료 병원 정보",
    url: siteUrl,
    logo: `${siteUrl}/favicon.ico`,
    description:
      "PhysioData는 공공데이터를 기반으로 재활 정보를 제공하는 전문 플랫폼입니다. 전국의 물리치료 및 재활 병원 정보를 신뢰할 수 있는 데이터로 제공합니다.",
    contactPoint: {
      "@type": "ContactPoint",
      email: "contact@physiodata.kr",
      contactType: "customer service",
      areaServed: "KR",
      availableLanguage: "Korean",
    },
    sameAs: [
      // 소셜 미디어 링크가 있다면 추가
    ],
    areaServed: {
      "@type": "Country",
      name: "South Korea",
    },
    serviceType: "병원 정보 제공 서비스",
    knowsAbout: ["물리치료", "도수치료", "재활 치료", "병원 정보", "의료 정보"],
  };

  // JSON-LD 구조화된 데이터: WebSite 스키마
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}#website`,
    url: siteUrl,
    name: "PhysioData - 물리치료 병원 정보",
    description: "전국의 물리치료 및 재활 병원 정보를 제공하는 데이터 대시보드",
    publisher: {
      "@id": `${siteUrl}#organization`,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html
      lang='ko'
      suppressHydrationWarning>
      <head>
        {/* JSON-LD 구조화된 데이터: Organization */}
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        {/* JSON-LD 구조화된 데이터: WebSite */}
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
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
