# Feature Specification: Emotion Capsule Journal

**Feature Branch**: `001-emotion-capsule`  
**Created**: 2025-11-27  
**Status**: Draft  
**Source**: plan.md, tasks.md, 인증/계정 요구 추가

## 목표
- 감정을 강도·색상·타입·짧은 문장·메모로 구조화해 “감정 캡슐”로 저장·조회·회상한다.
- 사용자 계정/로그인을 추가해 개인별 캡슐을 보호하고, 인증되지 않으면 감정 기록/조회 API가 동작하지 않도록 한다.
- 성능 목표(API p95 <400ms, 주요 페이지 TTI <3s)와 명확한 검증/에러/로깅 경험을 유지한다.

## 범위
- 포함: 캡슐 생성/목록/상세 API·UI, 클라이언트/서버 검증, 로딩/빈/에러/성공 상태, 구조화 로깅, 회원가입·로그인·로그아웃, 비밀번호 정책·해시 저장, 비밀번호 재설정, 회원 탈퇴, 인증 가드.
- 제외(향후): 소셜 로그인(Google/Kakao) 구현은 후순위이나 확장 가능하게 설계(프로바이더 필드/테이블 여지).

## 사용자 스토리 및 수용 조건
### US1 감정 캡슐 기록 (P1)
- 사용자는 강도(0~100), 색상(#RRGGBB), 감정 타입(enum), 짧은 문장, 메모(선택)를 입력해 캡슐을 저장한다.
- 수용 조건:
  - 필수/형식 오류 시 인라인/토스트로 안내되고 저장되지 않는다.
  - 중복(shortText+emotionType 동일, 동일 user) 시 409 반환 및 안내.
  - 성공 시 타임라인으로 리다이렉트+토스트.
  - 잘못된 JSON·범위 외 강도·잘못된 색상/타입은 400으로 표준 에러 바디를 반환.
  - 인증되지 않은 사용자는 401/403으로 거절된다.

### US2 타임라인 조회 (P2)
- 사용자는 최신순 캡슐 목록을 보고 감정 타입 라벨/색상, 강도, 짧은 문장, 메모 스니펫, 생성시각을 확인한다.
- 수용 조건:
  - 기본 정렬 createdAt desc, limit 기본 20, limit/offset 페이지네이션.
  - emotionType 필터가 유효하면 해당 타입만 반환.
  - 로딩 스켈레톤, 빈 상태, 재시도 가능한 에러 상태.
  - 카드 클릭 시 상세 이동.
  - 인증 없으면 401/403 거절.

### US3 캡슐 회상(상세) (P3)
- 사용자는 특정 캡슐을 열어 색상 헤더, 감정 타입, 강도, 짧은 문장, 메모, 생성/수정 시각을 본다.
- 수용 조건:
  - 유효 ID면 모든 필드 표시, 잘못된 ID면 404 전용 뷰/메시지.
  - 로딩 상태, 에러 시 재시도/타임라인 복귀 내비.
  - 인증 없으면 401/403 거절.

### US4 회원가입/로그인/로그아웃 (P0)
- 사용자는 아이디(이메일 혹은 username)와 비밀번호로 회원가입 후 로그인/로그아웃할 수 있다.
- 수용 조건:
  - 회원가입 시 비밀번호 정책 검증(예: 최소 8자, 대/소문자 또는 숫자 포함) 실패 시 400 + 에러 코드.
  - 비밀번호는 해시(예: bcrypt/argon2)로 저장, 평문 저장 금지.
  - 로그인 성공 시 세션/토큰이 발급되고 이후 보호 API 접근 가능.
  - 로그아웃 시 세션/토큰 무효화.
  - 중복 이메일/아이디 가입 시 409.

### US5 회원 관리(비밀번호 재설정/회원 탈퇴) (P2)
- 사용자는 비밀번호를 재설정(토큰 기반)하거나 계정을 탈퇴할 수 있다.
- 수용 조건:
  - 비밀번호 재설정 요청 시 토큰 발급/만료 관리, 새 비밀번호 정책 준수.
  - 탈퇴 시 관련 캡슐은 사용자 소유 관계에 맞게 처리(기본: soft delete 사용자, 캡슐은 남기되 userId null 허용 or 소유자 유지; 구현 결정 사항을 명시).
  - 인증 실패/토큰 만료 시 401/403, 잘못된 토큰 400/404.

### 에지 케이스
- 강도 0/100 경계 값 처리.
- 색상 코드 형식 오류 거절.
- 동일(shortText+emotionType+user) 캡슐 중복 거절.
- 존재하지 않는 ID는 404.
- 인증 없이 감정 API 호출 시 401/403.
- 잘못된/만료된 세션·토큰, 잘못된 비밀번호, 중복 이메일 가입.

## 기능 요구사항
- FR-001: 캡슐 필드: intensity(0~100), colorHex(#RRGGBB), emotionType(enum), shortText(required, trim), note(optional, trim), createdAt/updatedAt, id.
- FR-002: POST `/api/emotions`에서 위 검증 및 중복(shortText+emotionType+user) 방지, 인증 필수.
- FR-003: GET `/api/emotions`에서 createdAt desc, limit/offset, emotionType 필터 지원, 인증 필수.
- FR-004: GET `/api/emotions/[id]`에서 캡슐+사용자 최소 메타 반환, 없으면 404, 인증 필수.
- FR-005: 구조화 에러 바디 `{ code, message }`와 로깅(scope, message, context) 일관 적용(생성/목록/상세/인증).
- FR-006: UI는 로딩/빈/에러/성공 상태를 모두 제공하고 주요 필드에 클라이언트 검증을 적용.
- FR-007: 타임라인/상세에서 색상 바·강도·감정 라벨·짧은 문장·메모 스니펫·타임스탬프 노출.
- FR-008: 인증/세션
  - `POST /api/auth/register`: 아이디(이메일 or username) + 비밀번호 정책 검증 후 해시 저장, 중복 시 409.
  - `POST /api/auth/login`: 아이디+비밀번호 검증, 성공 시 세션/토큰 발급, 실패 시 401.
  - `POST /api/auth/logout`: 세션/토큰 무효화.
  - `GET /api/auth/me`: 현재 세션 확인용.
  - `POST /api/auth/password/reset`(토큰 요청/확인), `DELETE /api/auth/account`(탈퇴) 정의.
  - 소셜 로그인 확장을 위해 provider/type 필드 혹은 별도 SocialAccount 테이블을 고려해 설계.
- FR-009: 기본 비밀번호 정책(예: 최소 8자, 문자/숫자 조합)과 해시 저장(bcrypt/argon2). 평문 저장 금지.
- FR-010: 인증 미보유 요청은 401/403, 에러 코드는 표준화(`UNAUTHENTICATED`, `UNAUTHORIZED`, `INVALID_CREDENTIALS` 등).

## 비기능/품질 요구
- NFR-001: API p95 <400ms, 페이지 TTI <3s(중급 기기).
- NFR-002: Prisma/Postgres를 사용하고 마이그레이션으로 스키마 관리; 인증 관련 인덱스(email/username unique, reset token 만료 인덱스) 추가.
- NFR-003: 접근성—키보드 탐색, 포커스 링, 대비 준수, 폼 레이블/ARIA.
- NFR-004: 보안—비밀번호 해시, 세션/토큰 보호(HTTP-only 쿠키 등), 기본 rate-limit/lockout 고려(추후), 민감 정보 로깅 금지.
- NFR-005: 로깅—생성/목록/상세/인증 성공·실패 모두 `logApiInfo`/`logApiError` 사용, 에러는 코드·메시지·컨텍스트 포함.

## 데이터 모델
- User: id, email/username(unique), passwordHash(+salt/params), name?, createdAt, updatedAt, resetToken?, resetTokenExpiresAt?, deletedAt?(soft delete 시), EmotionCapsule 관계. 소셜 확장 시 provider/providerId 필드 또는 SocialAccount 테이블 추가 고려.
- EmotionCapsule: id(cuid), userId(FK, 필요 시 null 허용 여부 결정), intensity(Int 0~100), colorHex(String), emotionType(EmotionType), shortText(String), note(Text?), createdAt, updatedAt.
- EmotionType enum: PASSION, SADNESS, PURE_JOY, HEALING, FEAR, LONELINESS, INSPIRATION, OTHER.

## API 계약(요약)
- POST `/api/emotions`: Body `{ intensity, colorHex, emotionType, shortText, note? }`, 인증 필수, 201/400/401/403/409/500.
- GET `/api/emotions`: Query `limit`(기본 20), `offset`(기본 0), `emotionType`(옵션), 인증 필수, 200/401/403/500.
- GET `/api/emotions/[id]`: Path `id`, 인증 필수, 200/401/403/404/500.
- POST `/api/auth/register`: Body `{ email|username, password, name? }`, 201/400/409/500.
- POST `/api/auth/login`: Body `{ email|username, password }`, 200/400/401/500.
- POST `/api/auth/logout`: 200/401.
- GET `/api/auth/me`: 200/401.
- POST `/api/auth/password/reset`: 토큰 발급/검증 흐름 정의(요청/변경 구분), 200/400/401/404/500.
- DELETE `/api/auth/account`: 200/401/403/500.

## UX 상태 및 흐름
- 기록 페이지(`/record`): 강도 슬라이더, 색상 프리셋/커스텀, 감정 타입 칩, 짧은 문장, 메모. 필수값 미입력/형식 오류 시 인라인 에러; 제출 중 비활성; 성공 시 `/timeline` 이동+토스트; 인증 없으면 로그인 페이지/모달 유도.
- 타임라인(`/timeline`): 로딩 스켈레톤 → 카드 목록 → 빈 상태 메시지/CTA → 에러 시 재시도. 인증 없으면 로그인 유도.
- 상세(`/capsule/[id]`): 로딩 → 캡슐 정보 표시 → 404 뷰 → 에러 시 메시지·재시도/타임라인 복귀.
- 인증 UI: 회원가입/로그인 폼(아이디+비밀번호), 정책 불만족 시 인라인 에러; 로그인 성공 시 세션 저장 후 기존 페이지 복귀; 로그아웃 버튼/메뉴 제공; 비밀번호 재설정 플로우(요청 → 토큰 확인 → 새 비밀번호 입력).

## 성공 기준
- SC-001: 정상 입력 캡슐 생성 성공률 ≥98%(실패는 검증/중복 등 합당한 경우).
- SC-002: 타임라인 첫 페인트/TTI p95 <3s, API p95 <400ms.
- SC-003: 감정 타입/강도/색상/짧은 문장/메모가 상세·목록·생성 응답에서 일관되게 표시됨(샘플 확인 시 누락 0%).
- SC-004: 404/검증 오류 등 예외 상황에서 표준 에러 메시지 노출, 비정상 크래시 0건.
- SC-005: 비밀번호는 해시로만 저장(평문 0건), 인증 없는 보호 API 호출 시 100% 차단.
