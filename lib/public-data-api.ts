import axios from 'axios';

const API_KEY = process.env.PUBLIC_DATA_API_KEY;
const BASE_URL =
  'http://apis.data.go.kr/B551182/hospInfoServicev2/getHospBasisList';

export interface PublicHospitalData {
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
  [key: string]: any; // 기타 필드
}

/**
 * 공공데이터 API에서 병원 데이터를 가져옵니다.
 * 물리치료과(21) 코드로 필터링합니다.
 */
export async function fetchHospitalDataFromAPI(
  pageNo: number = 1,
  numOfRows: number = 100
): Promise<PublicHospitalData[]> {
  if (!API_KEY) {
    throw new Error('PUBLIC_DATA_API_KEY environment variable is not set');
  }

  try {
    const response = await axios.get(BASE_URL, {
      params: {
        serviceKey: API_KEY,
        pageNo: pageNo,
        numOfRows: numOfRows,
        _type: 'json',
        dgsbjtCd: '21', // 물리치료과 코드
      },
      timeout: 30000, // 30초 타임아웃
    });

    // API 응답 구조 확인
    if (!response.data?.response?.body?.items) {
      console.warn(`Page ${pageNo}: No items found in API response`);
      return [];
    }

    const items = response.data.response.body.items.item;

    // 단일 객체인 경우 배열로 변환
    const itemsArray = Array.isArray(items) ? items : [items];

    console.log(
      `페이지 ${pageNo}에서 ${itemsArray.length}개의 병원 데이터를 가져왔습니다.`
    );

    return itemsArray.filter((item: any) => item && item.ykiho); // ykiho가 있는 데이터만 반환
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

/**
 * 모든 페이지를 순회하며 병원 데이터를 가져옵니다.
 */
export async function fetchAllHospitalData(
  numOfRows: number = 100
): Promise<PublicHospitalData[]> {
  const allData: PublicHospitalData[] = [];
  let pageNo = 1;
  let hasMore = true;

  while (hasMore) {
    const data = await fetchHospitalDataFromAPI(pageNo, numOfRows);

    if (data.length === 0) {
      hasMore = false;
      break;
    }

    allData.push(...data);

    // API 응답에서 전체 페이지 수를 확인할 수 있다면 활용
    // 여기서는 데이터가 없을 때까지 계속 가져오는 방식 사용
    if (data.length < numOfRows) {
      hasMore = false;
    } else {
      pageNo++;
      // API 호출 간 딜레이 (과도한 요청 방지)
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  console.log(`총 ${allData.length}개의 병원 데이터를 가져왔습니다.`);
  return allData;
}

