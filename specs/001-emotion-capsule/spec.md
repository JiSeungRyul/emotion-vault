# Feature Specification: Emotion Capsule Journal (Base)

**Feature Branch**: `001-emotion-capsule`  
**Created**: 2025-11-27  
**Status**: Draft  
**Source**: plan.md, tasks.md

## 목표
- 감정을 강도·색상·타입·짧은 문장·메모로 구조화해 “감정 캡슐”로 저장·조회·회상한다.
- 타임라인과 몰입형 상세 뷰로 캡슐을 돌아볼 수 있게 한다.
- 성능 목표(API p95 <400ms, 주요 페이지 TTI <3s)와 명확한 검증/에러/로깅 경험을 제공한다.

## 범위
- 포함: 캡슐 생성/목록/상세 API·UI, 클라이언트/서버 검증, 로딩/빈/에러/성공 상태, 구조화 로깅.
- 제외: 인증/계정/로그인(별도 사이클 `002-auth-login`에서 처리), 소셜 로그인, 삭제/편집, 알림/공유, 검색/필터 고도화.

## 사용자 스토리 및 수용 조건
### US1 감정 캡슐 기록 (P1)
- 사용자는 강도(0~100), 색상(#RRGGBB), 감정 타입(enum), 짧은 문장, 메모(선택)를 입력해 캡슐을 저장한다.
- 수용 조건:
  - 필수/형식 오류 시 인라인/토스트로 안내되고 저장되지 않는다.
  - 중복(shortText+emotionType 동일) 시 409 반환 및 안내.
  - 성공 시 타임라인으로 리다이렉트+토스트.
  - 잘못된 JSON·범위 외 강도·잘못된 색상/타입은 400으로 표준 에러 바디를 반환.

### US2 타임라인 조회 (P2)
- 사용자는 최신순 캡슐 목록을 보고 감정 타입 라벨/색상, 강도, 짧은 문장, 메모 스니펫, 생성시각을 확인한다.
- 수용 조건:
  - 기본 정렬 createdAt desc, limit 기본 20, limit/offset 페이지네이션.
  - emotionType 필터가 유효하면 해당 타입만 반환.
  - 로딩 스켈레톤, 빈 상태, 재시도 가능한 에러 상태.
  - 카드 클릭 시 상세 이동.

### US3 캡슐 회상(상세) (P3)
- 사용자는 특정 캡슐을 열어 색상 헤더, 감정 타입, 강도, 짧은 문장, 메모, 생성/수정 시각을 본다.
- 수용 조건:
  - 유효 ID면 모든 필드 표시, 잘못된 ID면 404 전용 뷰/메시지.
  - 로딩 상태, 에러 시 재시도/타임라인 복귀 내비 제공.

### 에지 케이스
- 강도 0/100 경계 값 처리.
- 색상 코드 형식 오류 거절.
- 동일(shortText+emotionType) 캡슐 중복 거절.
- 존재하지 않는 ID는 404.
- 네트워크/서버 오류 시 표준 에러 바디와 UI 에러 상태 표시.

## 기능 요구사항
- FR-001: 캡슐 필드: intensity(0~100), colorHex(#RRGGBB), emotionType(enum), shortText(required, trim), note(optional, trim), createdAt/updatedAt, id.
- FR-002: POST `/api/emotions`에서 위 검증 및 중복(shortText+emotionType) 방지.
- FR-003: GET `/api/emotions`에서 createdAt desc, limit/offset, emotionType 필터 지원.
- FR-004: GET `/api/emotions/[id]`에서 캡슐+사용자 최소 메타 반환, 없으면 404.
- FR-005: 구조화 에러 바디 `{ code, message }`와 로깅(scope, message, context) 일관 적용(생성/목록/상세).
- FR-006: UI는 로딩/빈/에러/성공 상태를 모두 제공하고 주요 필드에 클라이언트 검증을 적용.
- FR-007: 타임라인/상세에서 색상 바·강도·감정 라벨·짧은 문장·메모 스니펫·타임스탬프 노출.

## 비기능/품질 요구
- NFR-001: API p95 <400ms, 페이지 TTI <3s(중급 기기).
- NFR-002: Prisma/Postgres를 사용하고 마이그레이션으로 스키마 관리.
- NFR-003: 접근성—키보드 탐색, 포커스 링, 대비 준수, 폼 필드 레이블/ARIA 제공.
- NFR-004: 로깅—생성/목록/상세 성공·실패 모두 `logApiInfo`/`logApiError`로 남긴다, 에러는 코드·메시지·컨텍스트 포함.

## 데이터 모델
- EmotionCapsule: id(cuid), userId(FK, 기본 단일 사용자 혹은 기본 유저), intensity(Int 0~100), colorHex(String), emotionType(EmotionType), shortText(String), note(Text?), createdAt, updatedAt.
- EmotionType enum: PASSION, SADNESS, PURE_JOY, HEALING, FEAR, LONELINESS, INSPIRATION, OTHER.
- User(베이스): 기본 사용자 1명 가정(추후 다중 사용자 확장 시 002 사이클에서 인증/계정 도입).

## API 계약(요약)
- POST `/api/emotions`: Body `{ intensity, colorHex, emotionType, shortText, note? }`, 201/400/409/500.
- GET `/api/emotions`: Query `limit`(기본 20), `offset`(기본 0), `emotionType`(옵션), 200/500.
- GET `/api/emotions/[id]`: Path `id`, 200/404/500.

## UX 상태 및 흐름
- 기록 페이지(`/record`): 강도 슬라이더, 색상 프리셋/커스텀, 감정 타입 칩, 짧은 문장, 메모. 필수값 미입력/형식 오류 시 인라인 에러; 제출 중 비활성; 성공 시 `/timeline` 이동+토스트.
- 타임라인(`/timeline`): 로딩 스켈레톤 → 카드 목록 → 빈 상태 메시지/CTA → 에러 시 재시도.
- 상세(`/capsule/[id]`): 로딩 → 캡슐 정보 표시 → 404 뷰 → 에러 시 메시지·재시도/타임라인 복귀.

## 성공 기준
- SC-001: 정상 입력 캡슐 생성 성공률 ≥98%(실패는 검증/중복 등 합당한 경우).
- SC-002: 타임라인 첫 페인트/TTI p95 <3s, API p95 <400ms.
- SC-003: 감정 타입/강도/색상/짧은 문장/메모가 상세·목록·생성 응답에서 일관되게 표시됨(샘플 확인 시 누락 0%).
- SC-004: 404/검증 오류 등 예외 상황에서 표준 에러 메시지 노출, 비정상 크래시 0건.
