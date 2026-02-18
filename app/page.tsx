import { Metadata } from 'next';
import { getAllHospitals } from '@/lib/hospitals';
import HospitalDashboard from '@/components/HospitalDashboard';

export const metadata: Metadata = {
  title: '물리치료 병원 찾기 - 전국 재활 병원 데이터',
  description: '전국의 물리치료 및 재활 병원 정보를 지역별, 비용별로 검색하고 필터링하세요',
};

export const revalidate = 3600; // 1시간마다 재생성

export default async function Home() {
  console.log('=== Home page rendering ===');
  console.log('Environment check:');
  console.log('- NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✓ Set' : '✗ Missing');
  console.log('- NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✓ Set' : '✗ Missing');

  const hospitals = await getAllHospitals();

  // 디버깅용 로그
  console.log('=== Home page result ===');
  console.log('Fetched hospitals count:', hospitals.length);
  if (hospitals.length > 0) {
    console.log('First hospital:', JSON.stringify(hospitals[0], null, 2));
  } else {
    console.warn('⚠️ No hospitals found! Check:');
    console.warn('1. Is data synced to Supabase?');
    console.warn('2. Is RLS policy allowing read access?');
    console.warn('3. Are environment variables correct?');
  }

  return <HospitalDashboard initialHospitals={hospitals} />;
}
