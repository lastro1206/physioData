import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 정적 페이지 생성 최적화
  output: 'standalone', // Vercel 배포 시 최적화
  
  // 이미지 최적화 설정
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // 모든 HTTPS 이미지 허용 (필요시 특정 도메인으로 제한)
      },
    ],
  },

  // 빌드 타임 최적화
  experimental: {
    // 정적 페이지 생성 시 메모리 사용량 최적화
    optimizePackageImports: ['@supabase/supabase-js'],
  },
};

export default nextConfig;
