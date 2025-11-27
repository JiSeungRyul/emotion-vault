# 구현 계획: Emotion Capsule Journal

**Branch**: `001-emotion-capsule` | **Date**: 2025-11-27 | **Spec**: specs/001-emotion-capsule/spec.md  
**Input**: `/specs/001-emotion-capsule/spec.md`

**Note**: `/speckit.plan`으로 작성됨.

## Summary

강도·색상·감정 타입·짧은 문장·메모로 감정을 구조화한 "감정 캡슐"을 저장하고, 타임라인과 몰입형 상세 뷰로 회상하는 웹앱을 만든다. 핵심 흐름: 캡슐 생성 → 타임라인 조회(최신순) → 상세 회상. 성능 목표(API p95 <400ms, 페이지 TTI <3s), 명확한 검증/UX 상태, 주요 경로의 구조화 로그를 준수한다.

## Technical Context

**Language/Version**: TypeScript, Node.js 20, Next.js 14(App Router), React 18  
**Primary Dependencies**: Prisma 5, PostgreSQL 15, shadcn/ui + Radix UI, TailwindCSS  
**Storage**: PostgreSQL(Prisma, `prisma/schema.prisma`)  
**Testing**: 아직 구성 없음; Next API+Prisma 테스트 DB로 통합 테스트, 필요 시 컴포넌트 테스트 추가 예정  
**Target Platform**: Web(Next.js, 서버/클라이언트 컴포넌트)  
**Project Type**: 단일 웹앱(App Router)  
**Performance Goals**: API p95 <400ms, 페이지 TTI <3s(중급 기기); 과도한 페칭 회피, 필요 시 페이지네이션  
**Constraints**: 헌법 준수(코드 품질, 위험 대비 테스트, UX 일관성/A11y, 성능 예산, 구조화 로그); Prisma 마이그레이션; `.env.example` 최신화  
**Scale/Scope**: 단일 사용자 가정, 추후 인증 연계로 다중 사용자 확장 가능

## Constitution Check

- 테스트: 위험도 비례 테스트 필요. 캡슐 생성/목록/상세의 API·통합 테스트와 실패 경로 포함.  
- UX·A11y: 기존 디자인 토큰/컴포넌트 사용, 키보드/포커스/ARIA/대비, 로딩/빈 상태/에러/성공 상태 명시.  
- 성능: p95 API <400ms, TTI <3s; 중복 쿼리·과페칭 회피, 필요 시 페이지네이션.  
- 관측성·안전: 생성/목록/상세 오류에 구조화 로그; 마이그레이션 전진만, 완화 노트 포함.  
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
- record/page.tsx       # 캡슐 생성 UI
- timeline/page.tsx     # 타임라인
- capsule/[id]/page.tsx # 상세/회상 뷰

components/
- ui/...                # 공유 UI (폼, 카드, 토스트 등)

lib/
- prisma.ts             # Prisma 클라이언트
- types.ts              # 공용 타입/enum
- utils.ts              # 포맷팅 등 헬퍼

prisma/
- schema.prisma         # EmotionCapsule 모델
- migrations/...        # DB 마이그레이션

**Structure Decision**: 단일 Next.js App Router 웹앱. API는 `app/api/emotions`, 페이지는 `app/record`, `app/timeline`, `app/capsule/[id]`, 공유 UI는 `components/ui`, 데이터는 Prisma/PostgreSQL.

## Complexity Tracking

해당 없음(헌법 위반 예상 없음).
