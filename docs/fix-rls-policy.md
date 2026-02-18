# Supabase RLS 정책 수정 가이드

## 문제 상황
- 환경 변수는 정상적으로 설정됨
- Supabase 연결은 성공
- 하지만 데이터가 0개로 조회됨

이는 **RLS (Row Level Security) 정책** 때문에 발생하는 문제입니다.

## 해결 방법

### 방법 1: RLS 비활성화 (개발 환경용)

Supabase 대시보드 → SQL Editor에서 실행:

```sql
-- RLS 비활성화
ALTER TABLE hospitals DISABLE ROW LEVEL SECURITY;
```

### 방법 2: 공개 읽기 정책 추가 (프로덕션 권장)

```sql
-- 기존 정책 확인
SELECT * FROM pg_policies WHERE tablename = 'hospitals';

-- 공개 읽기 정책 추가
CREATE POLICY "Allow public read access" ON hospitals
  FOR SELECT
  USING (true);

-- 쓰기 권한도 필요한 경우 (선택사항)
CREATE POLICY "Allow public insert access" ON hospitals
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update access" ON hospitals
  FOR UPDATE
  USING (true);
```

### 방법 3: 인증된 사용자만 허용 (더 안전한 방법)

```sql
-- 인증된 사용자만 읽기 허용
CREATE POLICY "Allow authenticated read access" ON hospitals
  FOR SELECT
  TO authenticated
  USING (true);
```

## 데이터 확인

RLS 정책을 수정한 후, Supabase Table Editor에서 직접 확인:

1. Supabase 대시보드 접속
2. Table Editor → `hospitals` 테이블 선택
3. 데이터가 있는지 확인
4. 데이터가 있다면 RLS 정책 문제가 확실함

## 테스트 쿼리

SQL Editor에서 직접 테스트:

```sql
-- 데이터 개수 확인
SELECT COUNT(*) FROM hospitals;

-- 데이터 샘플 확인
SELECT * FROM hospitals LIMIT 5;
```

이 쿼리들이 성공하면 데이터는 있는 것이고, RLS 정책만 문제인 것입니다.

