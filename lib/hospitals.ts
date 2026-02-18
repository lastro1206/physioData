import { supabase } from './supabase';
import { Hospital, HospitalFilters } from '@/types/hospital';

export async function getHospitalById(id: number): Promise<Hospital | null> {
  const { data, error } = await supabase
    .from('hospitals')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    return null;
  }

  // DB 컬럼명(snake_case)을 타입(camelCase)으로 변환
  return {
    ...data,
    operatingHours: data.operating_hours || data.operatingHours,
    treatment_price: data.treatment_price !== undefined 
      ? typeof data.treatment_price === 'number' 
        ? data.treatment_price 
        : parseInt(String(data.treatment_price || '0'), 10) || undefined
      : undefined,
    createdAt: data.created_at || data.createdAt,
    updatedAt: data.updated_at || data.updatedAt,
  } as Hospital;
}

export async function getAllHospitalIds(): Promise<number[]> {
  const { data, error } = await supabase
    .from('hospitals')
    .select('id')
    .order('id', { ascending: true });

  if (error || !data) {
    console.error('Error fetching hospital IDs:', error);
    return [];
  }

  return data.map((hospital) => hospital.id);
}

/**
 * 페이지네이션을 사용하여 병원 ID 목록을 가져옵니다.
 * 대량 데이터 처리에 최적화되어 있습니다.
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
 * 페이지네이션을 사용하여 모든 병원 데이터를 가져옵니다.
 * Supabase의 1000개 제한을 우회하여 모든 데이터를 로드합니다.
 */
export async function getAllHospitals(): Promise<Hospital[]> {
  console.log('Fetching hospitals from Supabase (paginated)...');
  console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing');
  console.log('Supabase Anon Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Missing');

  const allHospitals: Hospital[] = [];
  const PAGE_SIZE = 1000; // Supabase 최대 제한
  let page = 0;
  let hasMore = true;
  let totalCount: number | null = null;

  while (hasMore) {
    const from = page * PAGE_SIZE;
    const to = (page + 1) * PAGE_SIZE - 1;

    console.log(`[페이지네이션] 페이지 ${page + 1}: ${from} ~ ${to} 범위 조회 중...`);

    const { data, error, count } = await supabase
      .from('hospitals')
      .select('*', { count: 'exact' })
      .order('name', { ascending: true })
      .range(from, to);

    if (error) {
      console.error(`❌ Error fetching hospitals (page ${page + 1}):`, error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      console.error('Error hint:', error.hint);
      
      // RLS 관련 에러인지 확인
      if (error.code === '42501' || error.message?.includes('permission')) {
        console.error('');
        console.error('🔒 RLS (Row Level Security) 정책 문제로 보입니다!');
        console.error('해결 방법:');
        console.error('1. Supabase 대시보드 → SQL Editor');
        console.error('2. 다음 SQL 실행:');
        console.error('   ALTER TABLE hospitals DISABLE ROW LEVEL SECURITY;');
        console.error('또는');
        console.error('   CREATE POLICY "Allow public read access" ON hospitals FOR SELECT USING (true);');
      }
      
      // 에러 발생 시 지금까지 가져온 데이터라도 반환
      if (allHospitals.length > 0) {
        console.warn(`⚠️ 에러 발생했지만 지금까지 가져온 ${allHospitals.length}개 데이터 반환`);
        break;
      }
      return [];
    }

    if (!data || data.length === 0) {
      console.log(`[페이지네이션] 페이지 ${page + 1}: 데이터 없음, 종료`);
      hasMore = false;
      break;
    }

    // 첫 페이지에서 전체 개수 저장
    if (page === 0 && count !== null) {
      totalCount = count;
      console.log(`[페이지네이션] 전체 병원 개수: ${totalCount}개`);
    }

    // DB 컬럼명(snake_case)을 타입(camelCase)으로 변환
    const transformedData = data.map((hospital: any) => ({
      ...hospital,
      operatingHours: hospital.operating_hours || hospital.operatingHours,
      treatment_price: hospital.treatment_price !== undefined 
        ? typeof hospital.treatment_price === 'number' 
          ? hospital.treatment_price 
          : parseInt(String(hospital.treatment_price || '0'), 10) || undefined
        : undefined,
      createdAt: hospital.created_at || hospital.createdAt,
      updatedAt: hospital.updated_at || hospital.updatedAt,
    })) as Hospital[];

    allHospitals.push(...transformedData);
    console.log(`[페이지네이션] 페이지 ${page + 1}: ${data.length}개 병원 로드 완료 (누적: ${allHospitals.length}개)`);

    // 다음 페이지가 있는지 확인
    if (data.length < PAGE_SIZE) {
      hasMore = false;
      console.log(`[페이지네이션] 마지막 페이지 도달 (${data.length} < ${PAGE_SIZE})`);
    } else {
      page++;
    }
  }

  console.log(`✅ Successfully fetched ${allHospitals.length} hospitals from Supabase`);
  if (totalCount !== null && totalCount !== allHospitals.length) {
    console.log(`ℹ️ Total count in DB: ${totalCount}, but returned: ${allHospitals.length}`);
    if (totalCount > allHospitals.length) {
      console.warn(`⚠️ 일부 데이터가 누락되었을 수 있습니다. (${totalCount - allHospitals.length}개 차이)`);
    }
  }

  return allHospitals;
}

export async function getFilteredHospitals(
  filters: HospitalFilters
): Promise<Hospital[]> {
  let query = supabase.from('hospitals').select('*');

  // 지역 필터링 (주소에서 추출)
  if (filters.region) {
    query = query.ilike('address', `%${filters.region}%`);
  }
  if (filters.district) {
    query = query.ilike('address', `%${filters.district}%`);
  }

  // 비용 필터링
  if (filters.minCost !== undefined) {
    query = query.gte('cost', filters.minCost);
  }
  if (filters.maxCost !== undefined) {
    query = query.lte('cost', filters.maxCost);
  }

  // 검색 쿼리
  if (filters.searchQuery) {
    query = query.or(
      `name.ilike.%${filters.searchQuery}%,address.ilike.%${filters.searchQuery}%`
    );
  }

  // 정렬
  const sortBy = filters.sortBy || 'name';
  if (sortBy === 'name') {
    query = query.order('name', { ascending: true });
  } else if (sortBy === 'cost') {
    query = query.order('cost', { ascending: true, nullsFirst: false });
  } else if (sortBy === 'region') {
    query = query.order('address', { ascending: true });
  }

  const { data, error } = await query;

  if (error || !data) {
    return [];
  }

  // DB 컬럼명(snake_case)을 타입(camelCase)으로 변환
  return data.map((hospital: any) => ({
    ...hospital,
    operatingHours: hospital.operating_hours || hospital.operatingHours,
    treatment_price: hospital.treatment_price !== undefined 
      ? typeof hospital.treatment_price === 'number' 
        ? hospital.treatment_price 
        : parseInt(String(hospital.treatment_price || '0'), 10) || undefined
      : undefined,
    createdAt: hospital.created_at || hospital.createdAt,
    updatedAt: hospital.updated_at || hospital.updatedAt,
  })) as Hospital[];
}

