import axios from "axios";

const BASE_URL =
  "https://api.odcloud.kr/api/15055562/v1/uddi:3fd1cde9-ded2-46fe-8eed-8e31326c1eff";

/**
 * 시도 명칭 매핑 (DB 형식 <-> API 형식)
 */
const REGION_NAME_MAP: Record<string, string> = {
  서울특별시: "서울",
  부산광역시: "부산",
  대구광역시: "대구",
  인천광역시: "인천",
  광주광역시: "광주",
  대전광역시: "대전",
  울산광역시: "울산",
  세종특별자치시: "세종",
  경기도: "경기",
  강원도: "강원",
  충청북도: "충북",
  충청남도: "충남",
  전라북도: "전북",
  전라남도: "전남",
  경상북도: "경북",
  경상남도: "경남",
  제주특별자치도: "제주",
};

/**
 * API 형식의 시도명을 DB 형식으로 변환
 * 다양한 형식 지원: "충청남도" -> "충남" -> "충청남도"
 */
export function normalizeRegionName(apiRegion: string): string {
  // 정확히 일치하는 경우
  if (REGION_NAME_MAP[apiRegion]) {
    return apiRegion;
  }

  // API 형식(축약형)을 DB 형식으로 변환
  for (const [dbName, apiName] of Object.entries(REGION_NAME_MAP)) {
    if (
      apiRegion === apiName ||
      apiRegion.includes(apiName) ||
      apiName.includes(apiRegion)
    ) {
      return dbName;
    }
  }

  // "충청남도" 같은 전체 이름도 처리
  const fullNameMap: Record<string, string> = {
    충청남도: "충청남도",
    충청북도: "충청북도",
    전라남도: "전라남도",
    전라북도: "전라북도",
    경상남도: "경상남도",
    경상북도: "경상북도",
  };

  if (fullNameMap[apiRegion]) {
    return fullNameMap[apiRegion];
  }

  return apiRegion;
}

/**
 * DB 형식의 시도명을 API 형식으로 변환
 */
export function toApiRegionName(dbRegion: string): string {
  return REGION_NAME_MAP[dbRegion] || dbRegion;
}

/**
 * serviceKey를 디코딩/인코딩하여 재시도하는 API 호출
 */
async function callApiWithRetry(
  url: string,
  params: Record<string, string>,
  retryCount: number = 0
): Promise<{ data?: unknown[]; [key: string]: unknown }> {
  const API_KEY = process.env.PUBLIC_DATA_API_KEY;

  if (!API_KEY) {
    throw new Error("PUBLIC_DATA_API_KEY environment variable is not set");
  }

  try {
    // 첫 번째 시도: 원본 키 사용
    const response = await axios.get(url, {
      params: {
        ...params,
        serviceKey: API_KEY,
      },
      timeout: 30000,
    });

    // 성공 응답 확인
    if (response.data && response.status === 200) {
      return response.data;
    }

    throw new Error(`API 응답 오류: ${response.status}`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // 401, 403 등 인증 오류인 경우 디코딩된 키로 재시도
      if (
        (error.response?.status === 401 || error.response?.status === 403) &&
        retryCount === 0
      ) {
        console.log(`[API 재시도] 디코딩된 키로 재시도 중...`);
        try {
          // URL 디코딩 시도
          const decodedKey = decodeURIComponent(API_KEY);
          const response = await axios.get(url, {
            params: {
              ...params,
              serviceKey: decodedKey,
            },
            timeout: 30000,
          });
          return response.data;
        } catch {
          // 인코딩된 키로 재시도
          console.log(`[API 재시도] 인코딩된 키로 재시도 중...`);
          const encodedKey = encodeURIComponent(API_KEY);
          const response = await axios.get(url, {
            params: {
              ...params,
              serviceKey: encodedKey,
            },
            timeout: 30000,
          });
          return response.data;
        }
      }
    }
    throw error;
  }
}

export interface AreaPriceData {
  region: string; // 시/도 (예: "서울특별시", "경기도")
  itemCd: string; // 항목코드 (N0001: 도수치료, N0002: 물리치료 등)
  itemNm: string; // 항목명
  avgPrice: number; // 평균 가격
  maxPrice: number; // 최고 가격
  minPrice: number; // 최저 가격
  count: number; // 데이터 개수
}

/**
 * 하드코딩된 기본 시세 데이터 (API 실패 시 사용)
 */
