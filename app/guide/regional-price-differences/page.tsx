import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '지역별 물리치료 가격 차이 - PhysioData 가이드',
  description: '서울, 경기, 부산 등 지역별 물리치료 가격 차이를 알아보고, 지역에 따른 비용 차이의 원인을 이해하세요.',
};

export default function RegionalPriceDifferencesPage() {
  return (
    <div className='min-h-screen bg-gray-50 dark:bg-black'>
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <div className='mb-8'>
          <Link
            href='/'
            className='inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline mb-4'>
            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M10 19l-7-7m0 0l7-7m-7 7h18' />
            </svg>
            홈으로 돌아가기
          </Link>
          <h1 className='text-4xl font-bold text-gray-900 dark:text-gray-50 mb-4'>
            지역별 물리치료 가격 차이
          </h1>
        </div>

        <article className='prose dark:prose-invert max-w-none bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg'>
          <h2>대도시 vs 지방</h2>
          <p>
            서울특별시의 경우 대도시 특성상 평균적으로 1회당 15만원 정도의 비용이 소요되며, 
            경기도는 13만원, 부산광역시는 12만원 수준입니다. 전국 평균은 약 12.5만원 정도로 집계됩니다. 
            다만 이는 비급여 항목 기준이며, 건강보험이 적용되는 경우 본인부담금은 훨씬 낮아집니다.
          </p>

          <h2>가격 차이의 원인</h2>
          <ul>
            <li><strong>임대료:</strong> 대도시 중심가의 높은 임대료가 치료비에 반영</li>
            <li><strong>인건비:</strong> 지역별 인건비 차이</li>
            <li><strong>시설 투자:</strong> 최신 장비 투자 비용</li>
            <li><strong>경쟁 환경:</strong> 지역별 경쟁 정도에 따른 가격 책정</li>
          </ul>

          <h2>지역별 평균 가격</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 my-6'>
            <div className='bg-blue-50 dark:bg-gray-700 p-4 rounded-lg'>
              <h3 className='font-semibold mb-2'>서울특별시</h3>
              <p className='text-2xl font-bold text-blue-600 dark:text-blue-400'>약 15만원</p>
            </div>
            <div className='bg-indigo-50 dark:bg-gray-700 p-4 rounded-lg'>
              <h3 className='font-semibold mb-2'>경기도</h3>
              <p className='text-2xl font-bold text-indigo-600 dark:text-indigo-400'>약 13만원</p>
            </div>
            <div className='bg-purple-50 dark:bg-gray-700 p-4 rounded-lg'>
              <h3 className='font-semibold mb-2'>부산광역시</h3>
              <p className='text-2xl font-bold text-purple-600 dark:text-purple-400'>약 12만원</p>
            </div>
            <div className='bg-green-50 dark:bg-gray-700 p-4 rounded-lg'>
              <h3 className='font-semibold mb-2'>전국 평균</h3>
              <p className='text-2xl font-bold text-green-600 dark:text-green-400'>약 12.5만원</p>
            </div>
          </div>

          <h2>비용 절감 방법</h2>
          <p>
            교외 지역이나 지방의 병원을 선택하거나, 건강보험이 적용되는 항목을 우선적으로 선택하면 비용을 절감할 수 있습니다. 
            또한 장기 치료 계약 시 할인 혜택을 받을 수 있는지 문의해보는 것도 좋습니다.
          </p>

          <div className='mt-8 p-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg'>
            <p className='text-sm text-gray-700 dark:text-gray-300'>
              위 가격은 비급여 항목 기준이며, 건강보험 적용 시 본인부담금은 훨씬 낮아집니다.
            </p>
          </div>
        </article>

        <div className='mt-8'>
          <Link
            href='/statistics'
            className='inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium'>
            상세 지역별 통계 보기
          </Link>
        </div>
      </div>
    </div>
  );
}

