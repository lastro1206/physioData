import { Hospital } from '@/types/hospital';
import { formatCost, extractRegion } from '@/lib/utils';
import { getAreaAveragePrice } from '@/lib/calculate-regional-average';
import AdPlaceholder from './AdPlaceholder';
import Link from 'next/link';

interface TreatmentPriceDashboardProps {
  hospital: Hospital;
  areaAveragePrice?: { region: string; avgPrice: number; maxPrice?: number; minPrice?: number } | null;
}

export default async function TreatmentPriceDashboard({
  hospital,
  areaAveragePrice,
}: TreatmentPriceDashboardProps) {
  // treatment_price가 음수면 지역 평균, 양수면 실제 가격
  const isRegionalAverage = hospital.treatment_price !== undefined && hospital.treatment_price < 0;
  const price = hospital.treatment_price
    ? Math.abs(hospital.treatment_price)
    : null;

  // 가격이 없고 지역 평균도 없으면 fallback UI 표시
  if (price === null && !areaAveragePrice) {
    const region = extractRegion(hospital.address);
    
    return (
      <section className='mb-8'>
        <div className='bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-lg'>
          <h2 className='text-2xl font-semibold text-gray-900 dark:text-gray-50 mb-4'>
            비용 정보
          </h2>
          <p className='text-gray-600 dark:text-gray-400 mb-6'>
            현재 이 병원의 상세 가격 정보를 준비 중입니다.
          </p>

          {/* 내 주변 저렴한 병원 찾기 버튼 */}
          <div className='mb-6'>
            <Link
              href={`/?region=${encodeURIComponent(region || '')}&sortBy=cost`}
              className='inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-md'>
              <svg
                className='w-5 h-5'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
                />
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'
                />
              </svg>
              {region ? `${region} 저렴한 병원 찾기` : '내 주변 저렴한 병원 찾기'}
            </Link>
          </div>

          {/* 광고 슬롯 */}
          <div className='mb-4'>
            <AdPlaceholder position='middle' className='rounded-lg' />
          </div>
        </div>
      </section>
    );
  }

  // 지역 평균 가격이 있는 경우
  const displayPrice = price || areaAveragePrice?.avgPrice || null;
  const isAreaAverage = price === null && areaAveragePrice !== null;

  return (
    <section className='mb-8'>
      <div className='bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 border border-blue-200 dark:border-gray-700 rounded-lg p-6 shadow-lg'>
        <h2 className='text-2xl font-semibold text-gray-900 dark:text-gray-50 mb-6'>
          비용 대시보드
        </h2>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {/* 도수치료 가격 카드 */}
          <div className='bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-lg font-medium text-gray-900 dark:text-gray-50'>
                도수치료
              </h3>
              {(isRegionalAverage || isAreaAverage) && (
                <span className='px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded text-xs font-medium'>
                  지역 평균
                </span>
              )}
            </div>
            <div className='flex items-baseline gap-2'>
              <span className='text-3xl font-bold text-blue-600 dark:text-blue-400'>
                {displayPrice ? formatCost(displayPrice) : '정보 없음'}
              </span>
              {(isRegionalAverage || isAreaAverage) && (
                <span className='text-sm text-gray-500 dark:text-gray-400'>
                  (예상)
                </span>
              )}
            </div>
            {isAreaAverage && areaAveragePrice && (
              <p className='mt-3 text-sm text-gray-600 dark:text-gray-400'>
                이 지역의 평균 도수치료 비용은 {formatCost(areaAveragePrice.avgPrice)}입니다.
                {areaAveragePrice.maxPrice && areaAveragePrice.minPrice && (
                  <span className='block mt-1'>
                    (최저 {formatCost(areaAveragePrice.minPrice)} ~ 최고 {formatCost(areaAveragePrice.maxPrice)})
                  </span>
                )}
              </p>
            )}
            {/* SEO 면책 조항 */}
            <p className='mt-4 text-xs text-gray-500 dark:text-gray-500 italic'>
              위 정보는 공공데이터를 기반으로 하며, 실제 병원 방문 시 차이가 있을 수 있습니다.
            </p>
            {isRegionalAverage && !isAreaAverage && (
              <p className='mt-3 text-sm text-gray-600 dark:text-gray-400'>
                해당 지역의 평균 가격을 기준으로 표시합니다.
              </p>
            )}
          </div>

          {/* 추가 정보 카드 */}
          <div className='bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700'>
            <h3 className='text-lg font-medium text-gray-900 dark:text-gray-50 mb-4'>
              안내사항
            </h3>
            <ul className='space-y-2 text-sm text-gray-600 dark:text-gray-400'>
              <li className='flex items-start gap-2'>
                <svg
                  className='w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
                <span>실제 비용은 병원에 직접 문의하시기 바랍니다.</span>
              </li>
              <li className='flex items-start gap-2'>
                <svg
                  className='w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
                <span>보험 적용 여부에 따라 비용이 달라질 수 있습니다.</span>
              </li>
              <li className='flex items-start gap-2'>
                <svg
                  className='w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
                <span>치료 횟수와 기간에 따라 총 비용이 결정됩니다.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

