import dotenv from 'dotenv';
import { getSupabaseServer } from '../lib/supabase-server';
import { fetchTreatmentPricesBatch } from '../lib/treatment-price-api';
import { getRegionalAveragePriceForAddress } from '../lib/calculate-regional-average';

// 환경 변수 로드
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

/**
 * 모든 병원의 치료 가격 정보를 업데이트합니다.
 */
async function updateTreatmentPrices() {
  console.log('=== 치료 가격 정보 업데이트 시작 ===');
  const startTime = Date.now();

  try {
    const supabase = getSupabaseServer();

    // 1. 모든 병원의 ykiho 목록 가져오기
    console.log('병원 목록을 가져오는 중...');
    const { data: hospitals, error: fetchError } = await supabase
      .from('hospitals')
      .select('ykiho, address, treatment_price')
      .not('ykiho', 'is', null);

    if (fetchError) {
      throw new Error(`병원 목록 조회 실패: ${fetchError.message}`);
    }

    if (!hospitals || hospitals.length === 0) {
      console.warn('병원 데이터가 없습니다.');
      return;
    }

    console.log(`총 ${hospitals.length}개의 병원을 찾았습니다.`);

    // 2. API에서 가격 정보 가져오기
    const ykihoList = hospitals
      .map((h) => h.ykiho)
      .filter((ykiho): ykiho is string => !!ykiho);

    console.log('건강보험심사평가원 API에서 가격 정보를 가져오는 중...');
    // 여러 비급여 항목 코드 시도: N0001(도수치료), N0002(물리치료), N0003(작업치료), N0004(언어치료), N0005(재활치료)
    const itemCodes = ['N0001', 'N0002', 'N0003', 'N0004', 'N0005'];
    const priceMap = await fetchTreatmentPricesBatch(ykihoList, itemCodes, 200);

    console.log(`가격 정보를 가져온 병원: ${priceMap.size}개`);

    // 3. 가격 정보 업데이트
    console.log('가격 정보를 업데이트하는 중...');
    let updatedCount = 0;
    let regionalAverageCount = 0;

    for (const hospital of hospitals) {
      if (!hospital.ykiho) continue;

      const apiPrice = priceMap.get(hospital.ykiho);

      if (apiPrice) {
        // API에서 가격 정보를 가져온 경우
        const { error } = await supabase
          .from('hospitals')
          .update({ treatment_price: apiPrice })
          .eq('ykiho', hospital.ykiho);

        if (!error) {
          updatedCount++;
        }
      } else if (!hospital.treatment_price && hospital.address) {
        // API에 가격 정보가 없고, DB에도 없는 경우 지역 평균 계산
        const regionalData = await getRegionalAveragePriceForAddress(
          hospital.address
        );

        if (regionalData) {
          // 음수로 저장하여 지역 평균임을 표시 (예: -50000 = 지역 평균 50,000원)
          const { error } = await supabase
            .from('hospitals')
            .update({ treatment_price: -regionalData.averagePrice })
            .eq('ykiho', hospital.ykiho);

          if (!error) {
            regionalAverageCount++;
          }
        }
      }
    }

    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    console.log('\n=== 가격 정보 업데이트 완료 ===');
    console.log(`총 처리 시간: ${duration}초`);
    console.log(`API에서 가져온 가격: ${updatedCount}개`);
    console.log(`지역 평균 가격 적용: ${regionalAverageCount}개`);
    console.log(`가격 정보 없음: ${hospitals.length - updatedCount - regionalAverageCount}개`);
  } catch (error) {
    console.error('가격 정보 업데이트 중 치명적 오류 발생:', error);
    throw error;
  }
}

// 스크립트로 직접 실행할 때
if (require.main === module) {
  updateTreatmentPrices()
    .then(() => {
      console.log('가격 정보 업데이트가 성공적으로 완료되었습니다.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('가격 정보 업데이트 실행 중 오류:', error);
      process.exit(1);
    });
}

export { updateTreatmentPrices };

