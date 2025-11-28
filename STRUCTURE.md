# Emotion Vault - 프로젝트 구조 📁

```
emotion-vault/
│
├── 📄 설정 파일들
│   ├── package.json              # NPM 의존성 및 스크립트
│   ├── tsconfig.json             # TypeScript 설정
│   ├── next.config.js            # Next.js 설정
│   ├── tailwind.config.ts        # Tailwind CSS 설정
│   ├── postcss.config.js         # PostCSS 설정
│   ├── components.json           # shadcn/ui 설정
│   ├── .gitignore                # Git 무시 파일
│   ├── .env.example              # 환경 변수 템플릿
│   └── .env                      # 실제 환경 변수 (git 제외)
│
├── 🐳 Docker 설정
│   ├── Dockerfile                # Next.js 앱 컨테이너 이미지
│   ├── docker-compose.yml        # 멀티 컨테이너 오케스트레이션
│   └── .dockerignore             # Docker 빌드 제외 파일
│
├── 🗄️ 데이터베이스 (Prisma)
│   ├── prisma/
│   │   ├── schema.prisma         # 데이터 모델 정의
│   │   └── migrations/           # 마이그레이션 파일
│   │       └── 20231127000000_init/
│   │           └── migration.sql
│   └── lib/
│       └── prisma.ts             # Prisma Client 초기화
│
├── 🌐 백엔드 API (Next.js Route Handlers)
│   └── app/
│       └── api/
│           └── emotions/
│               ├── route.ts      # POST, GET (목록)
│               └── [id]/
│                   └── route.ts  # GET, PUT, DELETE (상세)
│
├── 🎨 프론트엔드 페이지
│   └── app/
│       ├── layout.tsx            # 루트 레이아웃 + Toaster
│       ├── page.tsx              # 홈 페이지 (/)
│       ├── globals.css           # 전역 스타일
│       ├── record/
│       │   └── page.tsx          # 감정 기록 페이지 (/record)
│       ├── timeline/
│       │   └── page.tsx          # 타임라인 페이지 (/timeline)
│       └── capsule/
│           └── [id]/
│               └── page.tsx      # 캡슐 상세 페이지 (/capsule/[id])
│
├── 🧩 UI 컴포넌트 (shadcn/ui)
│   └── components/
│       └── ui/
│           ├── button.tsx        # 버튼
│           ├── card.tsx          # 카드
│           ├── input.tsx         # 입력
│           ├── textarea.tsx      # 텍스트 영역
│           ├── slider.tsx        # 슬라이더
│           ├── label.tsx         # 라벨
│           ├── toast.tsx         # 토스트 알림
│           ├── toaster.tsx       # 토스트 컨테이너
│           └── use-toast.ts      # 토스트 훅
│
├── 🛠️ 유틸리티 및 타입
│   └── lib/
│       ├── utils.ts              # 범용 유틸리티
│       ├── types.ts              # TypeScript 타입 정의
│       └── date-utils.ts         # 날짜 포맷팅
│
├── 📚 문서
│   ├── README.md                 # 프로젝트 전체 문서
│   ├── QUICKSTART.md             # 빠른 시작 가이드
│   ├── DEVELOPMENT.md            # 개발 가이드
│   ├── PROJECT_SUMMARY.md        # 프로젝트 상세 보고서
│   ├── CHECKLIST.md              # 완성 체크리스트
│   └── STRUCTURE.md              # 이 파일
│
└── 🚀 셋업 스크립트
    ├── setup.sh                  # Linux/Mac 셋업
    └── setup.ps1                 # Windows PowerShell 셋업
```

---

## 📊 주요 디렉토리 설명

### `/app` - Next.js 14 App Router
Next.js의 새로운 App Router를 사용한 페이지 및 API 구조

**페이지:**
- `/` → `app/page.tsx` (홈)
- `/record` → `app/record/page.tsx` (기록)
- `/timeline` → `app/timeline/page.tsx` (타임라인)
- `/capsule/[id]` → `app/capsule/[id]/page.tsx` (상세)

**API:**
- `POST /api/emotions` → 캡슐 생성
- `GET /api/emotions` → 목록 조회
- `GET /api/emotions/[id]` → 상세 조회
- `PUT /api/emotions/[id]` → 수정
- `DELETE /api/emotions/[id]` → 삭제

### `/components` - 재사용 가능한 UI 컴포넌트
shadcn/ui 기반의 컴포넌트 라이브러리

### `/lib` - 공통 라이브러리
- Prisma Client 초기화
- TypeScript 타입 정의
- 유틸리티 함수
- 날짜 처리 함수

### `/prisma` - 데이터베이스 관련
- 스키마 정의
- 마이그레이션 히스토리

---

## 🔄 데이터 흐름

### 1️⃣ 감정 캡슐 생성 플로우
```
사용자 입력 (/record)
    ↓
폼 유효성 검증
    ↓
POST /api/emotions
    ↓
Prisma → PostgreSQL
    ↓
Toast 알림
    ↓
타임라인으로 리다이렉트
```

