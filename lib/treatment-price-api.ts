import axios from "axios";

const BASE_URL =
  "http://apis.data.go.kr/B551182/nonPaymentDamtInfoService/getNonPaymentItemDamtList";

export interface TreatmentPriceData {
  ykiho: string; // 요양기관기호
  clcd: string; // 종별코드
  clcdNm: string; // 종별명
  itemCd: string; // 항목코드
  itemNm: string; // 항목명
  amt: string; // 금액
  [key: string]: string | undefined;
}

/**
 * 건강보험심사평가원 비급여진료비항목정보 API에서 도수치료 가격 정보를 가져옵니다.
 * @param ykiho 요양기관기호
 * @param itemCd 항목코드 (기본값: N0001 - 도수치료)
 */
export async function fetchTreatmentPrice(
  ykiho: string,
  itemCd: string = "N0001"
): Promise<number | null> {
  // 함수 내부에서 환경 변수 읽기 (dotenv.config() 이후에 실행되도록)
  const API_KEY = process.env.PUBLIC_DATA_API_KEY;

  if (!API_KEY) {
    throw new Error("PUBLIC_DATA_API_KEY environment variable is not set");
  }

  try {
    const response = await axios.get(BASE_URL, {
      params: {
        serviceKey: API_KEY,
        ykiho: ykiho,
        itemCd: itemCd,
        _type: "json",
      },
      timeout: 30000,
    });

    if (!response.data?.response?.body?.items) {
      return null;
    }

    const items = response.data.response.body.items.item;
    const itemsArray = Array.isArray(items) ? items : [items];

    // 가장 최근 데이터 또는 첫 번째 데이터의 금액 반환
    if (itemsArray.length > 0) {
      const price = parseInt(itemsArray[0].amt || "0", 10);
      return price > 0 ? price : null;
    }

    return null;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // 404나 데이터 없음은 정상적인 경우로 처리
      if (error.response?.status === 404 || error.response?.status === 200) {
        return null;
      }
      console.error(`API 호출 중 오류 발생 (ykiho: ${ykiho}):`, {
        message: error.message,
        status: error.response?.status,
      });
    } else {
      console.error(`API 호출 중 오류 발생 (ykiho: ${ykiho}):`, error);
    }
    return null;
  }
}

/**
 * 여러 비급여 항목 코드를 시도하여 가격 정보를 가져옵니다.
 * @param ykiho 요양기관기호
 * @param itemCdList 항목코드 배열 (여러 코드를 시도)
 */
export async function fetchTreatmentPriceWithMultipleCodes(
  ykiho: string,
  itemCdList: string[] = ["N0001", "N0002", "N0003", "N0004", "N0005"]
): Promise<number | null> {
  for (const itemCd of itemCdList) {
    console.log(`[다중 코드 시도] ykiho: ${ykiho}, itemCd: ${itemCd}`);
    const price = await fetchTreatmentPrice(ykiho, itemCd);
    if (price !== null && price > 0) {
      console.log(
        `[다중 코드 성공] ykiho: ${ykiho}, itemCd: ${itemCd}, price: ${price}`
      );
      return price;
    }
  }
  console.log(`[다중 코드 실패] ykiho: ${ykiho}, 모든 코드 시도 완료`);
  return null;
}

/**
 * 여러 병원의 가격 정보를 배치로 가져옵니다.
 * 여러 비급여 항목 코드를 시도합니다.
 */
export async function fetchTreatmentPricesBatch(
  ykihoList: string[],
  itemCdList: string[] = ["N0001", "N0002", "N0003", "N0004", "N0005"],
  delayMs: number = 200
): Promise<Map<string, number>> {
  const priceMap = new Map<string, number>();

  console.log(
    `[배치 시작] 총 ${
      ykihoList.length
    }개 병원, 시도할 항목 코드: ${itemCdList.join(", ")}`
  );

  for (let i = 0; i < ykihoList.length; i++) {
    const ykiho = ykihoList[i];
    const price = await fetchTreatmentPriceWithMultipleCodes(ykiho, itemCdList);

    if (price !== null) {
      priceMap.set(ykiho, price);
      console.log(
        `[배치 진행] ${i + 1}/${
          ykihoList.length
        } - ykiho: ${ykiho}, 가격: ${price}원`
      );
    } else {
      console.log(
        `[배치 진행] ${i + 1}/${
          ykihoList.length
        } - ykiho: ${ykiho}, 가격 정보 없음`
      );
    }

    // API 부하 방지를 위한 딜레이
    if (i < ykihoList.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }

    // 진행 상황 로그
    if ((i + 1) % 10 === 0) {
      console.log(
        `[배치 진행률] ${i + 1}/${ykihoList.length} (${Math.round(
          ((i + 1) / ykihoList.length) * 100
        )}%) - 성공: ${priceMap.size}개`
      );
    }
  }

  console.log(`[배치 완료] 총 ${priceMap.size}개의 가격 정보를 가져왔습니다.`);
  return priceMap;
}
