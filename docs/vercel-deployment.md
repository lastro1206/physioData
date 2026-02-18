# Vercel 배포 가이드

## 배포 전 체크리스트

### 1. 환경 변수 설정

Vercel 대시보드에서 다음 환경 변수를 설정해야 합니다:

#### 필수 환경 변수
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
PUBLIC_DATA_API_KEY=your_public_data_api_key
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
```

#### 환경 변수 설정 방법
1. Vercel 대시보드 → 프로젝트 선택
2. Settings → Environment Variables
3. 위의 환경 변수들을 추가
4. Production, Preview, Development 모두에 적용

### 2. 빌드 설정 확인

`next.config.ts`가 이미 최적화되어 있습니다:
- `output: 'standalone'` - Vercel 배포 최적화
- 이미지 최적화 설정 완료
- 패키지 최적화 설정 완료

### 3. 배포 방법

#### 방법 1: Vercel CLI 사용
```bash
# Vercel CLI 설치 (전역)
npm i -g vercel

# 로그인
vercel login

# 배포
vercel

# 프로덕션 배포
vercel --prod
```

#### 방법 2: GitHub 연동 (권장)
1. GitHub에 코드 푸시
2. Vercel 대시보드 → Add New Project
3. GitHub 저장소 선택
4. 환경 변수 설정
5. Deploy

### 4. 배포 후 확인 사항

#### 필수 확인
- [ ] 메인 페이지 로드 확인: `https://your-domain.vercel.app`
- [ ] 병원 상세 페이지 확인: `https://your-domain.vercel.app/hospitals/1`
- [ ] sitemap.xml 확인: `https://your-domain.vercel.app/sitemap.xml`
- [ ] robots.txt 확인: `https://your-domain.vercel.app/robots.txt`

#### 데이터 확인
- [ ] Supabase 연결 확인
- [ ] 병원 데이터 표시 확인
- [ ] 다크모드 토글 작동 확인

### 5. 도메인 연결 (선택사항)

1. Vercel 대시보드 → 프로젝트 → Settings → Domains
2. 커스텀 도메인 추가
3. DNS 설정 안내에 따라 도메인 설정

### 6. 자동 배포 설정

GitHub 연동 시:
- `main` 브랜치에 푸시하면 자동으로 프로덕션 배포
- 다른 브랜치에 푸시하면 Preview 배포

### 7. 빌드 로그 확인

배포 중 문제가 발생하면:
1. Vercel 대시보드 → Deployments
2. 실패한 배포 클릭
3. Build Logs 확인

### 8. 환경 변수 보안

⚠️ 중요: 다음 파일들은 절대 Git에 커밋하지 마세요:
- `.env.local`
- `.env`
- `SUPABASE_SERVICE_ROLE_KEY` (서버 사이드 전용)

`.gitignore`에 이미 포함되어 있습니다.

## 트러블슈팅

### 빌드 실패 시
1. 로컬에서 빌드 테스트: `npm run build`
2. 환경 변수 확인
3. Supabase 연결 확인
4. Vercel 빌드 로그 확인

### 환경 변수 누락 시
- `NEXT_PUBLIC_*` 변수는 클라이언트에서 사용 가능
- 서버 전용 변수는 `NEXT_PUBLIC_` 접두사 없이 설정

### 데이터가 안 보일 때
1. Supabase RLS 정책 확인
2. 환경 변수 확인
3. 네트워크 탭에서 API 호출 확인

