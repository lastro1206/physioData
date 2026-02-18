import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '물리치료 가이드 - PhysioData',
  description: '물리치료와 재활 치료에 대한 유용한 정보를 제공합니다. 비용, 치료 방법, 병원 선택 등 다양한 가이드를 확인하세요.',
};

const guides = [
  {
    id: 1,
    title: '물리치료와 도수치료의 차이점',
    excerpt: '물리치료와 도수치료는 모두 재활 치료의 중요한 방법이지만, 각각의 특징과 적용 분야가 다릅니다.',
    slug: 'guide/physical-vs-manual-therapy',
  },
  {
    id: 2,
    title: '물리치료 비용 결정 요인',
    excerpt: '물리치료 비용은 여러 요인에 따라 달라집니다. 건강보험 적용 여부, 병원 위치 등을 알아보세요.',
    slug: 'guide/cost-factors',
  },
  {
    id: 3,
    title: '지역별 물리치료 가격 차이',
    excerpt: '서울, 경기, 부산 등 지역별 물리치료 가격 차이를 알아보고, 지역에 따른 비용 차이의 원인을 이해하세요.',
    slug: 'guide/regional-price-differences',
  },
  {
    id: 4,
    title: '치료 횟수와 기간 결정하기',
    excerpt: '치료 횟수와 기간은 질환의 종류와 심각도에 따라 달라집니다. 급성 통증과 만성 질환의 치료 기간을 알아보세요.',
    slug: 'guide/treatment-duration',
  },
  {
    id: 5,
    title: '건강보험 적용 여부 확인하기',
    excerpt: '물리치료 비용을 결정하는 가장 중요한 요소는 건강보험 적용 여부입니다. 급여 항목과 비급여 항목의 차이를 알아보세요.',
    slug: 'guide/insurance-coverage',
  },
  {
    id: 6,
    title: '병원 선택 시 고려사항',
    excerpt: '물리치료 병원을 선택할 때는 위치, 시설, 전문의의 경력, 치료 프로그램의 다양성 등을 종합적으로 고려해야 합니다.',
    slug: 'guide/hospital-selection',
  },
  {
    id: 7,
    title: '물리치료 효과를 높이는 방법',
    excerpt: '물리치료의 효과를 극대화하기 위해서는 정기적인 방문뿐만 아니라 집에서의 운동, 생활 습관 개선 등이 중요합니다.',
    slug: 'guide/maximizing-effectiveness',
  },
  {
    id: 8,
    title: '재활 치료의 중요성',
    excerpt: '재활 치료는 부상이나 질환 후 정상적인 기능을 회복하는 데 필수적입니다. 적절한 시기에 시작하고 꾸준히 받는 것이 중요합니다.',
    slug: 'guide/rehabilitation-importance',
  },
];

export default function GuidePage() {
  return (
    <div className='min-h-screen bg-gray-50 dark:bg-black'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
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
            물리치료 가이드
          </h1>
          <p className='text-lg text-gray-600 dark:text-gray-400 max-w-2xl'>
            물리치료와 재활 치료에 대한 유용한 정보를 제공합니다. 
            비용, 치료 방법, 병원 선택 등 다양한 주제의 가이드를 확인하세요.
          </p>
        </div>

        {/* 가이드 목록 */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          {guides.map((guide) => (
            <article
              key={guide.id}
              className='bg-white dark:bg-gray-800 rounded-lg p-6 hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700'>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-50 mb-3 line-clamp-2'>
                {guide.title}
              </h3>
              <p className='text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-4'>
                {guide.excerpt}
              </p>
              <Link
                href={`/${guide.slug}`}
                className='text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium inline-flex items-center gap-1'>
                자세히 보기
                <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                </svg>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

