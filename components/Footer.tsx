import Link from 'next/link';

export default function Footer() {
  return (
    <footer className='bg-gray-900 dark:bg-black text-gray-300 mt-16'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
          {/* 서비스 소개 */}
          <div>
            <h3 className='text-white font-semibold mb-4'>PhysioData</h3>
            <p className='text-sm text-gray-400 mb-4'>
              PhysioData는 공공데이터를 기반으로 재활 정보를 제공하는 전문 플랫폼입니다.
              전국의 물리치료 및 재활 병원 정보를 신뢰할 수 있는 데이터로 제공합니다.
            </p>
            <div className='flex items-center gap-2 text-sm text-gray-400'>
              <svg
                className='w-4 h-4'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                />
              </svg>
              <a
                href='mailto:contact@physiodata.kr'
                className='hover:text-white transition-colors'>
                contact@physiodata.kr
              </a>
            </div>
          </div>

          {/* 빠른 링크 */}
          <div>
            <h3 className='text-white font-semibold mb-4'>빠른 링크</h3>
            <ul className='space-y-2 text-sm'>
              <li>
                <Link href='/' className='hover:text-white transition-colors'>
                  병원 찾기
                </Link>
              </li>
              <li>
                <Link href='/statistics' className='hover:text-white transition-colors'>
                  지역별 가격 통계
                </Link>
              </li>
              <li>
                <Link href='/guide' className='hover:text-white transition-colors'>
                  가이드
                </Link>
              </li>
            </ul>
          </div>

          {/* 법적 페이지 */}
          <div>
            <h3 className='text-white font-semibold mb-4'>법적 정보</h3>
            <ul className='space-y-2 text-sm'>
              <li>
                <Link href='/privacy' className='hover:text-white transition-colors'>
                  개인정보처리방침
                </Link>
              </li>
              <li>
                <Link href='/terms' className='hover:text-white transition-colors'>
                  이용약관
                </Link>
              </li>
              <li>
                <Link href='/contact' className='hover:text-white transition-colors'>
                  문의하기
                </Link>
              </li>
            </ul>
          </div>

          {/* 연락처 */}
          <div>
            <h3 className='text-white font-semibold mb-4'>문의</h3>
            <p className='text-sm text-gray-400 mb-4'>
              서비스 이용 중 궁금한 점이 있으시면 언제든지 문의해주세요.
            </p>
            <div className='space-y-2 text-sm'>
              <div className='flex items-center gap-2 text-gray-400'>
                <svg
                  className='w-4 h-4'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                  />
                </svg>
                <a
                  href='mailto:contact@physiodata.kr'
                  className='hover:text-white transition-colors'>
                  contact@physiodata.kr
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className='mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-400'>
          <p className='font-semibold text-gray-300 mb-2'>© 2024 PhysioData. All rights reserved.</p>
          <p className='mt-2'>
            PhysioData는 공공데이터를 기반으로 재활 정보를 제공하는 전문 플랫폼입니다.
            본 서비스는 공공데이터를 기반으로 하며, 실제 병원 방문 시 정보가 다를 수 있습니다.
          </p>
        </div>
      </div>
    </footer>
  );
}

