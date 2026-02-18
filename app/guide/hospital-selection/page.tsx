import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '병원 선택 시 고려사항 - PhysioData 가이드',
  description: '물리치료 병원을 선택할 때는 위치, 시설, 전문의의 경력, 치료 프로그램의 다양성 등을 종합적으로 고려해야 합니다.',
};

export default function HospitalSelectionPage() {
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
            병원 선택 시 고려사항
          </h1>
        </div>

        <article className='prose dark:prose-invert max-w-none bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg'>
          <h2>위치와 접근성</h2>
          <p>
            물리치료 병원을 선택할 때는 위치, 시설, 전문의의 경력, 치료 프로그램의 다양성 등을 종합적으로 고려해야 합니다. 
            특히 만성 질환이나 재활 치료의 경우 장기간 방문해야 하므로 접근성이 중요한 요소입니다.
          </p>

          <h2>전문의의 자격과 경력</h2>
          <p>
            먼저 치료사의 자격과 경력을 확인하는 것이 중요합니다. 물리치료사 면허를 보유하고 있으며, 
            도수치료 관련 추가 자격증이나 교육 이수를 완료한 치료사가 있는 병원을 선택하는 것이 좋습니다.
          </p>

          <h2>시설과 장비</h2>
          <p>
            병원의 시설과 장비도 중요한 고려사항입니다. 깨끗하고 쾌적한 치료 환경은 환자의 심리적 안정감을 높이고 치료 효과를 극대화할 수 있습니다. 
            또한 최신 장비를 갖춘 병원은 더 다양한 치료 옵션을 제공할 수 있습니다.
          </p>

          <h2>초진 상담</h2>
          <p>
            초진 상담을 통해 치료사와의 소통이 원활한지, 치료 계획이 명확하게 설명되는지 확인하는 것도 중요합니다. 
            좋은 치료사는 환자의 상태를 정확히 진단하고, 치료 과정과 예상 결과를 명확하게 설명해줍니다.
          </p>

          <h2>치료 프로그램의 다양성</h2>
          <p>
            제공하는 치료 프로그램의 다양성도 고려해야 합니다. 개인에게 맞는 치료법을 선택할 수 있는 옵션이 많을수록 
            더 효과적인 치료를 받을 수 있습니다.
          </p>

          <h2>비용과 보험 적용</h2>
          <p>
            치료 계획과 예상 비용을 미리 확인하는 것이 좋습니다. 많은 병원에서 무료 상담 서비스를 제공하므로, 
            보험 적용 여부, 치료 기간, 예상 총 비용 등을 사전에 파악하면 예산 계획을 세우는 데 도움이 됩니다.
          </p>

          <div className='mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg'>
            <p className='text-sm text-gray-700 dark:text-gray-300'>
              여러 병원을 비교하여 자신에게 가장 적합한 병원을 선택하는 것이 중요합니다.
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

