import { PublicHospitalData } from './public-data-api';
import { Hospital } from '@/types/hospital';

/**
 * 공공데이터 API 형식을 Supabase Hospital 형식으로 변환합니다.
 */
export function transformPublicDataToHospital(
  publicData: PublicHospitalData
): Omit<Hospital, 'id' | 'createdAt' | 'updatedAt'> & { ykiho: string } {
  // 좌표 변환 (문자열을 숫자로)
  const latitude = publicData.ypos
    ? parseFloat(publicData.ypos)
    : undefined;
  const longitude = publicData.xpos
    ? parseFloat(publicData.xpos)
    : undefined;

  // 전화번호 정리 (하이픈 제거 등)
  const phone = publicData.telno
    ? publicData.telno.replace(/[-\s]/g, '')
    : '';

  // 주소 정리
  const address = publicData.addr || '';

  // 진료과목 배열 생성
  const specialties: string[] = [];
  if (publicData.dgsbjtCdNm) {
    specialties.push(publicData.dgsbjtCdNm);
  }

  return {
    ykiho: publicData.ykiho, // 요양기관기호 (upsert 키로 사용)
    name: publicData.yadmNm || '병원명 없음',
    address: address,
    phone: phone,
    description: publicData.clcdNm
      ? `${publicData.clcdNm} - ${publicData.dgsbjtCdNm || ''}`
      : undefined,
    latitude: latitude && !isNaN(latitude) ? latitude : undefined,
    longitude: longitude && !isNaN(longitude) ? longitude : undefined,
    specialties: specialties.length > 0 ? specialties : undefined,
  };
}

/**
 * 여러 공공데이터를 Hospital 형식으로 일괄 변환합니다.
 */
export function transformPublicDataArray(
  publicDataArray: PublicHospitalData[]
): Array<Omit<Hospital, 'id' | 'createdAt' | 'updatedAt'> & { ykiho: string }> {
  return publicDataArray
    .filter((data) => data && data.ykiho && data.yadmNm) // 필수 필드 확인
    .map(transformPublicDataToHospital);
}

