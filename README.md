# Emotion Vault (감정 캡슐 저장소)

당신의 감정을 텍스트가 아닌 **감정 캡슐** 형태로 저장하고 회상할 수 있는 웹 애플리케이션입니다.

![Emotion Vault](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Prisma](https://img.shields.io/badge/Prisma-5-2D3748)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-316192)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED)

## 📖 프로젝트 개요

**Emotion Vault**는 감정을 숫자(강도), 색상(컬러), 타입(카테고리), 짧은 문장 등의 조합으로 기록하는 혁신적인 감정 일기 앱입니다.

### 핵심 개념: Emotion Capsule

각 감정 기록은 하나의 **감정 캡슐**이며 다음 속성을 가집니다:

- **강도(Intensity)**: 0~100 사이의 감정 세기
- **색상(Color)**: 감정을 시각적으로 표현하는 컬러 코드
- **타입(Type)**: 의지/열정, 슬픔/상실, 순수한 즐거움, 회복, 두려움, 외로움, 영감, 기타
- **짧은 문장(Short Text)**: 한 줄로 표현하는 감정
- **메모(Note)**: 선택적인 추가 설명

## 🚀 주요 기능

### 1. 감정 캡슐 기록 (`/record`)
- 슬라이더를 통한 감정 강도 선택 (0~100)
- 컬러 팔레트 또는 커스텀 색상 선택
- 8가지 감정 타입 중 선택
- 짧은 감정 문장과 추가 메모 입력

### 2. 타임라인 (`/timeline`)
- 저장된 모든 감정 캡슐을 시간순으로 조회
- 각 캡슐의 색상, 강도, 타입, 문장, 날짜 표시
- 카드 클릭 시 상세 페이지로 이동

### 3. 감정 캡슐 상세 회상 (`/capsule/[id]`)
- 선택한 감정의 색상을 기반으로 한 몰입형 배경
- 감정 강도 게이지 시각화
- 전체 내용(문장, 메모, 날짜) 표시

## 🛠️ 기술 스택

### Frontend
- **Next.js 14** (App Router)
- **React 18**
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui** (UI 컴포넌트 라이브러리)

### Backend
- **Next.js API Routes** (Server-side API)
- **Prisma ORM**
- **PostgreSQL 15**

### Infrastructure
- **Docker & Docker Compose**
- **Node.js 20 Alpine**

## 📋 필수 요구사항

- **Node.js**: 20.x 이상
- **npm** 또는 **yarn**
- **Docker** & **Docker Compose** (컨테이너 실행 시)

## 🏃‍♂️ 시작하기

### 1. 저장소 클론 및 의존성 설치

```bash
# 저장소 클론
git clone https://github.com/yourusername/emotion-vault.git
cd emotion-vault

# 의존성 설치
npm install
```

### 2. 환경 변수 설정

`.env.example` 파일을 `.env`로 복사하고 값을 설정합니다:

```bash
cp .env.example .env
```

`.env` 파일 예시:

```env
# Database Configuration
POSTGRES_USER=emotionvault
POSTGRES_PASSWORD=your_secure_password_here
POSTGRES_DB=emotion_vault

# Database URL for Prisma
# For docker-compose: use "db" as hostname
# For local development: use "localhost"
DATABASE_URL="postgresql://emotionvault:your_secure_password_here@db:5432/emotion_vault?schema=public"

# NextAuth Configuration (optional)
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000

# Application
NODE_ENV=development
```

**중요**: 실제 환경에서는 강력한 비밀번호를 사용하세요!

### 3. 로컬 개발 환경 실행

#### 방법 A: Docker Compose 사용 (권장)

```bash
# Docker Compose로 전체 스택 실행
docker-compose up -d

# 데이터베이스 마이그레이션 실행 (최초 1회)
npm install  # 로컬에 prisma 설치
DATABASE_URL="postgresql://emotionvault:your_secure_password_here@localhost:5432/emotion_vault?schema=public" npx prisma migrate deploy

# 로그 확인
docker-compose logs -f app
```

애플리케이션이 http://localhost:3000 에서 실행됩니다.

#### 방법 B: 로컬 개발 서버 사용

PostgreSQL이 로컬에 설치되어 있어야 합니다.

```bash
# Prisma Client 생성
npm run prisma:generate

# 데이터베이스 마이그레이션 (.env 파일에 DATABASE_URL 설정 필요)
npm run prisma:migrate
# 또는 배포용 마이그레이션
npx prisma migrate deploy

# 개발 서버 시작
npm run dev
```

애플리케이션이 http://localhost:3000 에서 실행됩니다.

### 4. Prisma Studio로 데이터베이스 관리 (선택사항)

```bash
npm run prisma:studio
```

Prisma Studio가 http://localhost:5555 에서 실행됩니다.

## 🗄️ 데이터베이스 스키마

### User
- `id`: 사용자 고유 ID
- `email`: 이메일 (고유)
- `name`: 사용자 이름 (선택)
- `createdAt`, `updatedAt`: 타임스탬프

### EmotionCapsule
- `id`: 캡슐 고유 ID
- `userId`: 사용자 ID (외래키)
- `intensity`: 감정 강도 (0~100)
- `colorHex`: 색상 코드 (#RRGGBB)
- `emotionType`: 감정 타입 (enum)
- `shortText`: 짧은 감정 문장
- `note`: 추가 메모 (선택)
- `createdAt`, `updatedAt`: 타임스탬프

### EmotionType (Enum)
- `PASSION`: 의지/열정
- `SADNESS`: 슬픔/상실
- `PURE_JOY`: 순수한 즐거움
- `HEALING`: 회복
- `FEAR`: 두려움
- `LONELINESS`: 외로움
- `INSPIRATION`: 영감
- `OTHER`: 기타

## 🔌 API 엔드포인트

### Emotions API

#### `POST /api/emotions`
새로운 감정 캡슐 생성

**Request Body:**
```json
{
  "intensity": 75,
  "colorHex": "#FF5A5A",
  "emotionType": "PASSION",
  "shortText": "오늘은 정말 의미있는 하루였다",
  "note": "새로운 프로젝트를 시작했고 팀원들과 좋은 시너지를 냈다"
}
```

#### `GET /api/emotions`
모든 감정 캡슐 조회 (최신순)

**Query Parameters:**
- `emotionType`: 감정 타입 필터 (선택)
- `limit`: 결과 개수 제한 (선택)
- `offset`: 페이지네이션 오프셋 (선택)

#### `GET /api/emotions/[id]`
특정 감정 캡슐 상세 조회

#### `PUT /api/emotions/[id]`
감정 캡슐 수정

#### `DELETE /api/emotions/[id]`
감정 캡슐 삭제

## 🐳 Docker 명령어

```bash
# 서비스 시작
docker-compose up -d

# 서비스 중지
docker-compose down

# 로그 확인
docker-compose logs -f

# 볼륨까지 제거 (데이터 삭제)
docker-compose down -v

# 이미지 재빌드
docker-compose build --no-cache

# pgAdmin 포함 실행 (개발 환경)
docker-compose --profile dev up -d
```

## 📁 프로젝트 구조

```
emotion-vault/
├── app/
│   ├── api/
│   │   └── emotions/
│   │       ├── route.ts              # GET, POST
│   │       └── [id]/
│   │           └── route.ts          # GET, PUT, DELETE
│   ├── capsule/
│   │   └── [id]/
│   │       └── page.tsx              # 감정 캡슐 상세 페이지
│   ├── record/
│   │   └── page.tsx                  # 감정 기록 페이지
│   ├── timeline/
│   │   └── page.tsx                  # 타임라인 페이지
│   ├── layout.tsx                    # 루트 레이아웃
│   ├── page.tsx                      # 홈 페이지
│   └── globals.css                   # 전역 스타일
├── components/
│   └── ui/                           # shadcn/ui 컴포넌트
├── lib/
│   ├── prisma.ts                     # Prisma Client 초기화
│   ├── types.ts                      # TypeScript 타입 정의
│   ├── utils.ts                      # 유틸리티 함수
│   └── date-utils.ts                 # 날짜 포맷팅 함수
├── prisma/
│   └── schema.prisma                 # Prisma 스키마
├── .env.example                      # 환경 변수 템플릿
├── .gitignore                        # Git 무시 파일
├── docker-compose.yml                # Docker Compose 설정
├── Dockerfile                        # Docker 이미지 설정
├── next.config.js                    # Next.js 설정
├── package.json                      # 프로젝트 의존성
├── tailwind.config.ts                # Tailwind CSS 설정
├── tsconfig.json                     # TypeScript 설정
└── README.md                         # 프로젝트 문서
```

## 🔒 보안 고려사항

- ✅ 환경 변수로 비밀 정보 분리 (`.env`)
- ✅ `.gitignore`에 민감한 파일 포함
- ✅ Prisma를 통한 SQL 인젝션 방지
- ✅ 입력 유효성 검증
- ⚠️ MVP 단계에서는 기본 사용자 사용 (향후 인증 구현 예정)

## 🔮 향후 개선 계획

- [ ] NextAuth.js 기반 OAuth 인증 (Google, GitHub)
- [ ] 다중 사용자 지원
- [ ] 감정 타입별 필터링
- [ ] 날짜 범위 검색
- [ ] 통계 및 분석 대시보드
- [ ] 감정 캡슐 공유 기능
- [ ] 모바일 앱 (React Native)

## 📝 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다.

## 👥 기여

기여를 환영합니다! Pull Request를 자유롭게 제출해주세요.

1. 이 저장소를 Fork합니다
2. 기능 브랜치를 생성합니다 (`git checkout -b feature/AmazingFeature`)
3. 변경사항을 커밋합니다 (`git commit -m 'Add some AmazingFeature'`)
4. 브랜치에 Push합니다 (`git push origin feature/AmazingFeature`)
5. Pull Request를 생성합니다

## 📧 문의

프로젝트에 대한 질문이나 제안사항이 있으시면 이슈를 생성해주세요.

---

**Emotion Vault** - 감정을 저장하고, 기억하고, 회상하세요 💜
