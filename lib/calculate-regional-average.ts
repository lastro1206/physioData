import { getSupabaseServer } from './supabase-server';
import { extractRegion } from './utils';

/**
 * area_prices 테이블에서 특정 지역의 평균 가격을 가져옵니다.
 * @param region 시/도 (예: "서울특별시")
 * @param itemCd 항목코드 (기본값: N0001 - 도수치료)
 */
export async function getAreaAveragePrice(
  region: string,
  itemCd: string = 'N0001'
): Promise<{ region: string; avgPrice: number; maxPrice?: number; minPrice?: number } | null> {
  const supabase = getSupabaseServer();

  const { data, error } = await supabase
    .from('area_prices')
    .select('region, avg_price, max_price, min_price')
    .eq('region', region)
    .eq('item_cd', itemCd)
    .single();

  if (error || !data) {
    return null;
  }

  return {
    region: data.region,
    avgPrice: data.avg_price,
    maxPrice: data.max_price || undefined,
    minPrice: data.min_price || undefined,
  };
}

/**
 * 주소에서 지역을 추출하고 해당 지역의 평균 가격을 가져옵니다.
 * area_prices 테이블을 우선 사용하고, 없으면 hospitals 테이블에서 계산합니다.
 */
export async function getRegionalAveragePriceForAddress(
  address: string,
  itemCd: string = 'N0001'
): Promise<{ region: string; averagePrice: number; maxPrice?: number; minPrice?: number } | null> {
  const region = extractRegion(address);
  if (!region) {
    return null;
  }

  // 1. area_prices 테이블에서 조회 (우선)
  const areaPrice = await getAreaAveragePrice(region, itemCd);
  if (areaPrice) {
    return {
      region: areaPrice.region,
      averagePrice: areaPrice.avgPrice,
      maxPrice: areaPrice.maxPrice,
      minPrice: areaPrice.minPrice,
    };
  }

  // 2. area_prices에 없으면 hospitals 테이블에서 계산 (fallback)
  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from('hospitals')
    .select('treatment_price, address')
    .ilike('address', `%${region}%`)
    .not('treatment_price', 'is', null);

  if (error || !data || data.length === 0) {
    return null;
  }

  // 숫자로 변환하여 평균 계산
  const prices = data
    .map((h) => {
      const price = typeof h.treatment_price === 'number' 
        ? h.treatment_price 
        : parseInt(String(h.treatment_price || '0'), 10);
      // 음수는 지역 평균이므로 절댓값 사용
      return price !== 0 ? Math.abs(price) : null;
    })
    .filter((p): p is number => p !== null);

  if (prices.length === 0) {
    return null;
  }

  const average = Math.round(
    prices.reduce((sum, price) => sum + price, 0) / prices.length
  );

  return { region, averagePrice: average };
}

