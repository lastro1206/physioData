import Link from 'next/link';

/**
 * 물리치료 가이드 글 섹션 컴포넌트
 * SEO를 위한 텍스트 콘텐츠 제공
 */
export default function GuideSection() {
  const guides = [
    {
      id: 1,
      title: '물리치료와 도수치료의 차이점',
      excerpt: '물리치료와 도수치료는 모두 재활 치료의 중요한 방법이지만, 각각의 특징과 적용 분야가 다릅니다. 물리치료는 전기치료, 초음파, 운동치료 등 기계적 장치를 활용한 치료를 의미하며, 도수치료는 치료사의 손을 직접 사용하여 근육과 관절을 조작하는 치료법입니다.',
      slug: 'guide/physical-vs-manual-therapy',
    },
    {
      id: 2,
      title: '물리치료 비용 결정 요인',
      excerpt: '물리치료 비용은 여러 요인에 따라 달라집니다. 가장 중요한 요소는 건강보험 적용 여부입니다. 건강보험이 적용되는 경우 본인부담금은 보통 1회당 5,000원~15,000원 수준이며, 비급여 항목의 경우 병원마다 차이가 있어 1회당 30,000원~100,000원 이상일 수 있습니다.',
      slug: 'guide/cost-factors',
    },
    {
      id: 3,
      title: '지역별 물리치료 가격 차이',
      excerpt: '서울특별시의 경우 대도시 특성상 평균적으로 1회당 15만원 정도의 비용이 소요되며, 경기도는 13만원, 부산광역시는 12만원 수준입니다. 전국 평균은 약 12.5만원 정도로 집계됩니다. 다만 이는 비급여 항목 기준이며, 건강보험이 적용되는 경우 본인부담금은 훨씬 낮아집니다.',
      slug: 'guide/regional-price-differences',
    },
    {
      id: 4,
      title: '치료 횟수와 기간 결정하기',
      excerpt: '치료 횟수는 질환의 종류와 심각도에 따라 달라집니다. 급성 통증의 경우 1~2주 정도의 단기 치료로 충분하지만, 만성 질환이나 재활 치료의 경우 수개월에 걸친 장기 치료가 필요할 수 있습니다. 또한 병원의 위치, 시설 수준, 전문의의 경력 등도 비용 결정에 영향을 미칩니다.',
      slug: 'guide/treatment-duration',
    },
    {
      id: 5,
      title: '건강보험 적용 여부 확인하기',
      excerpt: '물리치료 비용을 결정하는 가장 중요한 요소는 건강보험 적용 여부입니다. 급여 항목으로 인정받으면 본인부담금이 크게 줄어들지만, 비급여 항목의 경우 병원에서 자유롭게 가격을 책정할 수 있어 병원마다 차이가 큽니다. 치료 전에 보험 적용 여부를 확인하는 것이 중요합니다.',
      slug: 'guide/insurance-coverage',
    },
    {
      id: 6,
      title: '병원 선택 시 고려사항',
      excerpt: '물리치료 병원을 선택할 때는 위치, 시설, 전문의의 경력, 치료 프로그램의 다양성 등을 종합적으로 고려해야 합니다. 특히 만성 질환이나 재활 치료의 경우 장기간 방문해야 하므로 접근성이 중요한 요소입니다. 또한 초진 상담을 통해 치료 계획과 예상 비용을 미리 확인하는 것이 좋습니다.',
      slug: 'guide/hospital-selection',
    },
    {
      id: 7,
      title: '물리치료 효과를 높이는 방법',
      excerpt: '물리치료의 효과를 극대화하기 위해서는 정기적인 방문뿐만 아니라, 병원에서 배운 운동을 집에서도 꾸준히 실시하는 것이 중요합니다. 또한 생활 습관 개선, 올바른 자세 유지, 충분한 휴식 등도 치료 효과에 큰 영향을 미칩니다. 치료사와의 소통을 통해 개인 맞춤형 치료 계획을 수립하는 것이 좋습니다.',
      slug: 'guide/maximizing-effectiveness',
    },
    {
      id: 8,
      title: '재활 치료의 중요성',
      excerpt: '재활 치료는 부상이나 질환 후 정상적인 기능을 회복하는 데 필수적입니다. 적절한 시기에 시작하고 꾸준히 받는 것이 중요하며, 조기 재활은 장기적인 예후에 큰 영향을 미칩니다. 전문의와 상담하여 개인에게 맞는 재활 프로그램을 선택하는 것이 중요합니다.',
      slug: 'guide/rehabilitation-importance',
    },
  ];

  return (
    <section className='py-12 bg-white dark:bg-gray-900'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center mb-12'>
          <h2 className='text-3xl font-bold text-gray-900 dark:text-gray-50 mb-4'>
            물리치료 가이드
          </h2>
          <p className='text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto'>
            물리치료와 재활 치료에 대한 유용한 정보를 제공합니다
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          {guides.map((guide) => (
            <article
              key={guide.id}
              className='bg-gray-50 dark:bg-gray-800 rounded-lg p-6 hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700'>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-50 mb-3 line-clamp-2'>
                {guide.title}
              </h3>
              <p className='text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-4'>
                {guide.excerpt}
              </p>
              <Link
                href={`/${guide.slug}`}
                className='text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium'>
                자세히 보기 →
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

