# ykiho 컬럼 크기 수정 가이드

## 문제
`ykiho` 컬럼이 `VARCHAR(20)`으로 설정되어 있어 20자를 초과하는 값이 저장되지 않습니다.

에러: `value too long for type character varying(20)`

## 해결 방법

### Supabase SQL Editor에서 실행

```sql
-- ykiho 컬럼 크기를 20에서 50으로 증가
ALTER TABLE hospitals 
ALTER COLUMN ykiho TYPE VARCHAR(50);

-- 인덱스 재생성 (필요한 경우)
DROP INDEX IF EXISTS idx_hospitals_ykiho;
CREATE UNIQUE INDEX idx_hospitals_ykiho ON hospitals(ykiho);
```

### 또는 더 안전하게 TEXT로 변경 (길이 제한 없음)

```sql
-- ykiho 컬럼을 TEXT로 변경
ALTER TABLE hospitals 
ALTER COLUMN ykiho TYPE TEXT;

-- 인덱스 재생성
DROP INDEX IF EXISTS idx_hospitals_ykiho;
CREATE UNIQUE INDEX idx_hospitals_ykiho ON hospitals(ykiho);
```

## 확인

수정 후 다음 쿼리로 확인:

```sql
-- 컬럼 정보 확인
SELECT column_name, data_type, character_maximum_length 
FROM information_schema.columns 
WHERE table_name = 'hospitals' AND column_name = 'ykiho';
```

## 주의사항

- 기존 데이터가 있다면 데이터 손실 없이 컬럼 크기만 변경됩니다
- UNIQUE 제약조건은 유지됩니다
- 인덱스는 자동으로 재생성됩니다

