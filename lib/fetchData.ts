import axios from "axios";
import dotenv from "dotenv";
import { getSupabaseServer } from "./supabase-server";
import { generateSlug } from "./slug-utils";

// 환경 변수를 먼저 로드
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

const API_KEY = process.env.PUBLIC_DATA_API_KEY;
const BASE_URL =
  "http://apis.data.go.kr/B551182/hospInfoServicev2/getHospBasisList";

interface PublicHospitalData {
  ykiho: string; // 요양기관기호 (고유 식별자)
  yadmNm: string; // 병원명
  addr: string; // 주소
  telno?: string; // 전화번호
  clcdNm?: string; // 종별명
  dgsbjtCd?: string; // 진료과목코드
  dgsbjtCdNm?: string; // 진료과목명
  xpos?: string; // X좌표 (경도)
  ypos?: string; // Y좌표 (위도)
  postNo?: string; // 우편번호
  estbDd?: string; // 개설일자
  [key: string]: string | undefined;
}

/**
 * 공공데이터 API에서 병원 데이터를 가져옵니다.
 * 물리치료과(21) 코드로 필터링합니다.
 */
async function fetchHospitalData(
  pageNo: number = 1,
  numOfRows: number = 100
): Promise<PublicHospitalData[]> {
  if (!API_KEY) {
    throw new Error("PUBLIC_DATA_API_KEY environment variable is not set");
  }

  try {
    const response = await axios.get(BASE_URL, {
      params: {
        serviceKey: API_KEY,
        pageNo: pageNo,
        numOfRows: numOfRows,
        _type: "json",
        dgsbjtCd: "21", // 물리치료과 코드
      },
      timeout: 30000,
    });

    if (!response.data?.response?.body?.items) {
      console.warn(`Page ${pageNo}: No items found in API response`);
      return [];
    }

    const items = response.data.response.body.items.item;
    const itemsArray = Array.isArray(items) ? items : [items];

    console.log(
      `페이지 ${pageNo}에서 ${itemsArray.length}개의 데이터를 가져왔습니다.`
    );

    return itemsArray.filter(
      (item: PublicHospitalData | unknown): item is PublicHospitalData =>
        typeof item === "object" &&
        item !== null &&
        "ykiho" in item &&
        typeof (item as PublicHospitalData).ykiho === "string"
    );
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`API 호출 중 오류 발생 (페이지 ${pageNo}):`, {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
    } else {
      console.error(`API 호출 중 오류 발생 (페이지 ${pageNo}):`, error);
    }
    return [];
  }
}

interface SupabaseHospitalData {
  ykiho: string;
  name: string;
  slug: string;
  address: string;
  phone: string | null;
  description: string | null;
  latitude: number | null;
  longitude: number | null;
  specialties: string[] | null;
  operating_hours: null;
  cost: null;
}

/**
 * 공공데이터를 Supabase 스키마 형식으로 변환합니다.
 */
function transformToSupabaseSchema(
  publicData: PublicHospitalData
): SupabaseHospitalData {
  // 좌표 변환
  const latitude = publicData.ypos ? parseFloat(publicData.ypos) : null;
  const longitude = publicData.xpos ? parseFloat(publicData.xpos) : null;

  // 전화번호 정리
  const phone = publicData.telno
    ? publicData.telno.replace(/[-\s]/g, "").trim()
    : null;

  // 주소 정리
  const address = publicData.addr || "";

  // 진료과목 배열 생성
  const specialties: string[] = [];
  if (publicData.dgsbjtCdNm) {
    specialties.push(publicData.dgsbjtCdNm);
  }

  // 설명 생성
  const description = publicData.clcdNm
    ? `${publicData.clcdNm}${
        publicData.dgsbjtCdNm ? ` - ${publicData.dgsbjtCdNm}` : ""
      }`
    : null;

  // slug 생성 (병원명 기반)
  const slug = generateSlug(publicData.yadmNm || "");

  // ykiho 값 검증 및 자르기 (최대 50자)
  const ykiho = publicData.ykiho ? publicData.ykiho.substring(0, 50) : "";

  if (!ykiho) {
    console.warn(`⚠️ ykiho가 없는 데이터 발견: ${publicData.yadmNm}`);
  }

  return {
    ykiho: ykiho,
    name: publicData.yadmNm || "병원명 없음",
    slug: slug,
    address: address,
    phone: phone,
    description: description,
    latitude: latitude && !isNaN(latitude) ? latitude : null,
    longitude: longitude && !isNaN(longitude) ? longitude : null,
    specialties: specialties.length > 0 ? specialties : null,
    operating_hours: null, // 공공데이터에 운영시간 정보가 없으면 null
    cost: null, // 공공데이터에 비용 정보가 없으면 null
  };
}

/**
 * 배열에서 중복된 ykiho를 제거합니다 (마지막 값 유지).
 */
