'use client';

import { useEffect, useRef } from 'react';

interface AdBannerProps {
  slot: string;
  format?: 'auto' | 'rectangle' | 'vertical' | 'horizontal';
  className?: string;
  style?: React.CSSProperties;
}

/**
 * 재사용 가능한 구글 애드센스 배너 광고 컴포넌트
 * useEffect를 사용하여 adsbygoogle 초기화 로직 포함
 */
export default function AdBanner({
  slot,
  format = 'auto',
  className = '',
  style,
}: AdBannerProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const adClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || 'ca-pub-YOUR_ID';

  useEffect(() => {
    try {
      // 구글 애드센스 스크립트가 로드된 후 광고 초기화
      if (typeof window !== 'undefined') {
        // 스크립트가 로드될 때까지 대기
        const initAd = () => {
          if ((window as any).adsbygoogle && adRef.current) {
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
  }, [slot]);

  return (
    <div ref={adRef} className={`flex justify-center overflow-hidden ${className}`} style={style}>
      <ins
        className='adsbygoogle'
        style={{ display: 'block' }}
        data-ad-client={adClient}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive='true'
      />
    </div>
  );
}

