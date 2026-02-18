import { Hospital } from '@/types/hospital';
import { supabase } from './supabase';

/**
 * 배치 크기로 데이터를 나누어 처리합니다.
 */
export async function processInBatches<T>(
  items: T[],
  batchSize: number,
  processor: (batch: T[]) => Promise<void>
): Promise<void> {
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    await processor(batch);
  }
}

/**
 * 모든 병원 ID를 페이지네이션으로 가져옵니다.
 */
export async function getAllHospitalIdsPaginated(
  batchSize: number = 1000
): Promise<number[]> {
  const allIds: number[] = [];
  let from = 0;
  let hasMore = true;

  while (hasMore) {
    const { data, error } = await supabase
      .from('hospitals')
      .select('id')
      .range(from, from + batchSize - 1)
      .order('id', { ascending: true });

    if (error) {
      console.error('Error fetching hospital IDs:', error);
      throw new Error(`Failed to fetch hospital IDs: ${error.message}`);
    }

    if (!data || data.length === 0) {
      hasMore = false;
      break;
    }

    const ids = data.map((hospital) => hospital.id);
    allIds.push(...ids);

    if (data.length < batchSize) {
      hasMore = false;
    } else {
      from += batchSize;
    }
  }

  return allIds;
}

/**
 * 모든 병원 데이터를 페이지네이션으로 가져옵니다.
 * Supabase의 1000개 제한을 우회하여 모든 데이터를 로드합니다.
 */
export async function getAllHospitalsPaginated(
  batchSize: number = 1000
): Promise<Hospital[]> {
  const allHospitals: Hospital[] = [];
  let page = 0;
  let hasMore = true;

  console.log(`[getAllHospitalsPaginated] 시작 - 배치 크기: ${batchSize}`);

  while (hasMore) {
    const from = page * batchSize;
    const to = (page + 1) * batchSize - 1;

    console.log(`[getAllHospitalsPaginated] 페이지 ${page + 1}: ${from} ~ ${to} 범위 조회 중...`);

    const { data, error } = await supabase
      .from('hospitals')
      .select('*')
      .range(from, to)
      .order('id', { ascending: true });

    if (error) {
      console.error(`[getAllHospitalsPaginated] 페이지 ${page + 1} 오류:`, error);
      throw new Error(`Failed to fetch hospitals: ${error.message}`);
    }

    if (!data || data.length === 0) {
      console.log(`[getAllHospitalsPaginated] 페이지 ${page + 1}: 데이터 없음, 종료`);
      hasMore = false;
      break;
    }

    allHospitals.push(...(data as Hospital[]));
    console.log(`[getAllHospitalsPaginated] 페이지 ${page + 1}: ${data.length}개 로드 완료 (누적: ${allHospitals.length}개)`);

    // 다음 페이지가 있는지 확인
    if (data.length < batchSize) {
      hasMore = false;
      console.log(`[getAllHospitalsPaginated] 마지막 페이지 도달`);
    } else {
      page++;
    }
  }

  console.log(`[getAllHospitalsPaginated] 완료: 총 ${allHospitals.length}개 병원 로드`);
  return allHospitals;
}

/**
 * 정적 생성 시 사용할 병원 ID 목록을 안전하게 가져옵니다.
 * 에러 발생 시 빈 배열을 반환하여 빌드가 실패하지 않도록 합니다.
 */
export async function getStaticHospitalIds(): Promise<number[]> {
  try {
    // 환경 변수 확인
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.warn('Supabase environment variables are not set. Returning empty array.');
      return [];
    }

    const ids = await getAllHospitalIdsPaginated();
    console.log(`Successfully fetched ${ids.length} hospital IDs for static generation`);
    return ids;
  } catch (error) {
    console.error('Error in getStaticHospitalIds:', error);
    // 빌드 실패를 방지하기 위해 빈 배열 반환
    return [];
  }
}

/**
 * 정적 생성 파라미터를 생성합니다.
 */
export async function generateHospitalStaticParams(): Promise<
  Array<{ id: string }>
> {
  const ids = await getStaticHospitalIds();
  return ids.map((id) => ({
    id: id.toString(),
  }));
}

