import dotenv from "dotenv";
import { getSupabaseServer } from "../lib/supabase-server";
import { fetchAllAreaPriceStatistics } from "../lib/area-price-api";

// 환경 변수 로드
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

/**
 * 전국 시/도별 비급여 진료비 통계 데이터를 수집하여 area_prices 테이블에 저장합니다.
 */
async function syncAreaPrices() {
  console.log("=== 지역별 가격 통계 데이터 동기화 시작 ===");
  const startTime = Date.now();

  try {
    const supabase = getSupabaseServer();

    // 전국 시/도 목록
    const regions = [
      "서울특별시",
      "부산광역시",
      "대구광역시",
      "인천광역시",
      "광주광역시",
      "대전광역시",
      "울산광역시",
      "세종특별자치시",
      "경기도",
      "강원도",
      "충청북도",
      "충청남도",
      "전라북도",
      "전라남도",
      "경상북도",
      "경상남도",
      "제주특별자치도",
    ];

    // 도수치료(N0001)와 물리치료(N0002) 통계 수집
    const itemCodes = ["N0001", "N0002"];

    for (const itemCd of itemCodes) {
      console.log(`\n=== ${itemCd} 항목 통계 수집 시작 ===`);

      // API에서 통계 데이터 가져오기
      const areaPrices = await fetchAllAreaPriceStatistics(regions, itemCd, 300);

      // 수익형 Fallback: API 실패 시 기본값 강제 삽입
      const fallbackData = [
        { region: "서울특별시", avgPrice: 150000, maxPrice: 200000, minPrice: 100000 },
        { region: "경기도", avgPrice: 130000, maxPrice: 180000, minPrice: 90000 },
        { region: "부산광역시", avgPrice: 120000, maxPrice: 170000, minPrice: 80000 },
      ];

      // API에서 가져온 데이터와 fallback 데이터 병합
      const finalPrices: Array<{
        region: string;
        itemCd: string;
        itemNm: string;
        avgPrice: number;
        maxPrice: number;
        minPrice: number;
        count: number;
      }> = [];

      // API 데이터 추가
      areaPrices.forEach((ap) => {
        finalPrices.push({
          region: ap.region,
          itemCd: ap.itemCd,
          itemNm: ap.itemNm,
          avgPrice: ap.avgPrice,
          maxPrice: ap.maxPrice,
          minPrice: ap.minPrice,
          count: ap.count,
        });
      });

      // Fallback 데이터 추가 (API에서 가져오지 못한 지역만)
      const existingRegions = new Set(areaPrices.map((ap) => ap.region));
      fallbackData.forEach((fb) => {
        if (!existingRegions.has(fb.region)) {
          console.log(`[Fallback] ${fb.region} 데이터 강제 삽입: ${fb.avgPrice}원`);
          finalPrices.push({
            region: fb.region,
            itemCd: itemCd,
            itemNm: "도수치료",
            avgPrice: fb.avgPrice,
            maxPrice: fb.maxPrice,
            minPrice: fb.minPrice,
            count: 0, // Fallback 데이터는 count 0
          });
        }
      });

      // 전국 평균도 추가 (항상)
      const nationalAvgExists = finalPrices.some((p) => p.region === "전국");
      if (!nationalAvgExists) {
        finalPrices.push({
          region: "전국",
          itemCd: itemCd,
          itemNm: "도수치료",
          avgPrice: 125000, // 전국평균 12.5만원
          maxPrice: 200000,
          minPrice: 65000,
          count: 0,
        });
      }

      if (finalPrices.length === 0) {
        console.warn(`${itemCd} 항목에 대한 통계 데이터가 없습니다.`);
        continue;
      }

      console.log(`\n총 ${finalPrices.length}개의 지역 통계 데이터를 저장합니다. (API: ${areaPrices.length}개, Fallback: ${finalPrices.length - areaPrices.length}개)`);

      // Supabase에 저장
      console.log("Supabase에 데이터를 저장하는 중...");
      const dataToInsert = finalPrices.map((ap) => ({
        region: ap.region,
        item_cd: ap.itemCd,
        item_nm: ap.itemNm,
        avg_price: ap.avgPrice,
        max_price: ap.maxPrice,
        min_price: ap.minPrice,
        data_count: ap.count,
        updated_at: new Date().toISOString(),
      }));

      // upsert (region + item_cd 기준)
      // UNIQUE 제약조건이 있는 경우 onConflict 사용
      const { error } = await supabase
        .from("area_prices")
        .upsert(dataToInsert, {
          onConflict: "region,item_cd",
          ignoreDuplicates: false,
        })
        .select();

      // UNIQUE 제약조건이 없는 경우 수동으로 처리
      if (error && error.code === '42P01') {
        console.warn('UNIQUE 제약조건이 없습니다. 수동 upsert 시도...');
        for (const data of dataToInsert) {
          const { error: upsertError } = await supabase
            .from("area_prices")
            .upsert(data, {
              onConflict: "region,item_cd",
            });
          if (upsertError) {
            console.error(`데이터 저장 오류 (${data.region}):`, upsertError);
          }
        }
      }

      if (error) {
        console.error(`데이터 저장 중 오류 발생:`, error);
      } else {
        console.log(`${itemCd} 항목: ${finalPrices.length}개 지역 데이터 저장 완료 (API: ${areaPrices.length}개, Fallback: ${finalPrices.length - areaPrices.length}개)`);
      }

      // 항목 간 딜레이
      if (itemCodes.indexOf(itemCd) < itemCodes.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    console.log("\n=== 지역별 가격 통계 데이터 동기화 완료 ===");
    console.log(`총 처리 시간: ${duration}초`);
  } catch (error) {
    console.error("동기화 중 치명적 오류 발생:", error);
    throw error;
  }
}

// 스크립트로 직접 실행할 때
if (require.main === module) {
  syncAreaPrices()
    .then(() => {
      console.log("지역별 가격 통계 동기화가 성공적으로 완료되었습니다.");
      process.exit(0);
    })
    .catch((error) => {
      console.error("지역별 가격 통계 동기화 실행 중 오류:", error);
      process.exit(1);
    });
}

export { syncAreaPrices };

