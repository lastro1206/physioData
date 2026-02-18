import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '물리치료와 도수치료의 차이점 - PhysioData 가이드',
  description: '물리치료와 도수치료는 모두 재활 치료의 중요한 방법이지만, 각각의 특징과 적용 분야가 다릅니다. 두 치료법의 차이점과 선택 기준을 알아보세요.',
};

export default function PhysicalVsManualTherapyPage() {
  return (
    <div className='min-h-screen bg-gray-50 dark:bg-black'>
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        {/* 헤더 */}
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
            물리치료와 도수치료의 차이점
          </h1>
          <p className='text-lg text-gray-600 dark:text-gray-400'>
            두 치료법의 특징과 적용 분야를 이해하고, 자신에게 맞는 치료법을 선택하세요.
          </p>
        </div>

        {/* 본문 */}
        <article className='prose dark:prose-invert max-w-none bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg'>
          <h2>물리치료란?</h2>
          <p>
            물리치료는 전기치료, 초음파, 운동치료 등 기계적 장치를 활용한 치료를 의미합니다. 
            물리적 에너지를 이용하여 통증을 완화하고 근육의 긴장을 풀어주며, 관절의 가동 범위를 개선합니다.
          </p>

          <h2>도수치료란?</h2>
          <p>
            도수치료는 치료사의 손을 직접 사용하여 근육과 관절을 조작하는 치료법입니다. 
            기계나 장치를 사용하는 일반적인 물리치료와는 차별화된 접근 방식으로, 환자의 상태에 따라 개인 맞춤형 치료가 가능합니다.
          </p>

          <h2>주요 차이점</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6 my-6'>
            <div className='bg-blue-50 dark:bg-gray-700 p-6 rounded-lg'>
              <h3 className='text-xl font-semibold mb-3'>물리치료</h3>
              <ul className='space-y-2'>
                <li>• 기계적 장치 활용 (전기치료, 초음파 등)</li>
                <li>• 표준화된 치료 프로토콜</li>
                <li>• 통증 완화에 효과적</li>
                <li>• 다수의 환자 동시 치료 가능</li>
              </ul>
            </div>
            <div className='bg-indigo-50 dark:bg-gray-700 p-6 rounded-lg'>
              <h3 className='text-xl font-semibold mb-3'>도수치료</h3>
              <ul className='space-y-2'>
                <li>• 치료사의 손을 직접 사용</li>
                <li>• 개인 맞춤형 치료</li>
                <li>• 근본적인 원인 해결에 중점</li>
                <li>• 정확한 진단과 치료 가능</li>
              </ul>
            </div>
          </div>

          <h2>언제 어떤 치료를 선택해야 할까?</h2>
          <p>
            급성 통증이나 염증이 있는 경우 물리치료가 효과적이며, 만성 통증이나 근본적인 원인을 해결해야 하는 경우 도수치료가 더 적합합니다. 
            많은 병원에서 두 치료법을 병행하여 사용하며, 전문의와 상담하여 개인에게 맞는 치료 계획을 수립하는 것이 중요합니다.
          </p>

          <h2>치료 효과 비교</h2>
          <p>
            물리치료는 통증 완화와 근육 이완에 뛰어난 효과를 보이며, 도수치료는 근본적인 원인 해결과 장기적인 건강 개선에 도움이 됩니다. 
            두 치료법을 적절히 조합하면 더욱 효과적인 치료 결과를 얻을 수 있습니다.
          </p>

          <div className='mt-8 p-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg'>
            <p className='text-sm text-gray-700 dark:text-gray-300'>
              <strong>참고:</strong> 정확한 치료 방법은 전문의와 상담을 통해 결정하시기 바랍니다. 
              병원에 직접 문의하여 개인에게 맞는 치료 계획을 수립하는 것이 중요합니다.
            </p>
          </div>
        </article>

        {/* 관련 링크 */}
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

