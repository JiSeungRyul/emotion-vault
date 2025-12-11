---
description: "Emotion Capsule Journal 기능 작업 목록"
---

# 작업: Emotion Capsule Journal

**입력**: `/specs/001-emotion-capsule/` 내 설계 문서
**선행 조건**: plan.md(필수), spec.md(유저 스토리 확인용 필수), research.md, data-model.md, contracts/

**테스트**: 자동화 테스트는 명시되지 않음. 수용 조건을 통한 수동 검증 중심으로 작업.
**구성**: 각 유저 스토리별로 묶어 독립 구현/검증 가능하도록 정리.

## 포맷: `[ID] [P?] [Story] Description`

- **[P]**: 병렬 가능(다른 파일, 의존성 없음)
- **[Story]**: 해당 유저 스토리 (예: US1, US2, US3)
- 설명에 정확한 파일 경로 포함

## Phase 1: 준비 (공통 인프라)

**목적**: 기능 작업을 위한 환경과 문서 준비

- [X] T001 `.env.example`에 캡슐 기능용 Postgres 연결 및 로깅 플레이스홀더 업데이트
- [X] T002 [P] 로컬 개발 퀵스타트(마이그레이션, dev 서버, 기본 사용자 시드) 단계를 `specs/001-emotion-capsule/quickstart.md`에 추가

---

## Phase 2: 기반 (모든 스토리 선행 조건)

**목적**: 모든 스토리에 필요한 핵심 데이터와 공용 헬퍼 준비

- [X] T003 `prisma/schema.prisma`에 EmotionCapsule 모델과 EmotionType enum, createdAt/emotionType 인덱스 추가 후 `prisma/migrations/`에 마이그레이션 생성
- [X] T004 [P] 감정 캡슐 DTO/타입과 색상 프리셋을 `lib/types.ts`에서 재사용하도록 정리
- [X] T005 [P] 공용 검증 헬퍼 구현(강도 0-100, #RRGGBB 색상, 필수 shortText, note trim) `lib/utils.ts`
- [X] T006 캡슐 엔드포인트용 구조화된 API 응답/로그 헬퍼를 `lib/utils.ts`(또는 신규 `lib/logging.ts`)에 추가해 에러 페이로드 표준화

---

## Phase 3: User Story 1 - 감정 캡슐 기록 (P1, MVP)

**목표**: 사용자가 강도/색상/감정 타입/짧은 문장/메모를 DB에 캡슐로 저장.
**독립 테스트**: 유효 입력으로 제출 시 저장·성공 메시지, 잘못된 입력 시 명확한 오류 반환 및 미기록.

- [X] T007 [US1] `app/api/emotions/route.ts`에서 검증·중복 가드 포함 POST `/api/emotions` 생성 플로우 구현
- [X] T008 [P] [US1] 기록 폼 UI 구성(강도 슬라이더, 색상 프리셋/커스텀 피커, 감정 타입 칩, 짧은 문장, 메모) `app/record/page.tsx`
- [X] T009 [US1] 폼 제출을 POST `/api/emotions`에 연결하고 로딩/비활성 처리, 성공 시 `/timeline` 리다이렉트 및 토스트 `app/record/page.tsx`
- [X] T010 [P] [US1] 공용 헬퍼로 강도/색상/shortText 클라이언트 검증 및 인라인 에러 표시 `app/record/page.tsx`
- [X] T011 [US1] 생성 성공/실패·검증 오류에 대한 구조화 로깅 추가 `app/api/emotions/route.ts`

---

## Phase 4: User Story 2 - 타임라인 조회 (P2)

**목표**: 최신순 타임라인에서 핵심 메타데이터와 함께 캡슐 목록을 본다.
**독립 테스트**: 최소 3개 최신 캡슐이 최신순으로 보이고 감정 타입, 강도, 짧은 문장, 메모 스니펫이 표시.

- [X] T012 [P] [US2] GET `/api/emotions`에 limit/offset 페이지네이션과 emotionType 필터 추가, createdAt desc 기본/limit 적용 `app/api/emotions/route.ts`
- [X] T013 [US2] 타임라인 카드에 색상 바, 감정 라벨, 강도, 짧은 문장, 메모 스니펫, 타임스탬프 렌더링 `app/timeline/page.tsx`
- [X] T014 [P] [US2] 타임라인 fetch용 로딩 스켈레톤, 빈 상태, 재시도 가능한 에러 처리 추가 `app/timeline/page.tsx`
- [X] T015 [US2] 타임라인 카드에서 캡슐 id로 상세 라우트 링크 연결 `app/timeline/page.tsx`

---

## Phase 5: User Story 3 - 캡슐 회상 (P3)

**목표**: 특정 캡슐을 몰입형 상세 화면으로 열어 모든 정보를 본다.
**독립 테스트**: 유효한 캡슐 id이면 색상, 감정 타입, 강도, 짧은 문장, 메모, 타임스탬프가 표시되고 잘못된 id는 404 뷰를 제공.

- [X] T016 [US3] `app/api/emotions/[id]/route.ts`에서 캡슐 조회, 구조화된 404, 로깅을 포함한 GET `/api/emotions/[id]` 구현
- [X] T017 [P] [US3] `app/capsule/[id]/page.tsx` 상세 페이지에서 캡슐 색상 헤더, 감정 타입, 강도, 짧은 문장, 메모, 생성/수정 시각을 fetch·표시
- [X] T018 [US3] 상세 페이지에 로딩/404/에러 상태와 타임라인 복귀 내비게이션 추가 `app/capsule/[id]/page.tsx`

---

## Phase 6: 마무리 & 공통 품질

**목적**: 안정화 및 릴리스 준비

- [X] T019 [P] `app/api/emotions` 라우트의 생성/조회/상세 핸들러에 구조화 로깅과 일관된 에러 형태 적용
- [X] T020 품질 게이트 실행(`npm run lint`, `npm run build`)으로 코드 품질·성능 예산 충족 확인

---

## 선행 관계 & 실행 순서

- 준비(Phase 1) → 기반(Phase 2) → US1(Phase 3) → US2(Phase 4) → US3(Phase 5) → 마무리(Phase 6)
- US2/US3는 데이터가 있어야 함. US1 완료 또는 Phase 2 이후 시드 데이터로 검증.
- 각 스토리 내 순서: 검증/타입 → UI 연결, API 핸들러 → UI 사용, 기본 플로우 완료 후 로깅.

## 구현 전략

- MVP 우선: 준비/기반 완료 후 US1 end-to-end 제공, 생성 플로우 검증 뒤 확장.
- 점진적: US2로 타임라인 추가(US1 유지), US3로 상세 추가, 마지막에 마무리 작업.
- 태스크 ID 단위의 작은 커밋 권장, 각 Phase 종료 시 수용 조건으로 검증.
