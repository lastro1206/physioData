# area_prices 테이블 스키마

## 개요
전국 시/도별 비급여 진료비 통계 데이터를 저장하는 테이블입니다.

## 테이블 생성

```sql
CREATE TABLE area_prices (
  id BIGSERIAL PRIMARY KEY,
  region VARCHAR(50) NOT NULL, -- 시/도 (예: "서울특별시", "경기도")
  item_cd VARCHAR(10) NOT NULL, -- 항목코드 (N0001: 도수치료, N0002: 물리치료 등)
  item_nm VARCHAR(100), -- 항목명
  avg_price INTEGER NOT NULL, -- 평균 가격 (원)
  max_price INTEGER, -- 최고 가격 (원)
  min_price INTEGER, -- 최저 가격 (원)
  data_count INTEGER, -- 데이터 개수
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(region, item_cd) -- 지역과 항목코드 조합은 유일해야 함
);

-- 인덱스 생성
CREATE INDEX idx_area_prices_region ON area_prices(region);
CREATE INDEX idx_area_prices_item_cd ON area_prices(item_cd);
CREATE INDEX idx_area_prices_region_item ON area_prices(region, item_cd);
```

## 데이터 동기화

스크립트 실행:
```bash
npm run sync-area-prices
```

또는:
```bash
npx tsx scripts/sync-area-prices.ts
```

## 사용 예시

```sql
-- 서울특별시의 도수치료 평균 가격 조회
SELECT avg_price FROM area_prices 
WHERE region = '서울특별시' AND item_cd = 'N0001';

-- 모든 지역의 도수치료 평균 가격 조회
SELECT region, avg_price FROM area_prices 
WHERE item_cd = 'N0001' 
ORDER BY avg_price DESC;
```

