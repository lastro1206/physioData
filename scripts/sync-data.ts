import dotenv from "dotenv";
import { fetchAllHospitalData } from "../lib/public-data-api";
import { transformPublicDataArray } from "../lib/data-transformer";
import { getSupabaseServer } from "../lib/supabase-server";

// 환경 변수 로드 (supabase-server import 전에 실행)
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

/**
 * 공공데이터 API에서 가져온 병원 데이터를 Supabase에 동기화합니다.
 * ykiho를 기준으로 upsert를 수행합니다.
 */
async function syncHospitalData() {
  console.log("=== 병원 데이터 동기화 시작 ===");
  const startTime = Date.now();

  try {
    // 1. 공공데이터 API에서 데이터 가져오기
    console.log("공공데이터 API에서 병원 데이터를 가져오는 중...");
    const publicData = await fetchAllHospitalData(100);

    if (publicData.length === 0) {
      console.warn("가져온 데이터가 없습니다. 동기화를 종료합니다.");
      return;
    }

    console.log(`총 ${publicData.length}개의 병원 데이터를 가져왔습니다.`);

    // 2. 데이터 변환
    console.log("데이터 형식을 변환하는 중...");
    const hospitals = transformPublicDataArray(publicData);
    console.log(`변환 완료: ${hospitals.length}개의 병원 데이터`);

    // 3. Supabase에 upsert (ykiho 기준)
    console.log("Supabase에 데이터를 저장하는 중...");
    const batchSize = 100; // 배치 크기
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < hospitals.length; i += batchSize) {
      const batch = hospitals.slice(i, i + batchSize);

      // Supabase에 upsert (ykiho를 unique key로 사용)
      const supabase = getSupabaseServer();
      const { error } = await supabase
        .from("hospitals")
        .upsert(
          batch.map((hospital) => ({
            ykiho: hospital.ykiho, // upsert 키
            name: hospital.name,
            address: hospital.address,
            phone: hospital.phone,
            description: hospital.description,
            latitude: hospital.latitude,
            longitude: hospital.longitude,
            specialties: hospital.specialties,
            cost: hospital.cost,
            updatedAt: new Date().toISOString(),
          })),
          {
            onConflict: "ykiho", // ykiho 컬럼을 기준으로 중복 확인
            ignoreDuplicates: false, // 중복 시 업데이트
          }
        )
        .select();

      if (error) {
        console.error(`배치 ${i / batchSize + 1} 저장 중 오류:`, error);
        errorCount += batch.length;
      } else {
        successCount += batch.length;
        console.log(
          `배치 ${i / batchSize + 1} 완료: ${
            batch.length
          }개 저장됨 (진행률: ${Math.round(
            ((i + batch.length) / hospitals.length) * 100
          )}%)`
        );
      }

      // API 부하 방지를 위한 딜레이
      if (i + batchSize < hospitals.length) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }

    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    // 4. 최종 DB에 저장된 병원 개수 확인
    console.log("\n=== DB 저장 현황 확인 중 ===");
    const supabase = getSupabaseServer();
    const { count: dbCount, error: countError } = await supabase
      .from("hospitals")
      .select("*", { count: "exact", head: true });

    if (countError) {
      console.warn("⚠️ DB 개수 조회 중 오류:", countError);
    } else {
      console.log(`✅ 현재 DB에 저장된 총 병원 개수: ${dbCount || 0}개`);
    }

    console.log("\n=== 동기화 완료 ===");
    console.log(`총 처리 시간: ${duration}초`);
    console.log(`이번 동기화 성공: ${successCount}개`);
    console.log(`이번 동기화 실패: ${errorCount}개`);
    console.log(`이번 동기화 총 데이터: ${hospitals.length}개`);
    if (dbCount !== null) {
      console.log(`📊 DB에 저장된 최종 병원 개수: ${dbCount}개`);
    }
  } catch (error) {
    console.error("동기화 중 치명적 오류 발생:", error);
    process.exit(1);
  }
}

// 스크립트 실행
if (require.main === module) {
  syncHospitalData()
    .then(() => {
      console.log("동기화 스크립트가 성공적으로 완료되었습니다.");
      process.exit(0);
    })
    .catch((error) => {
      console.error("동기화 스크립트 실행 중 오류:", error);
      process.exit(1);
    });
}

export { syncHospitalData };
