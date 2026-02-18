import { getAreaAveragePrice } from '@/lib/calculate-regional-average';
import { extractRegion, formatCost } from '@/lib/utils';
import { generateManualTherapyGuide } from '@/lib/generate-guide-content';
import AdPlaceholder from './AdPlaceholder';

interface PriceGuideProps {
  hospitalAddress: string;
  itemCd?: string;
}

/**
 * SEO 최적화를 위한 가격 가이드 컴포넌트
 * - 데이터가 있으면 실제 통계치 표시
 * - 없으면 전문가 가이드 텍스트 500자 이상 표시
 */
export default async function PriceGuide({
  hospitalAddress,
  itemCd = 'N0001',
}: PriceGuideProps) {
  const region = extractRegion(hospitalAddress);
  const areaPrice = region ? await getAreaAveragePrice(region, itemCd) : null;

  // AI 생성 전문가 가이드 텍스트 (가격 데이터가 없을 때 사용)
  const expertGuideText = generateManualTherapyGuide(region || undefined);

  return (
    <section className='mb-8'>
      {/* 광고: 가격 통계 바로 위 */}
      <div className='mb-6'>
        <AdPlaceholder position='middle' className='rounded-lg' />
      </div>

      <div className='bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 border border-indigo-200 dark:border-gray-700 rounded-lg p-6 shadow-lg'>
        <h2 className='text-2xl font-semibold text-gray-900 dark:text-gray-50 mb-6'>
          {areaPrice ? '지역별 물리치료 가격 통계' : '물리치료 전문가의 지역별 시세 가이드'}
        </h2>

        {areaPrice ? (
          // 실제 통계치 표시
          <div className='space-y-4'>
            <div className='bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700'>
              <div className='flex items-center justify-between mb-4'>
                <h3 className='text-lg font-medium text-gray-900 dark:text-gray-50'>
                  {region} 지역 통계
                </h3>
                <span className='px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm font-medium'>
                  실제 통계치
                </span>
              </div>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <div>
                  <p className='text-sm text-gray-500 dark:text-gray-400 mb-1'>평균 가격</p>
                  <p className='text-2xl font-bold text-blue-600 dark:text-blue-400'>
                    {formatCost(areaPrice.avgPrice)}
                  </p>
                </div>
                {areaPrice.maxPrice && (
                  <div>
                    <p className='text-sm text-gray-500 dark:text-gray-400 mb-1'>최고 가격</p>
                    <p className='text-2xl font-bold text-red-600 dark:text-red-400'>
                      {formatCost(areaPrice.maxPrice)}
                    </p>
                  </div>
                )}
                {areaPrice.minPrice && (
                  <div>
                    <p className='text-sm text-gray-500 dark:text-gray-400 mb-1'>최저 가격</p>
                    <p className='text-2xl font-bold text-green-600 dark:text-green-400'>
                      {formatCost(areaPrice.minPrice)}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className='prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300'>
              <p className='text-sm leading-relaxed'>
                위 통계는 공공데이터를 기반으로 한 {region} 지역의 실제 도수치료 가격 통계입니다.
                평균 가격은 {formatCost(areaPrice.avgPrice)}이며, 
                {areaPrice.maxPrice && areaPrice.minPrice && (
                  <> 최저 {formatCost(areaPrice.minPrice)}부터 최고 {formatCost(areaPrice.maxPrice)}까지의 범위를 보입니다.</>
                )}
                실제 병원 방문 시에는 보험 적용 여부, 치료 횟수, 병원의 시설 수준 등에 따라 비용이 달라질 수 있습니다.
              </p>
            </div>
          </div>
        ) : (
          // 전문가 가이드 텍스트 표시 (500자 이상)
          <div className='prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300'>
            <div className='bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700 mb-4'>
              <div className='flex items-center gap-2 mb-4'>
                <svg
                  className='w-6 h-6 text-indigo-600 dark:text-indigo-400'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
                <span className='px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded-full text-sm font-medium'>
                  전문가 가이드
                </span>
              </div>
              <p className='text-base leading-relaxed whitespace-pre-line'>
                {expertGuideText}
              </p>
            </div>
          </div>
        )}

        {/* 면책 조항 */}
        <p className='mt-6 text-xs text-gray-500 dark:text-gray-400 text-center italic border-t border-gray-200 dark:border-gray-700 pt-4'>
          위 정보는 공공데이터 및 전문가 분석을 기반으로 하며, 실제 병원 방문 시 차이가 있을 수 있습니다.
        </p>
      </div>

      {/* 광고: 가이드 텍스트 바로 아래 */}
      <div className='mt-6'>
        <AdPlaceholder position='middle' className='rounded-lg' />
      </div>
    </section>
  );
}

