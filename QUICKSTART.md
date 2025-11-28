# 빠른 시작 가이드 🚀

## 5분 안에 실행하기

### 필수 요구사항
- Docker Desktop 설치됨
- 인터넷 연결

### 단계별 실행

#### 1️⃣ 환경 변수 설정

```bash
# .env.example을 .env로 복사
copy .env.example .env
```

`.env` 파일을 열어서 비밀번호를 설정하세요:

```env
POSTGRES_PASSWORD=your_password_123
```

#### 2️⃣ Docker 실행

```bash
docker-compose up -d
```

#### 3️⃣ 데이터베이스 초기화 (최초 1회만 실행)

```bash
# 의존성 설치 (prisma 포함)
npm install

# 마이그레이션 실행
DATABASE_URL="postgresql://emotionvault:your_password_123@localhost:5432/emotion_vault?schema=public" npx prisma migrate deploy
```

#### 4️⃣ 브라우저에서 접속

```
http://localhost:3000
```

끝! 🎉

---

## 트러블슈팅 💡

### 문제: Docker가 시작되지 않음

```bash
# Docker Desktop이 실행 중인지 확인
docker --version

# Docker Desktop을 재시작하세요
```

### 문제: 포트 3000이 이미 사용 중

`docker-compose.yml` 파일을 열어서 포트 변경:

```yaml
ports:
  - "3001:3000"  # 3000 → 3001로 변경
```

### 문제: 데이터베이스 연결 오류

```bash
# 컨테이너 로그 확인
docker-compose logs db

# 컨테이너 재시작
docker-compose restart
```

---

## 주요 명령어 📝

```bash
# 시작
docker-compose up -d

# 중지
docker-compose down

# 로그 보기
docker-compose logs -f

# 데이터베이스 포함 완전 삭제
docker-compose down -v

# 재시작
docker-compose restart
```

---

## 로컬 개발 (Docker 없이)

### 1. PostgreSQL 설치

Windows에서 PostgreSQL 설치:
https://www.postgresql.org/download/windows/

### 2. 의존성 설치

```bash
npm install
```

### 3. 환경 변수 설정

`.env` 파일:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/emotion_vault?schema=public"
```

### 4. 데이터베이스 마이그레이션

```bash
# Prisma Client 생성
npm run prisma:generate

# 개발 환경 마이그레이션
npm run prisma:migrate

# 또는 배포 환경 마이그레이션
npx prisma migrate deploy
```

### 5. 개발 서버 시작

```bash
npm run dev
```

---

## 주요 페이지 🗺️

| 페이지 | URL | 설명 |
|--------|-----|------|
| 홈 | `/` | 프로젝트 소개 |
| 감정 기록 | `/record` | 새 감정 캡슐 만들기 |
| 타임라인 | `/timeline` | 모든 캡슐 보기 |
| 캡슐 상세 | `/capsule/[id]` | 특정 캡슐 회상 |

---

## 첫 감정 캡슐 만들기 ✨

1. http://localhost:3000/record 접속
2. 감정 타입 선택 (예: "의지/열정")
3. 강도 슬라이더 조정 (예: 75)
4. 색상 선택 (예: 빨강)
5. 문장 입력 (예: "오늘은 정말 의미있는 하루였다")
6. "감정 캡슐 저장" 클릭
7. 타임라인에서 확인!

---

## 데이터베이스 관리 🗄️

### Prisma Studio 실행

```bash
npm run prisma:studio
```

http://localhost:5555 에서 데이터 확인 및 수정 가능

### pgAdmin 실행 (Docker)

```bash
docker-compose --profile dev up -d
```

- URL: http://localhost:5050
- Email: admin@emotionvault.local
- Password: admin

---

## 프로덕션 배포 🌐

### Vercel 배포

1. Vercel에 PostgreSQL 데이터베이스 추가
2. 환경 변수 설정
3. GitHub 연동 또는 CLI로 배포

```bash
npm install -g vercel
vercel
```

### Docker로 배포

```bash
# 프로덕션 빌드
docker-compose build

# 실행
docker-compose up -d
```

---

## 도움이 필요하신가요? 🆘

1. README.md - 전체 문서
2. DEVELOPMENT.md - 개발 가이드
3. PROJECT_SUMMARY.md - 프로젝트 상세 정보
4. GitHub Issues - 버그 리포트

---

**즐거운 감정 기록 되세요! 💜**