const FALLBACK_PRICES: Record<string, AreaPriceData> = {
  서울특별시: {
    region: "서울특별시",
    itemCd: "N0001",
    itemNm: "도수치료",
    avgPrice: 150000, // 전문가 가이드: 서울 15만원
    maxPrice: 200000,
    minPrice: 100000,
    count: 0,
  },
  경기도: {
    region: "경기도",
    itemCd: "N0001",
    itemNm: "도수치료",
    avgPrice: 130000, // 전문가 가이드: 경기 13만원
    maxPrice: 180000,
    minPrice: 90000,
    count: 0,
  },
  부산광역시: {
    region: "부산광역시",
    itemCd: "N0001",
    itemNm: "도수치료",
    avgPrice: 120000, // 전문가 가이드: 부산 12만원
    maxPrice: 170000,
    minPrice: 80000,
    count: 0,
  },
  대구광역시: {
    region: "대구광역시",
    itemCd: "N0001",
    itemNm: "도수치료",
    avgPrice: 120000,
    maxPrice: 170000,
    minPrice: 80000,
    count: 0,
  },
  인천광역시: {
    region: "인천광역시",
    itemCd: "N0001",
    itemNm: "도수치료",
    avgPrice: 125000,
    maxPrice: 175000,
    minPrice: 85000,
    count: 0,
  },
  광주광역시: {
    region: "광주광역시",
    itemCd: "N0001",
    itemNm: "도수치료",
    avgPrice: 110000,
    maxPrice: 160000,
    minPrice: 70000,
    count: 0,
  },
  대전광역시: {
    region: "대전광역시",
    itemCd: "N0001",
    itemNm: "도수치료",
    avgPrice: 115000,
    maxPrice: 165000,
    minPrice: 75000,
    count: 0,
  },
  울산광역시: {
    region: "울산광역시",
    itemCd: "N0001",
    itemNm: "도수치료",
    avgPrice: 115000,
    maxPrice: 165000,
    minPrice: 75000,
    count: 0,
  },
  세종특별자치시: {
    region: "세종특별자치시",
    itemCd: "N0001",
    itemNm: "도수치료",
    avgPrice: 120000,
    maxPrice: 170000,
    minPrice: 80000,
    count: 0,
  },
  강원도: {
    region: "강원도",
    itemCd: "N0001",
    itemNm: "도수치료",
    avgPrice: 110000,
    maxPrice: 160000,
    minPrice: 70000,
    count: 0,
  },
  충청북도: {
    region: "충청북도",
    itemCd: "N0001",
    itemNm: "도수치료",
    avgPrice: 110000,
    maxPrice: 160000,
    minPrice: 70000,
    count: 0,
  },
  충청남도: {
    region: "충청남도",
    itemCd: "N0001",
    itemNm: "도수치료",
    avgPrice: 110000,
    maxPrice: 160000,
    minPrice: 70000,
    count: 0,
  },
  전라북도: {
    region: "전라북도",
    itemCd: "N0001",
    itemNm: "도수치료",
    avgPrice: 105000,
    maxPrice: 155000,
    minPrice: 65000,
    count: 0,
  },
  전라남도: {
    region: "전라남도",
    itemCd: "N0001",
    itemNm: "도수치료",
    avgPrice: 105000,
    maxPrice: 155000,
    minPrice: 65000,
    count: 0,
  },
  경상북도: {
    region: "경상북도",
    itemCd: "N0001",
    itemNm: "도수치료",
    avgPrice: 110000,
    maxPrice: 160000,
    minPrice: 70000,
    count: 0,
  },
  경상남도: {
    region: "경상남도",
    itemCd: "N0001",
    itemNm: "도수치료",
    avgPrice: 110000,
    maxPrice: 160000,
    minPrice: 70000,
    count: 0,
  },
  제주특별자치도: {
    region: "제주특별자치도",
    itemCd: "N0001",
    itemNm: "도수치료",
    avgPrice: 115000,
    maxPrice: 165000,
    minPrice: 75000,
    count: 0,
  },
};

/**
 * 전국 평균 가격 (fallback용)
 */
const NATIONAL_AVERAGE: AreaPriceData = {
  region: "전국",
  itemCd: "N0001",
  itemNm: "도수치료",
  avgPrice: 125000, // 전문가 가이드: 전국평균 12.5만원
  maxPrice: 200000,
  minPrice: 65000,
  count: 0,
};

