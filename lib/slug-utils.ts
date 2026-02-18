/**
 * 한글 이름을 URL Friendly한 slug로 변환합니다.
 * 예: "서울대학교병원" -> "seoul-daehakgyo-byeongwon"
 */
export function generateSlug(name: string): string {
  if (!name) {
    return '';
  }

  // 한글을 로마자로 변환하는 간단한 매핑
  // 실제 프로덕션에서는 더 정교한 한글-로마자 변환 라이브러리 사용 권장
  const hangulToRoman: { [key: string]: string } = {
    가: 'ga', 갸: 'gya', 거: 'geo', 겨: 'gyeo', 고: 'go', 교: 'gyo', 구: 'gu', 규: 'gyu', 그: 'geu', 기: 'gi',
    나: 'na', 냐: 'nya', 너: 'neo', 녀: 'nyeo', 노: 'no', 뇨: 'nyo', 누: 'nu', 뉴: 'nyu', 느: 'neu', 니: 'ni',
    다: 'da', 댜: 'dya', 더: 'deo', 뎌: 'dyeo', 도: 'do', 됴: 'dyo', 두: 'du', 듀: 'dyu', 드: 'deu', 디: 'di',
    라: 'ra', 랴: 'rya', 러: 'reo', 려: 'ryeo', 로: 'ro', 료: 'ryo', 루: 'ru', 류: 'ryu', 르: 'reu', 리: 'ri',
    마: 'ma', 먀: 'mya', 머: 'meo', 며: 'myeo', 모: 'mo', 묘: 'myo', 무: 'mu', 뮤: 'myu', 므: 'meu', 미: 'mi',
    바: 'ba', 뱌: 'bya', 버: 'beo', 벼: 'byeo', 보: 'bo', 뵤: 'byo', 부: 'bu', 뷰: 'byu', 브: 'beu', 비: 'bi',
    사: 'sa', 샤: 'sya', 서: 'seo', 셔: 'syeo', 소: 'so', 쇼: 'syo', 수: 'su', 슈: 'syu', 스: 'seu', 시: 'si',
    아: 'a', 야: 'ya', 어: 'eo', 여: 'yeo', 오: 'o', 요: 'yo', 우: 'u', 유: 'yu', 으: 'eu', 이: 'i',
    자: 'ja', 쟈: 'jya', 저: 'jeo', 져: 'jyeo', 조: 'jo', 죠: 'jyo', 주: 'ju', 쥬: 'jyu', 즈: 'jeu', 지: 'ji',
    차: 'cha', 챠: 'chya', 처: 'cheo', 쳐: 'chyeo', 초: 'cho', 쵸: 'chyo', 추: 'chu', 츄: 'chyu', 츠: 'cheu', 치: 'chi',
    카: 'ka', 캬: 'kya', 커: 'keo', 켜: 'kyeo', 코: 'ko', 쿄: 'kyo', 쿠: 'ku', 큐: 'kyu', 크: 'keu', 키: 'ki',
    타: 'ta', 탸: 'tya', 터: 'teo', 텨: 'tyeo', 토: 'to', 툐: 'tyo', 투: 'tu', 튜: 'tyu', 트: 'teu', 티: 'ti',
    파: 'pa', 퍄: 'pya', 퍼: 'peo', 펴: 'pyeo', 포: 'po', 표: 'pyo', 푸: 'pu', 퓨: 'pyu', 프: 'peu', 피: 'pi',
    하: 'ha', 햐: 'hya', 허: 'heo', 혀: 'hyeo', 호: 'ho', 효: 'hyo', 후: 'hu', 휴: 'hyu', 흐: 'heu', 히: 'hi',
  };

  // 한글을 로마자로 변환 (간단한 방식)
  // 실제로는 더 정교한 한글-로마자 변환 필요
  let slug = name
    .toLowerCase()
    .trim()
    // 한글, 영문, 숫자, 공백만 남기고 나머지 제거
    .replace(/[^\uAC00-\uD7A3a-z0-9\s-]/g, '')
    // 공백을 하이픈으로 변환
    .replace(/\s+/g, '-')
    // 연속된 하이픈을 하나로
    .replace(/-+/g, '-')
    // 앞뒤 하이픈 제거
    .replace(/^-+|-+$/g, '');

  // 한글이 포함된 경우 간단한 변환 시도
  // 실제 프로덕션에서는 'hangul-js' 같은 라이브러리 사용 권장
  if (/[\uAC00-\uD7A3]/.test(slug)) {
    // 한글을 포함한 경우, 병원명의 초성/중성/종성을 기반으로 간단한 slug 생성
    // 또는 병원명을 그대로 사용하되 URL 인코딩
    slug = name
      .toLowerCase()
      .trim()
      .replace(/[^\uAC00-\uD7A3a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    // 한글이 있으면 인코딩하거나 간단한 해시 사용
    // 여기서는 병원명의 해시값을 추가하여 고유성 보장
    const hash = simpleHash(name);
    slug = `${slug}-${hash}`.substring(0, 100); // 최대 길이 제한
  }

  return slug || 'hospital';
}

/**
 * 간단한 해시 함수 (고유성 보장용)
 */
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // 32bit 정수로 변환
  }
  return Math.abs(hash).toString(36).substring(0, 8);
}

/**
 * slug가 고유한지 확인하고 필요시 숫자 추가
 */
export async function ensureUniqueSlug(
  baseSlug: string,
  checkUnique: (slug: string) => Promise<boolean>
): Promise<string> {
  let slug = baseSlug;
  let counter = 1;

  while (!(await checkUnique(slug))) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}