### 2️⃣ 타임라인 조회 플로우
```
페이지 로드 (/timeline)
    ↓
GET /api/emotions
    ↓
Prisma → PostgreSQL
    ↓
JSON 응답
    ↓
카드 UI 렌더링
```

### 3️⃣ 캡슐 상세 조회 플로우
```
카드 클릭 (/capsule/[id])
    ↓
GET /api/emotions/[id]
    ↓
Prisma → PostgreSQL
    ↓
JSON 응답
    ↓
몰입형 UI 렌더링
```

---

## 🗃️ 데이터베이스 구조

### User 테이블
```sql
users (
  id           TEXT PRIMARY KEY,
  email        TEXT UNIQUE NOT NULL,
  name         TEXT,
  createdAt    TIMESTAMP DEFAULT NOW(),
  updatedAt    TIMESTAMP
)
```

### EmotionCapsule 테이블
```sql
emotion_capsules (
  id           TEXT PRIMARY KEY,
  userId       TEXT → users(id) CASCADE,
  intensity    INTEGER (0-100),
  colorHex     TEXT (#RRGGBB),
  emotionType  ENUM,
  shortText    TEXT,
  note         TEXT NULLABLE,
  createdAt    TIMESTAMP DEFAULT NOW(),
  updatedAt    TIMESTAMP,
  
  INDEX(userId),
  INDEX(createdAt),
  INDEX(emotionType)
)
```

### EmotionType Enum
```
PASSION      (의지/열정)
SADNESS      (슬픔/상실)
PURE_JOY     (순수한 즐거움)
HEALING      (회복)
FEAR         (두려움)
LONELINESS   (외로움)
INSPIRATION  (영감)
OTHER        (기타)
```

---

## 🎨 컴포넌트 계층 구조

### 홈 페이지
```
page.tsx
├── Card (주요 기능 1)
├── Card (주요 기능 2)
└── 감정 타입 가이드
```

### 기록 페이지
```
page.tsx
└── Card
    └── Form
        ├── 감정 타입 버튼 그룹
        ├── Slider (강도)
        ├── 색상 선택기
        ├── Input (짧은 문장)
        ├── Textarea (메모)
        └── Button (저장)
```

### 타임라인 페이지
```
page.tsx
├── Header
│   └── Button (새 캡슐)
└── 캡슐 목록
    └── Card (각 캡슐)
        ├── 색상 바
        ├── 타입 배지
        ├── 강도 표시
        ├── 짧은 문장
        └── 날짜
```

### 캡슐 상세 페이지
```
page.tsx (색상 배경)
└── Card
    ├── 타입 배지
    ├── 짧은 문장 (큰 제목)
    ├── 강도 게이지
    ├── 메모 (있을 경우)
    └── 날짜
```

---

## 🔧 기술 스택 레이어

```
┌─────────────────────────────────────┐
│         프론트엔드 (React)           │
│  Next.js 14 + TypeScript + Tailwind │
│         shadcn/ui 컴포넌트           │
└─────────────────────────────────────┘
                 ↕ HTTP
┌─────────────────────────────────────┐
│         백엔드 (Next.js API)         │
│        Route Handlers (REST)        │
└─────────────────────────────────────┘
                 ↕ Prisma
┌─────────────────────────────────────┐
│            Prisma ORM               │
│         타입 안전 쿼리 빌더          │
└─────────────────────────────────────┘
                 ↕ SQL
┌─────────────────────────────────────┐
│        PostgreSQL 15 (Docker)       │
│          관계형 데이터베이스         │
└─────────────────────────────────────┘
```

---

## 📦 빌드 및 배포

### 개발 환경
```bash
npm run dev           # Next.js 개발 서버
npm run prisma:studio # Prisma Studio
docker-compose up -d  # 전체 스택 (DB + App)
```

### 프로덕션 빌드
```bash
npm run build         # Next.js 빌드
npm start             # 프로덕션 서버
docker-compose build  # Docker 이미지 빌드
```

### 배포 옵션
- **Vercel**: Next.js 네이티브 지원
- **Docker**: 어디서나 실행 가능
- **AWS/GCP/Azure**: 컨테이너 서비스

---

## 🔐 환경 변수 구조

```env
# 데이터베이스
POSTGRES_USER=...
POSTGRES_PASSWORD=...
POSTGRES_DB=...
DATABASE_URL=...

# 인증 (향후 확장)
NEXTAUTH_SECRET=...
NEXTAUTH_URL=...

# 앱 설정
NODE_ENV=development
```

---

## 📈 확장 가능성

### 쉽게 추가 가능
- ✅ 새로운 감정 타입
- ✅ 감정 필터링
- ✅ 날짜 범위 검색
- ✅ 통계 대시보드

### 중간 난이도
- 🔲 NextAuth.js 인증
- 🔲 사용자 프로필
- 🔲 캡슐 공유 기능
- 🔲 이미지 업로드

### 고급
- 🔲 AI 감정 분석
- 🔲 모바일 앱
- 🔲 실시간 동기화
- 🔲 소셜 기능

---

**프로젝트 구조가 명확하고 확장 가능하게 설계되었습니다! 🎯**
