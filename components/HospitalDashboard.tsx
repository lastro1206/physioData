"use client";

import { useState, useMemo, useEffect } from "react";
import { Hospital, HospitalFilters } from "@/types/hospital";
import SearchBar from "./SearchBar";
import FilterPanel from "./FilterPanel";
import HospitalCard from "./HospitalCard";
import ThemeToggle from "./ThemeToggle";
import GuideSection from "./GuideSection";
import Footer from "./Footer";
import AdInfeed from "./common/AdInfeed";
import { extractAllRegions, extractDistrictsByRegion } from "@/lib/utils";

interface HospitalDashboardProps {
  initialHospitals: Hospital[];
}

export default function HospitalDashboard({
  initialHospitals,
}: HospitalDashboardProps) {
  const [hospitals] = useState<Hospital[]>(initialHospitals);
  const [filters, setFilters] = useState<HospitalFilters>({
    sortBy: "name",
  });
  const [searchQuery, setSearchQuery] = useState("");

  // 지역 목록 추출
  const regions = useMemo(() => {
    const addresses = hospitals.map((h) => h.address);
    return extractAllRegions(addresses);
  }, [hospitals]);

  // 선택된 지역의 시/군/구 목록
  const districts = useMemo(() => {
    if (!filters.region) return [];
    const addresses = hospitals
      .filter((h) => h.address.includes(filters.region!))
      .map((h) => h.address);
    return extractDistrictsByRegion(addresses, filters.region);
  }, [hospitals, filters.region]);

  // 필터링된 병원 목록
  const filteredHospitals = useMemo(() => {
    let result = [...hospitals];

    // 검색 쿼리 필터링
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (h) =>
          h.name.toLowerCase().includes(query) ||
          h.address.toLowerCase().includes(query) ||
          (h.description && h.description.toLowerCase().includes(query))
      );
    }

    // 지역 필터링
    if (filters.region) {
      result = result.filter((h) => h.address.includes(filters.region!));
    }
    if (filters.district) {
      result = result.filter((h) => h.address.includes(filters.district!));
    }

    // 비용 필터링
    if (filters.minCost !== undefined) {
      result = result.filter(
        (h) => h.cost !== undefined && h.cost >= filters.minCost!
      );
    }
    if (filters.maxCost !== undefined) {
      result = result.filter(
        (h) => h.cost === undefined || h.cost <= filters.maxCost!
      );
    }

    // 정렬
    const sortBy = filters.sortBy || "name";
    result.sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name, "ko");
      } else if (sortBy === "region") {
        return a.address.localeCompare(b.address, "ko");
      } else if (sortBy === "cost") {
        const costA = a.cost ?? Infinity;
        const costB = b.cost ?? Infinity;
        return costA - costB;
      }
      return 0;
    });

    return result;
  }, [hospitals, filters, searchQuery]);

  // 검색 쿼리를 필터에 반영
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      searchQuery: searchQuery || undefined,
    }));
  }, [searchQuery]);

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-black'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* 헤더 */}
        <div className='mb-8 flex items-start justify-between'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900 dark:text-gray-50 mb-2'>
              물리치료 병원 찾기
            </h1>
            <p className='text-gray-600 dark:text-gray-400'>
              전국의 물리치료 및 재활 병원 정보를 검색하고 필터링하세요
            </p>
          </div>
          {/* 다크모드 토글 버튼 */}
          <div className='flex-shrink-0'>
            <ThemeToggle />
          </div>
        </div>

        {/* 검색 바 */}
        <div className='mb-6'>
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder='병원명, 주소 또는 설명으로 검색...'
          />
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
          {/* 필터 패널 */}
          <div className='lg:col-span-1'>
            <div className='sticky top-8'>
              <FilterPanel
                filters={filters}
                onFiltersChange={setFilters}
                regions={regions}
                districts={districts}
                selectedRegion={filters.region}
              />
            </div>
          </div>

          {/* 병원 목록 */}
          <div className='lg:col-span-3'>
            {/* 결과 카운트 */}
            <div className='mb-4 flex items-center justify-between'>
              <p className='text-sm text-gray-600 dark:text-gray-400'>
                총{" "}
                <span className='font-semibold'>
                  {filteredHospitals.length}
                </span>
                개의 병원이 있습니다
              </p>
            </div>

            {/* 병원 카드 그리드 */}
            {filteredHospitals.length > 0 ? (
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                {filteredHospitals.map((hospital, index) => (
                  <div key={hospital.id}>
                    <HospitalCard hospital={hospital} />
                    {/* 매 5번째 아이템마다 인피드 광고 삽입 */}
                    {(index + 1) % 5 === 0 && index < filteredHospitals.length - 1 && (
                      <AdInfeed slot="YOUR_INFEED_SLOT_ID" />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className='text-center py-16 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700'>
                <svg
                  className='mx-auto h-12 w-12 text-gray-400 dark:text-gray-500'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
                <h3 className='mt-4 text-lg font-medium text-gray-900 dark:text-gray-50'>
                  검색 결과가 없습니다
                </h3>
                <p className='mt-2 text-sm text-gray-500 dark:text-gray-400'>
                  다른 검색어나 필터를 시도해보세요
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 가이드 섹션 */}
        <GuideSection />
      </div>

      {/* 푸터 */}
      <Footer />
    </div>
  );
}
