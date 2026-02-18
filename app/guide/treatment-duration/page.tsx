import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '치료 횟수와 기간 결정하기 - PhysioData 가이드',
  description: '물리치료 치료 횟수와 기간은 질환의 종류와 심각도에 따라 달라집니다. 급성 통증과 만성 질환의 치료 기간을 알아보세요.',
};

export default function TreatmentDurationPage() {
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
            치료 횟수와 기간 결정하기
          </h1>
        </div>

        <article className='prose dark:prose-invert max-w-none bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg'>
          <h2>급성 통증</h2>
          <p>
            급성 통증의 경우 1~2주 정도의 단기 치료로 충분합니다. 근육 긴장이나 경미한 염증의 경우 
            일주일에 2~3회 정도의 치료로 빠르게 회복할 수 있습니다.
          </p>

          <h2>만성 질환</h2>
          <p>
            만성 질환이나 재활 치료의 경우 수개월에 걸친 장기 치료가 필요할 수 있습니다. 
            척추 디스크, 관절염, 수술 후 재활 등의 경우 정기적인 치료가 필요하며, 
            치료 계획에 따라 주 1~2회 정도의 방문이 권장됩니다.
          </p>

          <h2>치료 기간에 영향을 미치는 요인</h2>
          <ul>
            <li>질환의 종류와 심각도</li>
            <li>환자의 연령과 전반적인 건강 상태</li>
            <li>치료 시작 시기 (조기 치료가 중요)</li>
            <li>집에서의 운동 및 생활 습관 개선</li>
            <li>치료사의 경력과 전문성</li>
          </ul>

          <h2>치료 효과를 높이는 방법</h2>
          <p>
            정기적인 방문뿐만 아니라 병원에서 배운 운동을 집에서도 꾸준히 실시하는 것이 중요합니다. 
            또한 생활 습관 개선, 올바른 자세 유지, 충분한 휴식 등도 치료 효과에 큰 영향을 미칩니다.
          </p>

          <div className='mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg'>
            <p className='text-sm text-gray-700 dark:text-gray-300'>
              치료 계획은 전문의와 상담을 통해 개인에게 맞게 수립하는 것이 중요합니다.
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

