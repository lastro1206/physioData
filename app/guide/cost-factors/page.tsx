import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '물리치료 비용 결정 요인 - PhysioData 가이드',
  description: '물리치료 비용은 여러 요인에 따라 달라집니다. 건강보험 적용 여부, 병원 위치, 시설 수준 등 비용 결정 요인을 알아보세요.',
};

export default function CostFactorsPage() {
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
            물리치료 비용 결정 요인
          </h1>
        </div>

        <article className='prose dark:prose-invert max-w-none bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg'>
          <h2>건강보험 적용 여부</h2>
          <p>
            물리치료 비용을 결정하는 가장 중요한 요소는 건강보험 적용 여부입니다. 
            건강보험이 적용되는 경우 본인부담금은 보통 1회당 5,000원~15,000원 수준이며, 
            비급여 항목의 경우 병원마다 차이가 있어 1회당 30,000원~100,000원 이상일 수 있습니다.
          </p>

          <h2>병원의 위치</h2>
          <p>
            병원의 위치도 비용에 큰 영향을 미칩니다. 대도시 중심가에 위치한 병원은 임대료가 높아 치료비도 상대적으로 높을 수 있으며, 
            교외 지역이나 지방의 병원은 더 저렴한 경우가 많습니다.
          </p>

          <h2>시설 수준과 전문의 경력</h2>
          <p>
            병원의 시설 수준, 치료사의 경력과 자격, 제공하는 치료 프로그램의 다양성 등도 비용 결정에 영향을 줍니다. 
            최신 장비를 갖춘 병원이나 경력이 풍부한 전문의가 있는 병원은 상대적으로 높은 비용을 책정할 수 있습니다.
          </p>

          <h2>치료 횟수와 기간</h2>
          <p>
            치료 횟수와 기간도 총 비용에 큰 영향을 미칩니다. 급성 통증의 경우 1~2주 정도의 단기 치료로 충분하지만, 
            만성 질환이나 재활 치료의 경우 수개월에 걸친 장기 치료가 필요할 수 있습니다.
          </p>

          <h2>비용 절감 팁</h2>
          <ul>
            <li>초진 상담을 통해 치료 계획과 예상 비용을 미리 확인</li>
            <li>건강보험 적용 여부 확인</li>
            <li>여러 병원의 견적 비교</li>
            <li>장기 치료 계약 시 할인 혜택 문의</li>
          </ul>

          <div className='mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg'>
            <p className='text-sm text-gray-700 dark:text-gray-300'>
              정확한 비용은 병원에 직접 문의하시거나 초진 상담을 통해 확인하시는 것이 가장 좋습니다.
            </p>
          </div>
        </article>

        <div className='mt-8'>
          <Link
            href='/statistics'
            className='inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium'>
            지역별 가격 통계 보기
          </Link>
        </div>
      </div>
    </div>
  );
}