/**
 * 전국 비급여 진료비 통계 API에서 지역별 평균 가격 정보를 가져옵니다.
 * @param region 시/도 (예: "서울특별시", "경기도")
 * @param itemCd 항목코드 (기본값: N0001 - 도수치료)
 */
export async function fetchAreaPriceStatistics(
  region: string,
  itemCd: string = "N0001"
): Promise<AreaPriceData | null> {
  const apiRegion = toApiRegionName(region);

  const params = {
    sido: apiRegion, // API 형식의 시도명
    itemCd: itemCd,
  };

  const url = new URL(BASE_URL);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, String(value));
  });
  console.log(`[지역 통계 API] URL: ${url.toString()}`);

  try {
    const responseData = await callApiWithRetry(BASE_URL, params);

    console.log(
      `[지역 통계 API] 응답 데이터:`,
      JSON.stringify(responseData, null, 2).substring(0, 1000)
    );

    // API 응답 구조 확인 (odcloud API 형식)
    if (
      !responseData?.data ||
      !Array.isArray(responseData.data) ||
      responseData.data.length === 0
    ) {
      console.log(
        `[지역 통계 API] 데이터가 없습니다. Fallback 사용: ${region}`
      );
      return FALLBACK_PRICES[region] || null;
    }

    const items = responseData.data as Array<Record<string, unknown>>;

    // 통계 데이터 계산
    const prices = items
      .map((item: Record<string, unknown>) => {
        // API 응답 구조에 맞게 금액 필드 추출
        const amt = (item.금액 ||
          item.amt ||
          item.가격 ||
          item.price ||
          "0") as string;
        return parseInt(String(amt).replace(/[^0-9]/g, ""), 10);
      })
      .filter((price: number) => price > 0);

    if (prices.length === 0) {
      console.log(
        `[지역 통계 API] 유효한 가격 데이터가 없습니다. Fallback 사용: ${region}`
      );
      return FALLBACK_PRICES[region] || null;
    }

    const avgPrice = Math.round(
      prices.reduce((sum: number, price: number) => sum + price, 0) /
        prices.length
    );
    const maxPrice = Math.max(...prices);
    const minPrice = Math.min(...prices);

    // API에서 가져온 시도명을 DB 형식으로 정규화
    const normalizedRegion = normalizeRegionName(region);
    const firstItem = items[0] as Record<string, unknown>;

    return {
      region: normalizedRegion,
      itemCd: itemCd,
      itemNm: (firstItem?.항목명 || firstItem?.itemNm || "도수치료") as string,
      avgPrice: avgPrice,
      maxPrice: maxPrice,
      minPrice: minPrice,
      count: prices.length,
    };
  } catch (error) {
    console.error(`[지역 통계 API 오류] region: ${region}, itemCd: ${itemCd}`);
    if (axios.isAxiosError(error)) {
      console.error(`[지역 통계 API 오류] message: ${error.message}`);
      console.error(`[지역 통계 API 오류] status: ${error.response?.status}`);
      console.error(
        `[지역 통계 API 오류] response data:`,
        JSON.stringify(error.response?.data, null, 2)
      );
    } else {
      console.error(`[지역 통계 API 오류]`, error);
    }

    // Fallback: 하드코딩된 데이터 반환
    console.log(`[지역 통계 API] Fallback 사용: ${region}`);
    return FALLBACK_PRICES[region] || null;
  }
}

/**
 * 전국 평균 가격 가져오기 (fallback 포함)
 */
export function getNationalAveragePrice(): AreaPriceData {
  return NATIONAL_AVERAGE;
}

/**
 * 여러 지역의 통계 데이터를 배치로 가져옵니다.
 */
export async function fetchAllAreaPriceStatistics(
  regions: string[],
  itemCd: string = "N0001",
  delayMs: number = 300
): Promise<AreaPriceData[]> {
  const results: AreaPriceData[] = [];

  for (let i = 0; i < regions.length; i++) {
    const region = regions[i];
    console.log(`[지역 통계 수집] ${i + 1}/${regions.length} - ${region}`);

    const data = await fetchAreaPriceStatistics(region, itemCd);
    if (data) {
      results.push(data);
      console.log(`[지역 통계 수집 성공] ${region}: 평균 ${data.avgPrice}원`);
    } else {
      console.log(`[지역 통계 수집 실패] ${region}: 데이터 없음`);
    }

    // API 부하 방지를 위한 딜레이
    if (i < regions.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  return results;
}
