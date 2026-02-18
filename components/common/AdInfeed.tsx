'use client';

import { useEffect, useRef } from 'react';

interface AdInfeedProps {
  slot: string;
  className?: string;
}

/**
 * 인피드 광고 컴포넌트 (병원 목록 사이에 자연스럽게 삽입)
 */
export default function AdInfeed({ slot, className = '' }: AdInfeedProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const adClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || 'ca-pub-YOUR_ID';

  useEffect(() => {
    try {
      // 구글 애드센스 스크립트가 로드된 후 광고 초기화
      if (typeof window !== 'undefined') {
        const initAd = () => {
          if ((window as any).adsbygoogle && adRef.current) {
            try {
              ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
            } catch (e) {
              console.error('AdSense Infeed push error:', e);
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
      console.error('AdSense Infeed initialization error:', e);
    }
  }, [slot]);

  return (
    <div ref={adRef} className={`my-6 ${className}`}>
      <ins
        className='adsbygoogle'
        style={{ display: 'block', textAlign: 'center' }}
        data-ad-client={adClient}
        data-ad-slot={slot}
        data-ad-format='fluid'
        data-layout-key='-6t+ed+2i-1n-4w'
        data-full-width-responsive='true'
      />
    </div>
  );
}

