# Feature Specification: Auth & Login for Emotion Capsule

**Feature Branch**: `002-auth-login`  
**Created**: 2025-11-27  
**Status**: Draft  
**Source**: plan.md, tasks.md

## 목표
- 기존 감정 캡슐 앱에 사용자 계정/로그인을 추가해 사용자별로 데이터를 분리하고 보호한다.
- 인증 없이는 감정 기록/조회 API를 사용할 수 없게 하고, 비밀번호를 안전하게 저장한다.
- 소셜 로그인 추가 가능성을 열어두되 이번 사이클에서는 로컬 계정/비밀번호 기반으로 구현한다.

## 범위
- 포함: 회원가입·로그인·로그아웃, 액세스/리프레시 토큰 발급·재발급, 비밀번호 정책/해시 저장, 비밀번호 재설정, 회원 탈퇴, 인증 가드로 감정 API 보호.
- 제외: 감정 캡슐 기능 자체(001 사이클에서 구현됨), 소셜 로그인 실 구현(확장 여지만 고려), 계정 프로필 편집/2FA.

## 사용자 스토리 및 수용 조건
### US-A1 회원가입/로그인/로그아웃 (P0)
- 사용자는 이메일(or username)과 비밀번호로 회원가입 후 로그인/로그아웃할 수 있다.
- 수용 조건:
  - 비밀번호 정책(최소 8자, 문자/숫자 조합 여부는 정책 결정 후 적용) 불만족 시 400 + 에러 코드.
  - 이메일 중복 가입 시 409.
  - 비밀번호는 해시(bcrypt/argon2)로 저장, 평문 금지.
  - 로그인 성공 시 Access/Refresh 토큰이 발급되고, 보호된 감정 API 접근이 가능해진다.
  - 로그아웃 시 리프레시 토큰이 무효화된다.

### US-A2 토큰 재발급/세션 확인 (P1)
- 사용자는 액세스 토큰 만료 시 리프레시 토큰으로 새 액세스 토큰을 받을 수 있다.
- 수용 조건:
  - 유효한 리프레시 토큰이면 새 액세스 토큰 발급, 만료/무효/탈취 의심 시 401/403.
  - `/auth/me`로 현재 세션/사용자 정보를 확인할 수 있다.

### US-A3 비밀번호 재설정/회원 탈퇴 (P2)
- 사용자는 비밀번호를 재설정하거나 계정을 탈퇴할 수 있다.
- 수용 조건:
  - 재설정 토큰 발급/만료 관리, 새 비밀번호 정책 검증.
  - 탈퇴 시 리프레시 토큰 무효화, 비밀번호 해시 삭제 또는 계정 비활성 처리(soft delete). 감정 데이터 유지/처리에 대한 결정 사항을 명시.

### 보호된 감정 API (연계)
- 감정 생성/목록/상세 API는 인증이 없으면 401/403으로 거절된다.
- 타 사용자 데이터 접근 시 403.

### 에지 케이스
- 잘못된/만료된 토큰, 토큰 위조, 중복 이메일 가입.
- 비밀번호 정책 미준수, 잘못된 자격 증명, 토큰 재사용/탈취 시 무효화.
- 로그인 없이 감정 API 호출 시 401/403.

## 기능 요구사항
- FR-A01: `POST /api/auth/register` — 이메일(or username)·비밀번호로 회원가입, 정책 검증, bcrypt 해시 저장, 중복 시 409.
- FR-A02: `POST /api/auth/login` — 자격 증명 검증 후 Access/Refresh 토큰 발급, 실패 시 401.
- FR-A03: `POST /api/auth/logout` — 리프레시 토큰 무효화, 세션 종료.
- FR-A04: `POST /api/auth/refresh-token` — 유효한 리프레시로 새 액세스 발급, 만료/위조/중복 사용 시 거절.
- FR-A05: `GET /api/auth/me` — 현재 사용자 정보 반환, 미인증 시 401.
- FR-A06: `POST /api/auth/password/reset` — 토큰 발급/검증/변경 흐름 정의, 정책 검증.
- FR-A07: `DELETE /api/auth/account` — 탈퇴 처리(soft delete/비활성 등 결정).
- FR-A08: 감정 API(`POST/GET /api/emotions`, `GET /api/emotions/[id]`)에 인증 가드 적용, 권한 불일치 시 403, 미인증 401.
- FR-A09: 비밀번호 해시(bcrypt saltRounds 10~12), 평문 저장 금지, JWT 시크릿 환경변수 관리.
- FR-A10: 에러 바디 표준 `{ code, message }`; 주요 코드: 400 형식 오류, 401 미인증/만료, 403 권한 없음(타 사용자), 404 리소스 없음, 409 이메일 중복, 500 서버 오류.

## 비기능/품질 요구
- NFR-A01: 보안 — JWT 서명키 환경변수, HttpOnly/SameSite 쿠키 사용, 리프레시 토큰 서버 저장 및 로테이션/무효화, 민감정보 로깅 금지.
- NFR-A02: 성능 — 인증 API p95 <400ms.
- NFR-A03: 접근성 — 로그인/회원가입/재설정 폼에 레이블/ARIA, 포커스/키보드 탐색 지원.
- NFR-A04: 관측성 — 인증 성공/실패 모두 구조화 로깅, 에러는 코드/메시지/컨텍스트 포함.

## 데이터 모델
- User: id, email(unique), passwordHash(+salt/params), name?, createdAt, updatedAt, resetToken?, resetTokenExpiresAt?, deletedAt?(soft delete 시). 소셜 확장 시 provider/providerId 또는 SocialAccount 테이블 추가 여지.
- RefreshToken(선택 테이블 또는 User 필드): token, userId, expiresAt, rotatedFrom?, revokedAt?, createdAt.
- EmotionCapsule: 기존 001 사이클에서 정의된 모델(userId FK 포함). 이번 사이클에서 인증 가드만 연동.

## API 계약(요약)
- POST `/api/auth/register`: 201/400/409/500.
- POST `/api/auth/login`: 200/400/401/500.
- POST `/api/auth/logout`: 200/401.
- POST `/api/auth/refresh-token`: 200/400/401/403/500.
- GET `/api/auth/me`: 200/401.
- POST `/api/auth/password/reset`: 200/400/401/404/500.
- DELETE `/api/auth/account`: 200/401/403/500.
- 감정 API는 인증 필수, 미인증 401, 타 사용자 403, 기타 기존 스펙 준수.

## UX 상태 및 흐름
- 회원가입/로그인 폼: 이메일·비밀번호 입력, 정책 불만족 시 인라인 에러; 성공 시 토큰 저장(쿠키) 후 이전 페이지/타임라인으로 복귀.
- 비밀번호 재설정: 요청 → 토큰 확인 → 새 비밀번호 입력; 오류 시 명확한 에러 메시지.
- 보호 페이지 접근 시 미인증이면 로그인 페이지/모달로 유도, 로그인 후 원래 위치로 복귀.

## 성공 기준
- SC-A01: 비밀번호는 해시로만 저장(평문 0건).
- SC-A02: 인증 없는 보호 API 호출 차단율 100%.
- SC-A03: 이메일 중복 가입 시 409 반환, 잘못된 자격 증명 시 401 반환을 확인.
- SC-A04: 액세스 만료 후 리프레시로 재발급 성공, 만료/위조/재사용 시 거절 동작을 확인.
