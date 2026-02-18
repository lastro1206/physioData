import { MetadataRoute } from 'next';

/**
 * robots.txt 생성
 * Next.js 14 App Router의 동적 robots.txt 기능 사용
 * 
 * 자동으로 /robots.txt 경로에 생성됩니다.
 */
export default function robots(): MetadataRoute.Robots {
  // 환경 변수에서 사이트 URL 가져오기
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL 
    || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://yourdomain.com');
  
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

