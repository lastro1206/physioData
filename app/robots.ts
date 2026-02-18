import { MetadataRoute } from 'next';

/**
 * robots.txt 생성
 * Next.js 14 App Router의 동적 robots.txt 기능 사용
 * 
 * 자동으로 /robots.txt 경로에 생성됩니다.
 */
export default function robots(): MetadataRoute.Robots {
  // BASE_URL 고정: https:// 프로토콜 포함
  const baseUrl = 'https://physio-data.vercel.app';
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

