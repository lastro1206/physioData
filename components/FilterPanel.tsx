'use client';

import { HospitalFilters } from '@/types/hospital';

interface FilterPanelProps {
  filters: HospitalFilters;
  onFiltersChange: (filters: HospitalFilters) => void;
  regions: string[];
  districts: string[];
  selectedRegion?: string;
}

export default function FilterPanel({
  filters,
  onFiltersChange,
  regions,
  districts,
  selectedRegion,
}: FilterPanelProps) {
  const handleRegionChange = (region: string) => {
    onFiltersChange({
      ...filters,
      region: region || undefined,
      district: undefined, // 지역 변경 시 구/군 초기화
    });
  };

  const handleDistrictChange = (district: string) => {
    onFiltersChange({
      ...filters,
      district: district || undefined,
    });
  };

  const handleCostRangeChange = (min: number | undefined, max: number | undefined) => {
    onFiltersChange({
      ...filters,
      minCost: min,
      maxCost: max,
    });
  };

  const handleSortChange = (sortBy: 'name' | 'region' | 'cost') => {
    onFiltersChange({
      ...filters,
      sortBy,
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      searchQuery: filters.searchQuery,
      sortBy: filters.sortBy || 'name',
    });
  };

  const hasActiveFilters =
    filters.region ||
    filters.district ||
    filters.minCost !== undefined ||
    filters.maxCost !== undefined;

  return (
    <div className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 space-y-6'>
      <div className='flex items-center justify-between'>
        <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-50'>
          필터
        </h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className='text-sm text-blue-600 dark:text-blue-400 hover:underline'>
            초기화
          </button>
        )}
      </div>

      {/* 지역 필터 */}
      <div>
        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
          시/도
        </label>
        <select
          value={filters.region || ''}
          onChange={(e) => handleRegionChange(e.target.value)}
          className='w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500'>
          <option value=''>전체</option>
          {regions.map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>
      </div>

      {/* 시/군/구 필터 */}
      {selectedRegion && districts.length > 0 && (
        <div>
          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
            시/군/구
          </label>
          <select
            value={filters.district || ''}
            onChange={(e) => handleDistrictChange(e.target.value)}
            className='w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500'>
            <option value=''>전체</option>
            {districts.map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* 비용 범위 필터 */}
      <div>
        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
          비용 범위 (원)
        </label>
        <div className='grid grid-cols-2 gap-3'>
          <div>
            <input
              type='number'
              placeholder='최소'
              value={filters.minCost || ''}
              onChange={(e) =>
                handleCostRangeChange(
                  e.target.value ? parseInt(e.target.value, 10) : undefined,
                  filters.maxCost
                )
              }
              className='w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>
          <div>
            <input
              type='number'
              placeholder='최대'
              value={filters.maxCost || ''}
              onChange={(e) =>
                handleCostRangeChange(
                  filters.minCost,
                  e.target.value ? parseInt(e.target.value, 10) : undefined
                )
              }
              className='w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>
        </div>
      </div>

      {/* 정렬 옵션 */}
      <div>
        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
          정렬
        </label>
        <select
          value={filters.sortBy || 'name'}
          onChange={(e) =>
            handleSortChange(e.target.value as 'name' | 'region' | 'cost')
          }
          className='w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500'>
          <option value='name'>이름순</option>
          <option value='region'>지역순</option>
          <option value='cost'>비용순</option>
        </select>
      </div>
    </div>
  );
}

