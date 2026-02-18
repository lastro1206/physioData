import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '재활 치료의 중요성 - PhysioData 가이드',
  description: '재활 치료는 부상이나 질환 후 정상적인 기능을 회복하는 데 필수적입니다. 적절한 시기에 시작하고 꾸준히 받는 것이 중요합니다.',
};

export default function RehabilitationImportancePage() {
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
            재활 치료의 중요성
          </h1>
        </div>

        <article className='prose dark:prose-invert max-w-none bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg'>
          <h2>재활 치료란?</h2>
          <p>
            재활 치료는 부상이나 질환 후 정상적인 기능을 회복하는 데 필수적입니다. 
            적절한 시기에 시작하고 꾸준히 받는 것이 중요하며, 조기 재활은 장기적인 예후에 큰 영향을 미칩니다.
          </p>

          <h2>조기 재활의 중요성</h2>
          <p>
            부상이나 수술 후 가능한 한 빨리 재활 치료를 시작하는 것이 중요합니다. 
            조기 재활은 근육 위축을 방지하고, 관절의 가동 범위를 유지하며, 합병증을 예방하는 데 도움이 됩니다.
          </p>

          <h2>재활 치료의 효과</h2>
          <ul>
            <li>근육 기능 회복 및 강화</li>
            <li>관절 가동 범위 개선</li>
            <li>통증 완화</li>
            <li>일상생활 능력 향상</li>
            <li>재부상 예방</li>
          </ul>

          <h2>개인 맞춤형 재활 프로그램</h2>
          <p>
            전문의와 상담하여 개인에게 맞는 재활 프로그램을 선택하는 것이 중요합니다. 
            각 환자의 상태, 연령, 생활 패턴 등을 고려한 맞춤형 프로그램이 가장 효과적입니다.
          </p>

          <h2>재활 치료 시 주의사항</h2>
          <ul>
            <li>무리하지 않고 점진적으로 강도 증가</li>
            <li>통증이 심할 때는 즉시 중단</li>
            <li>치료사의 지시를 정확히 따르기</li>
            <li>정기적인 재평가 및 프로그램 조정</li>
          </ul>

          <h2>장기적인 관점</h2>
          <p>
            재활 치료는 단기간의 치료가 아니라 장기적인 건강 관리를 위한 투자입니다. 
            꾸준히 치료를 받고, 생활 습관을 개선하면 장기적으로 더 건강한 생활을 유지할 수 있습니다.
          </p>

          <div className='mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg'>
            <p className='text-sm text-gray-700 dark:text-gray-300'>
              재활 치료는 전문의의 지도 하에 진행하는 것이 안전하고 효과적입니다. 
              부상이나 질환 후 가능한 한 빨리 전문의와 상담하시기 바랍니다.
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

