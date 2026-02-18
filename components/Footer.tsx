import Link from 'next/link';

export default function Footer() {
  return (
    <footer className='bg-gray-900 dark:bg-black text-gray-300 mt-16'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
          {/* 서비스 소개 */}
          <div>
            <h3 className='text-white font-semibold mb-4'>물리치료 병원 정보</h3>
            <p className='text-sm text-gray-400'>
              전국의 물리치료 및 재활 병원 정보를 제공하는 데이터 대시보드입니다.
            </p>
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
                <Link href='/guide/physical-vs-manual-therapy' className='hover:text-white transition-colors'>
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
            <p className='text-sm text-gray-400'>
              서비스 이용 중 궁금한 점이 있으시면 문의하기 페이지를 이용해주세요.
            </p>
          </div>
        </div>

        <div className='mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-400'>
          <p>© 2024 물리치료 병원 정보. All rights reserved.</p>
          <p className='mt-2'>
            본 서비스는 공공데이터를 기반으로 하며, 실제 병원 방문 시 정보가 다를 수 있습니다.
          </p>
        </div>
      </div>
    </footer>
  );
}

