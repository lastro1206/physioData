import { NextResponse } from 'next/server';

/**
 * ads.txt Route Handler
 * 구글 애드센스 크롤러가 /ads.txt 경로에서 파일을 찾을 수 있도록 동적으로 제공
 * 
 * 환경 변수에서 게시자 ID를 가져와서 동적으로 생성합니다.
 * public/ads.txt 파일도 있지만, Route Handler가 우선순위가 높습니다.
 */
export async function GET() {
  // 환경 변수에서 게시자 ID 가져오기
  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID || 'pub-5675588895907821';
  
  // ads.txt 형식에 맞게 콘텐츠 생성
  const content = `google.com, ${publisherId}, DIRECT, f08c47fec0942fa0`;

  return new NextResponse(content, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600', // 1시간 캐시
    },
  });
}

