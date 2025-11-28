-- CreateEnum
CREATE TYPE "EmotionType" AS ENUM ('PASSION', 'SADNESS', 'PURE_JOY', 'HEALING', 'FEAR', 'LONELINESS', 'INSPIRATION', 'OTHER');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "emotion_capsules" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "intensity" INTEGER NOT NULL,
    "colorHex" TEXT NOT NULL,
    "emotionType" "EmotionType" NOT NULL,
    "shortText" TEXT NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "emotion_capsules_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "emotion_capsules_userId_idx" ON "emotion_capsules"("userId");

-- CreateIndex
CREATE INDEX "emotion_capsules_createdAt_idx" ON "emotion_capsules"("createdAt");

-- CreateIndex
CREATE INDEX "emotion_capsules_emotionType_idx" ON "emotion_capsules"("emotionType");

-- AddForeignKey
ALTER TABLE "emotion_capsules" ADD CONSTRAINT "emotion_capsules_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
