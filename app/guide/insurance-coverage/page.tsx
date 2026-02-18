import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '건강보험 적용 여부 확인하기 - PhysioData 가이드',
  description: '물리치료 비용을 결정하는 가장 중요한 요소는 건강보험 적용 여부입니다. 급여 항목과 비급여 항목의 차이를 알아보세요.',
};

export default function InsuranceCoveragePage() {
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
            건강보험 적용 여부 확인하기
          </h1>
        </div>

        <article className='prose dark:prose-invert max-w-none bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg'>
          <h2>급여 항목 vs 비급여 항목</h2>
          <p>
            물리치료 비용을 결정하는 가장 중요한 요소는 건강보험 적용 여부입니다. 
            급여 항목으로 인정받으면 본인부담금이 크게 줄어들지만, 비급여 항목의 경우 병원에서 자유롭게 가격을 책정할 수 있어 병원마다 차이가 큽니다.
          </p>

          <h2>급여 항목의 장점</h2>
          <ul>
            <li>본인부담금이 크게 감소 (5,000원~15,000원 수준)</li>
            <li>병원 간 가격 차이가 적음</li>
            <li>장기 치료 시 부담이 적음</li>
          </ul>

          <h2>비급여 항목의 특징</h2>
          <ul>
            <li>병원마다 가격 차이가 큼 (30,000원~100,000원 이상)</li>
            <li>자유로운 가격 책정</li>
            <li>초진 상담 시 가격 확인 필요</li>
          </ul>

          <h2>보험 적용 여부 확인 방법</h2>
          <ol>
            <li>병원에 직접 문의하여 보험 적용 여부 확인</li>
            <li>초진 상담 시 치료 항목별 보험 적용 여부 확인</li>
            <li>건강보험심사평가원 홈페이지에서 항목 조회</li>
            <li>여러 병원의 견적 비교</li>
          </ol>

          <h2>비용 절감 팁</h2>
          <p>
            가능한 한 급여 항목으로 치료받는 것이 비용 절감에 도움이 됩니다. 
            또한 장기 치료 계약 시 할인 혜택을 받을 수 있는지 문의해보는 것도 좋습니다.
          </p>

          <div className='mt-8 p-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg'>
            <p className='text-sm text-gray-700 dark:text-gray-300'>
              치료 전에 보험 적용 여부를 확인하는 것이 중요합니다. 
              정확한 정보는 병원에 직접 문의하시기 바랍니다.
            </p>
          </div>
        </article>

        <div className='mt-8'>
          <Link
            href='/'
            className='inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium'>
            병원 찾기
          </Link>
        </div>
      </div>
    </div>
  );
}

