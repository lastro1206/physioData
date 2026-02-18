'use client';

import { useEffect } from 'react';

interface AdsUnitProps {
  slot: string;
  className?: string;
}

/**
 * 구글 애드센스 광고 유닛 컴포넌트
 * @param slot - 애드센스 광고 슬롯 ID
 * @param className - 추가 CSS 클래스
 */
export default function AdsUnit({ slot, className = '' }: AdsUnitProps) {
  useEffect(() => {
    try {
      // 구글 애드센스 스크립트가 로드된 후 광고 초기화
      if (typeof window !== 'undefined') {
        const initAd = () => {
          if ((window as any).adsbygoogle) {
            try {
              ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
            } catch (e) {
              console.error('AdSense push error:', e);
            }
          }
        };

        // 이미 로드되어 있으면 즉시 초기화
        if ((window as any).adsbygoogle) {
          initAd();
        } else {
          // 스크립트 로드를 기다림
          const checkAdSense = setInterval(() => {
            if ((window as any).adsbygoogle) {
              initAd();
              clearInterval(checkAdSense);
            }
          }, 100);

          // 5초 후 타임아웃
          setTimeout(() => clearInterval(checkAdSense), 5000);
        }
      }
    } catch (e) {
      console.error('AdSense initialization error:', e);
    }
  }, []);

  // 환경 변수에서 애드센스 클라이언트 ID 가져오기
  const adClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || 'ca-pub-YOUR_ID';

  return (
    <div className={`my-8 flex justify-center overflow-hidden ${className}`}>
      <ins
        className='adsbygoogle'
        style={{ display: 'block' }}
        data-ad-client={adClient}
        data-ad-slot={slot}
        data-ad-format='auto'
        data-full-width-responsive='true'
      />
    </div>
  );
}

