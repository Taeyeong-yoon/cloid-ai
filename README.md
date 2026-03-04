# CLOID.AI – AI 연습 포털

최신 AI 트렌드를 자동으로 수집하고, 학습하고, 실습하는 포털.

## 실행

```bash
npm run dev              # 개발 서버 (http://localhost:3000)
npm run build            # 프로덕션 빌드
npm run radar:update     # Trend Radar 콘텐츠 수동 갱신
npm run learning:update  # Learning 토픽 수동 갱신
```

## 자동 갱신 구조

```
GitHub Actions (매일 09:00 KST)
  ├── npm run radar:update
  │     ├── Anthropic Blog (RSS)
  │     ├── GitHub anthropics/* (releases API)
  │     ├── Google News (RSS)
  │     └── Fallback 샘플 (항상 결과 보장)
  │           → content/radar/*.md + index.json 갱신
  │
  └── npm run learning:update
        ├── 하드코딩 토픽 3개 (Claude Code / MCP / Remote Control)
        ├── YouTube API (YOUTUBE_API_KEY 있을 때만)
        └── Fallback 영상 링크
              → content/learning/*.json 갱신
```

## SourceProvider 구조 (MCP 확장 가능)

```typescript
interface SourceProvider {
  name: string;
  fetchItems(): Promise<RawItem[]>;
}
// 향후 MCP 서버로 교체 시:
// class MCPSourceProvider implements SourceProvider { ... }
```

## 환경변수

`.env.local` 파일 생성 (`.env.local.example` 참고):

| 변수 | 필수 | 설명 |
|------|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Supabase 프로젝트 URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase anon key |
| `YOUTUBE_API_KEY` | 선택 | learning:update 영상 fetch용 |

## Supabase 설정

1. [supabase.com](https://supabase.com)에서 프로젝트 생성
2. **SQL Editor**에서 마이그레이션 실행:
   ```
   supabase/migrations/20260304_bookmarks.sql 파일 내용 복사 후 실행
   ```
3. **Authentication > Email** 활성화 확인
4. `.env.local`에 URL + anon key 입력

## 페이지 구성

| 경로 | 설명 |
|------|------|
| `/` | 홈 (최신 트렌드 카드) |
| `/radar` | AI 트렌드 목록 + 검색/태그 필터 |
| `/learning` | 주제별 학습 자료 |
| `/skills` | 스킬 레시피 목록 |
| `/labs` | 오늘의 실습 3개 |
| `/login` | 이메일 로그인/회원가입 |
| `/account` | 내 정보 + 북마크 목록 |
