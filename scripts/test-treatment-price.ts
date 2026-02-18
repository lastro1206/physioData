import dotenv from 'dotenv';
import { fetchTreatmentPrice, fetchTreatmentPriceWithMultipleCodes } from '../lib/treatment-price-api';

// 환경 변수 로드
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

/**
 * 특정 병원의 가격 정보를 테스트합니다.
 */
async function testTreatmentPrice() {
  console.log('=== 특정 병원 가격 정보 테스트 ===\n');

  // 테스트할 ykiho (실제 데이터베이스에서 가져온 값 사용)
  const testYkiho = process.argv[2] || 'A1123456'; // 기본값 또는 명령줄 인자

  console.log(`테스트할 ykiho: ${testYkiho}\n`);

  // 1. 단일 코드 테스트 (N0001)
  console.log('--- 단일 코드 테스트 (N0001 - 도수치료) ---');
  const price1 = await fetchTreatmentPrice(testYkiho, 'N0001');
  console.log(`결과: ${price1 ? `${price1}원` : '가격 정보 없음'}\n`);

  // 2. 여러 코드 테스트
  console.log('--- 여러 코드 테스트 ---');
  const itemCodes = [
    'N0001', // 도수치료
    'N0002', // 물리치료
    'N0003', // 작업치료
    'N0004', // 언어치료
    'N0005', // 재활치료
  ];
  
  const price2 = await fetchTreatmentPriceWithMultipleCodes(testYkiho, itemCodes);
  console.log(`최종 결과: ${price2 ? `${price2}원` : '모든 코드에서 가격 정보 없음'}\n`);

  console.log('=== 테스트 완료 ===');
}

// 스크립트로 직접 실행할 때
if (require.main === module) {
  testTreatmentPrice()
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      console.error('테스트 실행 중 오류:', error);
      process.exit(1);
    });
}

export { testTreatmentPrice };

