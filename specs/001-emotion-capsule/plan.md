# 구현 계획: Emotion Capsule Journal

**Branch**: `001-emotion-capsule` | **Date**: 2025-11-27 | **Spec**: specs/001-emotion-capsule/spec.md  
**Input**: `/specs/001-emotion-capsule/spec.md`

**Note**: `/speckit.plan`으로 작성됨.

## Summary

강도·색상·감정 타입·짧은 문장·메모로 감정을 구조화한 "감정 캡슐"을 저장하고, 타임라인과 몰입형 상세 뷰로 회상하는 웹앱을 만든다. 여기에 사용자 계정/로그인을 추가해 사용자별로 캡슐을 분리하고 인증되지 않으면 감정 API를 사용할 수 없게 만든다. 핵심 흐름: 회원가입/로그인 → 캡슐 생성 → 타임라인 조회(최신순) → 상세 회상. 성능 목표(API p95 <400ms, 페이지 TTI <3s), 명확한 검증/UX 상태, 주요 경로의 구조화 로그/보안 요구를 준수한다.

## Technical Context

**Language/Version**: TypeScript, Node.js 20, Next.js 14(App Router), React 18  
**Primary Dependencies**: Prisma 5, PostgreSQL 15, shadcn/ui + Radix UI, TailwindCSS  
**Storage**: PostgreSQL(Prisma, `prisma/schema.prisma`)  
**Auth**: JWT(access ~15m, refresh ~7d) + HttpOnly 쿠키, bcrypt 해시, refresh 토큰 보관(테이블/필드)  
**Testing**: 아직 구성 없음; Next API+Prisma 테스트 DB로 통합 테스트, 필요 시 컴포넌트 테스트 추가 예정  
**Target Platform**: Web(Next.js, 서버/클라이언트 컴포넌트)  
**Project Type**: 단일 웹앱(App Router)  
**Performance Goals**: API p95 <400ms, 페이지 TTI <3s(중급 기기); 과도한 페칭 회피, 필요 시 페이지네이션  
**Constraints**: 헌법 준수(코드 품질, 위험 대비 테스트, UX 일관성/A11y, 성능 예산, 구조화 로그); Prisma 마이그레이션; `.env.example` 최신화; 비밀번호 해시 저장(평문 금지), 민감정보 로깅 금지  
**Scale/Scope**: 다중 사용자(계정 보유자) 기준, 소셜 로그인 확장 여지 유지

## Constitution Check

- 테스트: 위험도 비례 테스트 필요. 캡슐 생성/목록/상세의 API·통합 테스트와 실패 경로 포함.  
- UX·A11y: 기존 디자인 토큰/컴포넌트 사용, 키보드/포커스/ARIA/대비, 로딩/빈 상태/에러/성공 상태 명시.  
- 성능: p95 API <400ms, TTI <3s; 중복 쿼리·과페칭 회피, 필요 시 페이지네이션.  
- 관측성·안전: 생성/목록/상세/인증 오류에 구조화 로그; 마이그레이션 전진만, 완화 노트 포함; 비밀번호/토큰은 로깅 금지.  
- 코드 품질: 응집도 높은 모듈, lint/format 통과, 주요 결정 기록.

## Project Structure

### Documentation (this feature)

specs/001-emotion-capsule/
- plan.md          # 구현 계획
- research.md      # Phase 0 (추가 조사 시)
- data-model.md    # Phase 1 데이터 모델 세부
- quickstart.md    # Phase 1 실행/설정 가이드
- contracts/       # Phase 1 API/컴포넌트 계약
- spec.md          # 기능 스펙

### Source Code (repository root)

app/
- api/
  - emotions/
    - route.ts          # POST 생성, GET 목록
    - [id]/route.ts     # GET 상세
  - auth/
    - register/route.ts # 회원가입
    - login/route.ts    # 로그인, 토큰 발급
    - logout/route.ts   # 로그아웃(리프레시 무효)
    - refresh/route.ts  # 리프레시로 액세스 재발급
    - me/route.ts       # 세션 확인
    - password-reset/route.ts # 토큰 발급/검증/변경(추가 시)
- record/page.tsx       # 캡슐 생성 UI
- timeline/page.tsx     # 타임라인
- capsule/[id]/page.tsx # 상세/회상 뷰
- (필요 시) login/register 페이지 또는 모달

components/
- ui/...                # 공유 UI (폼, 카드, 토스트 등)

lib/
- prisma.ts             # Prisma 클라이언트
- types.ts              # 공용 타입/enum
- utils.ts              # 포맷팅 등 헬퍼
- auth.ts               # JWT 서명/검증, 쿠키 헬퍼, password hash/compare
- logging.ts            # 구조화 로깅

prisma/
- schema.prisma         # EmotionCapsule 모델, User(passwordHash 등) 확장, RefreshToken(옵션)
- migrations/...        # DB 마이그레이션

**Structure Decision**: 단일 Next.js App Router 웹앱. API는 `app/api/emotions`, 페이지는 `app/record`, `app/timeline`, `app/capsule/[id]`, 공유 UI는 `components/ui`, 데이터는 Prisma/PostgreSQL.

## Auth Architecture (결정 초안)
- 토큰: Access JWT(약 15분) + Refresh JWT(약 7일), 둘 다 HttpOnly/SameSite 쿠키로 발급.
- 저장: Refresh 토큰은 DB(테이블 혹은 User 필드) 또는 캐시(미도입) 저장 후 서명/만료 검증, 로테이션 시 이전 토큰 무효화.
- 해시: passwordHash = bcrypt(또는 argon2) 저장, 평문/복호화 불가.
- 가드: 감정 API는 인증 미들웨어에서 userId 주입, 실패 시 401/403 표준 에러 바디.
- 리셋/탈퇴: 비밀번호 재설정 토큰/만료 필드 추가, 탈퇴 시 소유 데이터 처리 방침을 코드/스키마에 명시.

## Error Handling & Codes
- 400: 형식 오류(이메일/비밀번호 정책 불만족, 잘못된 페이로드)
- 401: 인증 없음/세션 만료
- 403: 타 사용자 데이터 접근 시도(권한 없음)
- 404: 리소스 없음(캡슐/토큰 등)
- 409: 이메일 중복 가입, 캡슐 중복(shortText+emotionType+user)
- 500: 서버 오류(예외 로깅)

## Security Considerations
- 비밀번호 해시: bcrypt saltRounds 10~12(또는 동급 보안 수준)
- 비밀번호 정책: 최소 8자(문자/숫자 조합 요구 여부 합의 후 적용)
- JWT 시크릿은 환경변수로 관리, 코드/로그에 노출 금지
- Refresh Token 탈취 대비: 서버 저장 & 로테이션, 무효화 목록 관리, HttpOnly/SameSite 쿠키 사용
- 민감정보(비밀번호, 토큰)는 로깅 금지, 에러 메시지는 사용자 친화 + 내부 코드 분리

## Test Strategy
- E2E: 회원가입 → 로그인 → 토큰 발급 → 보호된 감정 API 접근(성공/거절 경로) 시나리오
- 단위/통합: 로그인 실패(틀린 비밀번호, 없는 이메일), 중복 이메일 가입(409), 만료/잘못된 토큰 401/403
- 감정 API: 인증 없는 요청 401/403, 사용자 불일치 403, 정상 흐름 200/201, 검증 오류 400

## Complexity Tracking

중간(보안/인증 추가). 토큰 로테이션/무효화, 비밀번호 정책, 마이그레이션 영향에 주의. 테스트 없으므로 API/통합 테스트를 우선 검토.
