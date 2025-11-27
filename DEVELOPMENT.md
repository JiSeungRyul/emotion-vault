# Emotion Vault - 개발 가이드

## 로컬 개발 환경 설정

### 1. 환경 변수 설정

```bash
cp .env.example .env
```

`.env` 파일을 열어서 다음 값들을 설정하세요:

```env
POSTGRES_USER=emotionvault
POSTGRES_PASSWORD=your_secure_password
POSTGRES_DB=emotion_vault
DATABASE_URL="postgresql://emotionvault:your_secure_password@localhost:5432/emotion_vault?schema=public"
```

### 2. Docker로 PostgreSQL 실행

```bash
# PostgreSQL만 실행 (로컬 개발 시)
docker run -d \
  --name emotion-vault-postgres \
  -e POSTGRES_USER=emotionvault \
  -e POSTGRES_PASSWORD=your_secure_password \
  -e POSTGRES_DB=emotion_vault \
  -p 5432:5432 \
  postgres:15-alpine

# 또는 docker-compose 사용
docker-compose up db -d
```

### 3. Prisma 마이그레이션

```bash
# Prisma Client 생성
npm run prisma:generate

# 개발 환경 마이그레이션 실행 (마이그레이션 파일 생성)
npm run prisma:migrate

# 배포 환경 마이그레이션 (기존 마이그레이션 파일 적용)
npx prisma migrate deploy

# 또는 개발 환경에서 스키마를 직접 푸시
npm run prisma:push
```

### 4. 개발 서버 시작

```bash
npm run dev
```

브라우저에서 http://localhost:3000 을 열어서 확인하세요.

## 데이터베이스 관리

### Prisma Studio 실행

```bash
npm run prisma:studio
```

http://localhost:5555 에서 데이터베이스를 시각적으로 관리할 수 있습니다.

### 새로운 마이그레이션 생성

```bash
npx prisma migrate dev --name your_migration_name
```

### 스키마 리셋 (개발 환경에서만!)

```bash
npx prisma migrate reset
```

## Docker 전체 스택 실행

### 프로덕션 빌드 및 실행

```bash
# 전체 스택 빌드 및 실행
docker-compose up --build

# 백그라운드 실행
docker-compose up -d

# 로그 확인
docker-compose logs -f app
```

### pgAdmin 포함 실행

```bash
docker-compose --profile dev up -d
```

- pgAdmin: http://localhost:5050
- Email: admin@emotionvault.local
- Password: admin

## 트러블슈팅

### 문제: Prisma Client 오류

```bash
# 해결: Prisma Client 재생성
npm run prisma:generate
```

### 문제: 데이터베이스 연결 실패

```bash
# Docker 컨테이너 상태 확인
docker ps

# PostgreSQL 로그 확인
docker logs emotion-vault-db

# 연결 테스트
docker exec -it emotion-vault-db psql -U emotionvault -d emotion_vault
```

### 문제: 포트 충돌

- 3000번 포트가 사용 중이면 Next.js 포트 변경:
  ```bash
  PORT=3001 npm run dev
  ```

- 5432번 포트가 사용 중이면 docker-compose.yml 수정:
  ```yaml
  ports:
    - "5433:5432"
  ```
  그리고 DATABASE_URL도 포트 변경

## 코드 스타일

### 린트 실행

```bash
npm run lint
```

### 타입 체크

```bash
npx tsc --noEmit
```

## 추가 명령어

```bash
# 의존성 업데이트
npm update

# Prisma 스키마 포맷팅
npx prisma format

# Next.js 빌드
npm run build

# 프로덕션 서버 실행
npm start
```
