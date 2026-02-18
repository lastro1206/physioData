import { NextResponse } from 'next/server';
import { getAllHospitalIdsPaginated } from '@/lib/static-generation';

/**
 * Sitemap XML API Route
 * 모든 병원 상세 페이지를 포함한 sitemap.xml을 동적으로 생성합니다.
 * 
 * 사용법: GET /api/sitemap
 */
export async function GET() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL 
      || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://yourdomain.com');

    // 모든 병원 ID 가져오기
    const hospitalIds = await getAllHospitalIdsPaginated(1000);
    
    // 가이드 페이지들
    const guidePages = [
      '/guide',
      '/guide/physical-vs-manual-therapy',
      '/guide/cost-factors',
      '/guide/regional-price-differences',
      '/guide/treatment-duration',
      '/guide/insurance-coverage',
      '/guide/hospital-selection',
      '/guide/maximizing-effectiveness',
      '/guide/rehabilitation-importance',
      '/statistics',
    ];

    // Sitemap XML 생성
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- 메인 페이지 -->
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  
  <!-- 가이드 및 통계 페이지 -->
  ${guidePages.map(path => `
  <url>
    <loc>${baseUrl}${path}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`).join('')}
  
  <!-- 병원 상세 페이지들 -->
  ${hospitalIds.map(id => `
  <url>
    <loc>${baseUrl}/hospitals/${id}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('')}
</urlset>`;

    return new NextResponse(sitemap, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600', // 1시간 캐시
      },
    });
  } catch (error) {
    console.error('[Sitemap API] Error generating sitemap:', error);
    return new NextResponse(
      '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>',
      {
        status: 500,
        headers: {
          'Content-Type': 'application/xml; charset=utf-8',
        },
      }
    );
  }
}

