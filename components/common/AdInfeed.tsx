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
      if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
        if (adRef.current && !adRef.current.querySelector('.adsbygoogle[data-ad-slot="' + slot + '"]')) {
          ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
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

