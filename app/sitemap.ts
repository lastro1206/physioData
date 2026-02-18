import { MetadataRoute } from 'next';
import { getAllHospitalIdsPaginated } from '@/lib/static-generation';

/**
 * sitemap.xml 생성
 * Next.js 14 App Router의 동적 sitemap 기능 사용
 * 
 * 자동으로 /sitemap.xml 경로에 생성됩니다.
 * ISR: 1시간마다 재생성 (revalidate: 3600)
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 환경 변수에서 사이트 URL 가져오기
  // .env.local에 NEXT_PUBLIC_SITE_URL=https://yourdomain.com 추가 필요
  // Vercel 배포 시 자동으로 VERCEL_URL 환경 변수 사용 가능
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL 
    || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://yourdomain.com');
  
  // 메인 페이지
  const mainPage: MetadataRoute.Sitemap[0] = {
    url: baseUrl,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 1.0,
  };

  // 가이드 페이지들
  const guidePages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/guide`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/guide/physical-vs-manual-therapy`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/guide/cost-factors`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/guide/regional-price-differences`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/guide/treatment-duration`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/guide/insurance-coverage`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/guide/hospital-selection`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/guide/maximizing-effectiveness`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/guide/rehabilitation-importance`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/statistics`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
  ];

  // 병원 상세 페이지들
  let hospitalPages: MetadataRoute.Sitemap = [];
  
  try {
    // 모든 병원 ID 가져오기
    const hospitalIds = await getAllHospitalIdsPaginated(1000);
    
    console.log(`[Sitemap] Generating sitemap for ${hospitalIds.length} hospitals`);
    
    hospitalPages = hospitalIds.map((id) => ({
      url: `${baseUrl}/hospitals/${id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));
  } catch (error) {
    console.error('[Sitemap] Error fetching hospital IDs:', error);
    // 에러 발생 시에도 메인 페이지는 포함
  }

  return [mainPage, ...guidePages, ...hospitalPages];
}

/**
 * ISR 설정: 1시간마다 sitemap 재생성
 * 데이터가 변경되면 최대 1시간 내에 자동으로 업데이트됩니다.
 */
export const revalidate = 3600; // 1시간 (초 단위)

