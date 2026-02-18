# treatment_price 컬럼 추가 가이드

## 개요
도수치료 가격 정보를 저장하기 위한 `treatment_price` 컬럼을 추가합니다.

## Supabase SQL Editor에서 실행

```sql
-- treatment_price 컬럼 추가
ALTER TABLE hospitals 
ADD COLUMN treatment_price INTEGER;

-- 인덱스 추가 (선택사항, 가격 필터링 성능 향상)
CREATE INDEX idx_hospitals_treatment_price ON hospitals(treatment_price) 
WHERE treatment_price IS NOT NULL;
```

## 컬럼 설명

- **타입**: `INTEGER`
- **설명**: 도수치료 가격 (원 단위)
- **특수 값**:
  - `NULL`: 가격 정보 없음
  - 양수: 실제 가격 (예: 50000 = 50,000원)
  - 음수: 지역 평균 가격 (예: -50000 = 지역 평균 약 50,000원)

## 가격 정보 업데이트

스크립트 실행:
```bash
npm run update-prices
```

또는:
```bash
npx tsx scripts/update-treatment-prices.ts
```

## 동작 방식

1. 건강보험심사평가원 API에서 도수치료(N0001) 가격 정보 조회
2. API에 정보가 있으면 양수로 저장
3. API에 정보가 없으면 해당 지역의 평균 가격 계산
4. 지역 평균도 없으면 NULL 유지

