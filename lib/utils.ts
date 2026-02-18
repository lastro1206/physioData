/**
 * 주소에서 시/도를 추출합니다.
 * 예: "서울특별시 강남구 테헤란로 123" -> "서울특별시"
 */
export function extractRegion(address: string): string | null {
  const regions = [
    '서울특별시',
    '부산광역시',
    '대구광역시',
    '인천광역시',
    '광주광역시',
    '대전광역시',
    '울산광역시',
    '세종특별자치시',
    '경기도',
    '강원도',
    '충청북도',
    '충청남도',
    '전라북도',
    '전라남도',
    '경상북도',
    '경상남도',
    '제주특별자치도',
  ];

  for (const region of regions) {
    if (address.includes(region)) {
      return region;
    }
  }

  return null;
}

/**
 * 주소에서 시/군/구를 추출합니다.
 * 예: "서울특별시 강남구 테헤란로 123" -> "강남구"
 */
export function extractDistrict(address: string): string | null {
  const region = extractRegion(address);
  if (!region) return null;

  // 주소에서 시/도 부분을 제거하고 다음 단어를 추출
  const parts = address.replace(region, '').trim().split(/\s+/);
  if (parts.length > 0) {
    const district = parts[0];
    // 구, 시, 군으로 끝나는 경우만 반환
    if (district.match(/구$|시$|군$/)) {
      return district;
    }
  }

  return null;
}

/**
 * 비용을 포맷팅합니다.
 * 예: 50000 -> "50,000원"
 */
export function formatCost(cost?: number): string {
  if (cost === undefined || cost === null) {
    return '정보 없음';
  }
  return `${cost.toLocaleString('ko-KR')}원`;
}

/**
 * 모든 고유 지역 목록을 추출합니다.
 */
export function extractAllRegions(addresses: string[]): string[] {
  const regions = new Set<string>();
  addresses.forEach((address) => {
    const region = extractRegion(address);
    if (region) {
      regions.add(region);
    }
  });
  return Array.from(regions).sort();
}

/**
 * 특정 지역의 모든 시/군/구 목록을 추출합니다.
 */
export function extractDistrictsByRegion(
  addresses: string[],
  region: string
): string[] {
  const districts = new Set<string>();
  addresses.forEach((address) => {
    if (address.includes(region)) {
      const district = extractDistrict(address);
      if (district) {
        districts.add(district);
      }
    }
  });
  return Array.from(districts).sort();
}

