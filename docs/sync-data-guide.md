# 데이터 동기화 가이드

## 개요

공공데이터 API에서 물리치료 병원 데이터를 가져와 Supabase에 저장하는 자동화 스크립트입니다.

## 환경 변수 설정

`.env.local` 파일에 다음 환경 변수를 추가하세요:

```env
# 공공데이터 API 키
PUBLIC_DATA_API_KEY=your_api_key_here

# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 환경 변수 설명

- `PUBLIC_DATA_API_KEY`: 공공데이터포털(data.go.kr)에서 발급받은 API 키
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase 프로젝트 URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase Anon Key (공개 키)
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase Service Role Key (서버 사이드 전용, upsert 권한 필요)

## 실행 방법

### 1. 의존성 설치

```bash
npm install
```

### 2. 스크립트 실행

```bash
npm run sync-data
```

또는 직접 실행:

```bash
npx tsx scripts/sync-data.ts
```

## 동작 방식

1. **데이터 가져오기**: 공공데이터 API에서 물리치료과(코드: 21) 병원 데이터를 페이지네이션으로 가져옵니다.
2. **데이터 변환**: API 응답 형식을 Supabase 스키마에 맞게 변환합니다.
3. **Upsert**: `ykiho`(요양기관기호)를 기준으로 중복 데이터는 업데이트, 신규 데이터는 삽입합니다.

## 주기적 실행 설정

### Cron Job (Linux/Mac)

```bash
# 매일 새벽 2시에 실행
0 2 * * * cd /path/to/physiodata && npm run sync-data >> /var/log/sync-data.log 2>&1
```

### GitHub Actions

`.github/workflows/sync-data.yml` 파일 생성:

```yaml
name: Sync Hospital Data

on:
  schedule:
    - cron: '0 2 * * *' # 매일 새벽 2시 (UTC)
  workflow_dispatch: # 수동 실행 가능

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm install
      - run: npm run sync-data
        env:
          PUBLIC_DATA_API_KEY: ${{ secrets.PUBLIC_DATA_API_KEY }}
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
          SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
```

### Vercel Cron Jobs

`vercel.json` 파일에 cron 설정 추가:

```json
{
  "crons": [
    {
      "path": "/api/cron/sync-data",
      "schedule": "0 2 * * *"
    }
  ]
}
```

그리고 `app/api/cron/sync-data/route.ts` 생성:

```typescript
import { syncHospitalData } from '@/scripts/sync-data';

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    await syncHospitalData();
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: String(error) }, { status: 500 });
  }
}
```

## 문제 해결

### 에러: "Missing Supabase service role key"

- `.env.local`에 `SUPABASE_SERVICE_ROLE_KEY`가 설정되어 있는지 확인하세요.
- Supabase 대시보드 > Settings > API에서 Service Role Key를 확인하세요.

### 에러: "PUBLIC_DATA_API_KEY environment variable is not set"

- `.env.local`에 `PUBLIC_DATA_API_KEY`가 설정되어 있는지 확인하세요.
- 공공데이터포털에서 API 키를 발급받았는지 확인하세요.

### Upsert가 작동하지 않음

- Supabase 테이블에 `ykiho` 컬럼이 UNIQUE 제약조건이 있는지 확인하세요.
- `docs/supabase-schema.md`의 스키마를 참고하여 테이블을 생성하세요.

## 로그 확인

스크립트 실행 시 다음과 같은 로그가 출력됩니다:

```
=== 병원 데이터 동기화 시작 ===
공공데이터 API에서 병원 데이터를 가져오는 중...
페이지 1에서 100개의 병원 데이터를 가져왔습니다.
...
총 500개의 병원 데이터를 가져왔습니다.
데이터 형식을 변환하는 중...
변환 완료: 500개의 병원 데이터
Supabase에 데이터를 저장하는 중...
배치 1 완료: 100개 저장됨 (진행률: 20%)
...
=== 동기화 완료 ===
총 처리 시간: 45.23초
성공: 500개
실패: 0개
총 데이터: 500개
```

