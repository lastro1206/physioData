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

export async function getAllHospitals(): Promise<Hospital[]> {
  console.log('Fetching hospitals from Supabase...');
  console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing');
  console.log('Supabase Anon Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Missing');

  const { data, error, count } = await supabase
    .from('hospitals')
    .select('*', { count: 'exact' })
    .order('name', { ascending: true });

  if (error) {
    console.error('❌ Error fetching hospitals:', error);
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
    
    return [];
  }

  if (!data) {
    console.warn('⚠️ No data returned from Supabase (data is null)');
    return [];
  }

  console.log(`✅ Successfully fetched ${data.length} hospitals from Supabase`);
  if (count !== null && count !== data.length) {
    console.log(`ℹ️ Total count in DB: ${count}, but returned: ${data.length}`);
    console.log('   This might indicate RLS policy is filtering some rows');
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