function removeDuplicateYkiho(
  hospitals: SupabaseHospitalData[]
): SupabaseHospitalData[] {
  const seen = new Map<string, SupabaseHospitalData>();

  // 역순으로 순회하여 마지막 값을 유지
  for (let i = hospitals.length - 1; i >= 0; i--) {
    const hospital = hospitals[i];
    if (hospital.ykiho && !seen.has(hospital.ykiho)) {
      seen.set(hospital.ykiho, hospital);
    }
  }

  // Map의 값들을 배열로 변환 (순서 유지)
  return Array.from(seen.values()).reverse();
}

/**
 * 배치 단위로 Supabase에 upsert합니다.
 */
async function bulkUpsertHospitals(
  hospitals: SupabaseHospitalData[],
  batchSize: number = 100
): Promise<{ success: number; failed: number }> {
  let successCount = 0;
  let failedCount = 0;

  // 전체 데이터에서 중복 제거
  const uniqueHospitals = removeDuplicateYkiho(hospitals);
  console.log(`중복 제거: ${hospitals.length}개 → ${uniqueHospitals.length}개`);

  for (let i = 0; i < uniqueHospitals.length; i += batchSize) {
    const batch = uniqueHospitals.slice(i, i + batchSize);

    // 배치 내에서도 중복 제거 (안전장치)
    const batchUnique = removeDuplicateYkiho(batch);

    if (batchUnique.length !== batch.length) {
      console.warn(
        `배치 ${i / batchSize + 1} 내 중복 발견: ${batch.length}개 → ${
          batchUnique.length
        }개`
      );
    }

    try {
      const supabase = getSupabaseServer();
      const { error } = await supabase
        .from("hospitals")
        .upsert(batchUnique, {
          onConflict: "ykiho", // ykiho 기준으로 중복 확인
          ignoreDuplicates: false, // 중복 시 업데이트
        })
        .select();

      if (error) {
        console.error(`배치 ${i / batchSize + 1} 저장 중 오류:`, error);
        console.error(`배치 크기: ${batchUnique.length}`);
        console.error(
          `배치 내 ykiho 샘플:`,
          batchUnique.slice(0, 3).map((h) => h.ykiho)
        );
        failedCount += batchUnique.length;
      } else {
        successCount += batchUnique.length;
        console.log(
          `배치 ${i / batchSize + 1} 완료: ${
            batchUnique.length
          }개 저장됨 (진행률: ${Math.round(
            ((i + batchUnique.length) / uniqueHospitals.length) * 100
          )}%)`
        );
      }
    } catch (error) {
      console.error(`배치 ${i / batchSize + 1} 처리 중 예외 발생:`, error);
      failedCount += batchUnique.length;
    }

    // API 부하 방지를 위한 딜레이
    if (i + batchSize < uniqueHospitals.length) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  return { success: successCount, failed: failedCount };
}

/**
 * 모든 페이지를 순회하며 데이터를 가져와 Supabase에 저장합니다.
 */
async function syncAllHospitalData() {
  console.log("=== 병원 데이터 동기화 시작 ===");
  const startTime = Date.now();

  try {
    const allHospitals: SupabaseHospitalData[] = [];
    let pageNo = 1;
    let hasMore = true;
    const numOfRows = 100;

    // 1. 모든 데이터 가져오기
    console.log("공공데이터 API에서 병원 데이터를 가져오는 중...");
    while (hasMore) {
      const data = await fetchHospitalData(pageNo, numOfRows);

      if (data.length === 0) {
        hasMore = false;
        break;
      }

      // 데이터 변환
      const transformed = data
        .filter((item) => item && item.ykiho && item.yadmNm)
        .map(transformToSupabaseSchema);

      allHospitals.push(...transformed);

      console.log(
        `페이지 ${pageNo} 처리 완료: ${data.length}개 → ${transformed.length}개 변환됨`
      );

      if (data.length < numOfRows) {
        hasMore = false;
      } else {
        pageNo++;
        // API 호출 간 딜레이
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }

    if (allHospitals.length === 0) {
      console.warn("가져온 데이터가 없습니다. 동기화를 종료합니다.");
      return;
    }

    console.log(`총 ${allHospitals.length}개의 병원 데이터를 준비했습니다.`);

    // 2. 배치 단위로 Supabase에 저장
    console.log("Supabase에 데이터를 저장하는 중...");
    const result = await bulkUpsertHospitals(allHospitals, 100);

    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    console.log("\n=== 동기화 완료 ===");
    console.log(`총 처리 시간: ${duration}초`);
    console.log(`성공: ${result.success}개`);
    console.log(`실패: ${result.failed}개`);
    console.log(`총 데이터: ${allHospitals.length}개`);
  } catch (error) {
    console.error("동기화 중 치명적 오류 발생:", error);
    throw error;
  }
}

// 스크립트로 직접 실행할 때
if (require.main === module) {
  syncAllHospitalData()
    .then(() => {
      console.log("동기화가 성공적으로 완료되었습니다.");
      process.exit(0);
    })
    .catch((error) => {
      console.error("동기화 실행 중 오류:", error);
      process.exit(1);
    });
}

export { syncAllHospitalData, fetchHospitalData, transformToSupabaseSchema };
