# Supabase 테이블 스키마

## hospitals 테이블

데이터 동기화를 위해 다음 스키마가 필요합니다.

### 필수 컬럼

```sql
CREATE TABLE hospitals (
  id BIGSERIAL PRIMARY KEY,
  ykiho VARCHAR(50) UNIQUE NOT NULL, -- 요양기관기호 (upsert 키) - 20에서 50으로 증가
  name VARCHAR(255) NOT NULL, -- 병원명
  slug VARCHAR(255), -- URL Friendly slug (병원명 기반 자동 생성)
  address TEXT NOT NULL, -- 주소
  phone VARCHAR(50), -- 전화번호
  description TEXT, -- 설명
  image TEXT, -- 이미지 URL
  cost INTEGER, -- 비용 (원 단위)
  treatment_price INTEGER, -- 도수치료 가격 (원 단위, 음수면 지역 평균)
  latitude DECIMAL(10, 8), -- 위도
  longitude DECIMAL(11, 8), -- 경도
  specialties TEXT[], -- 진료과목 배열
  operating_hours JSONB, -- 운영시간 (예: {"월": "09:00-18:00"})
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ykiho에 대한 unique 인덱스 (upsert를 위해 필수)
CREATE UNIQUE INDEX idx_hospitals_ykiho ON hospitals(ykiho);

-- 검색 성능을 위한 인덱스
CREATE INDEX idx_hospitals_name ON hospitals(name);
CREATE INDEX idx_hospitals_slug ON hospitals(slug) WHERE slug IS NOT NULL;
CREATE INDEX idx_hospitals_address ON hospitals(address);
CREATE INDEX idx_hospitals_cost ON hospitals(cost) WHERE cost IS NOT NULL;
```

### Supabase SQL 에디터에서 실행

1. Supabase 대시보드 접속
2. SQL Editor로 이동
3. 위의 SQL을 실행하여 테이블 생성

### 중요 사항

- `ykiho` 컬럼은 UNIQUE 제약조건이 있어야 upsert가 정상 작동합니다.
- `updated_at` 컬럼은 자동으로 업데이트되도록 트리거를 설정하는 것을 권장합니다.

### updated_at 자동 업데이트 트리거

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_hospitals_updated_at BEFORE UPDATE
    ON hospitals FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```
