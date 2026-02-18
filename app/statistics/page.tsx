import { Metadata } from 'next';
import { getAllHospitals } from '@/lib/hospitals';
import { extractAllRegions } from '@/lib/utils';
import { getAreaAveragePrice } from '@/lib/calculate-regional-average';
import { formatCost } from '@/lib/utils';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '지역별 도수치료 평균 시세 통계 - PhysioData',
  description: '전국 시/도별 도수치료 평균 가격 통계를 확인하세요. 서울, 경기, 부산 등 지역별 물리치료 비용 정보를 제공합니다.',
};

export default async function StatisticsPage() {
  // 모든 병원 데이터 가져오기
  const hospitals = await getAllHospitals();
  const regions = extractAllRegions(hospitals.map((h) => h.address));

  // 지역별 통계 데이터 가져오기
  const regionStats = await Promise.all(
    regions.map(async (region) => {
      const areaPrice = await getAreaAveragePrice(region, 'N0001');
      const regionHospitals = hospitals.filter((h) => h.address.includes(region));
      
      return {
        region,
        areaPrice,
        hospitalCount: regionHospitals.length,
      };
    })
  );

  // 통계 데이터가 있는 지역만 필터링
  const statsWithData = regionStats.filter((stat) => stat.areaPrice !== null);

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-black'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        {/* 헤더 */}
        <div className='mb-8'>
          <h1 className='text-4xl font-bold text-gray-900 dark:text-gray-50 mb-4'>
            지역별 도수치료 평균 시세 통계
          </h1>
          <p className='text-lg text-gray-600 dark:text-gray-400'>
            전국 시/도별 도수치료 평균 가격을 확인하고, 지역별 물리치료 비용을 비교해보세요.
          </p>
        </div>

        {/* 통계 카드 그리드 */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8'>
          {statsWithData.map((stat) => (
            <div
              key={stat.region}
              className='bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow'>
              <div className='flex items-center justify-between mb-4'>
                <h3 className='text-xl font-semibold text-gray-900 dark:text-gray-50'>
                  {stat.region}
                </h3>
                <span className='px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs font-medium'>
                  {stat.hospitalCount}개 병원
                </span>
              </div>
              
              {stat.areaPrice && (
                <div className='space-y-3'>
                  <div>
                    <p className='text-sm text-gray-500 dark:text-gray-400 mb-1'>평균 가격</p>
                    <p className='text-3xl font-bold text-blue-600 dark:text-blue-400'>
                      {formatCost(stat.areaPrice.avgPrice)}
                    </p>
                  </div>
                  
                  {stat.areaPrice.maxPrice && stat.areaPrice.minPrice && (
                    <div className='grid grid-cols-2 gap-4 pt-3 border-t border-gray-200 dark:border-gray-700'>
                      <div>
                        <p className='text-xs text-gray-500 dark:text-gray-400 mb-1'>최저</p>
                        <p className='text-lg font-semibold text-green-600 dark:text-green-400'>
                          {formatCost(stat.areaPrice.minPrice)}
                        </p>
                      </div>
                      <div>
                        <p className='text-xs text-gray-500 dark:text-gray-400 mb-1'>최고</p>
                        <p className='text-lg font-semibold text-red-600 dark:text-red-400'>
                          {formatCost(stat.areaPrice.maxPrice)}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  <Link
                    href={`/?region=${encodeURIComponent(stat.region)}&sortBy=cost`}
                    className='block mt-4 text-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium'>
                    {stat.region} 병원 찾기
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 안내사항 */}
        <div className='bg-blue-50 dark:bg-gray-800 rounded-lg p-6 border border-blue-200 dark:border-gray-700'>
          <h2 className='text-lg font-semibold text-gray-900 dark:text-gray-50 mb-3'>
            안내사항
          </h2>
          <ul className='space-y-2 text-sm text-gray-600 dark:text-gray-400'>
            <li className='flex items-start gap-2'>
              <span className='text-blue-500 mt-0.5'>•</span>
              <span>위 통계는 공공데이터를 기반으로 한 지역별 평균 가격입니다.</span>
            </li>
            <li className='flex items-start gap-2'>
              <span className='text-blue-500 mt-0.5'>•</span>
              <span>실제 병원 방문 시 보험 적용 여부, 치료 횟수 등에 따라 비용이 달라질 수 있습니다.</span>
            </li>
            <li className='flex items-start gap-2'>
              <span className='text-blue-500 mt-0.5'>•</span>
              <span>정확한 비용은 병원에 직접 문의하시기 바랍니다.</span>
            </li>
          </ul>
        </div>

        {/* 홈으로 돌아가기 */}
        <div className='mt-8 text-center'>
          <Link
            href='/'
            className='inline-flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-gray-700 hover:bg-gray-800 dark:hover:bg-gray-600 text-white rounded-lg transition-colors font-medium'>
            <svg
              className='w-5 h-5'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M10 19l-7-7m0 0l7-7m-7 7h18'
              />
            </svg>
            병원 찾기로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}

