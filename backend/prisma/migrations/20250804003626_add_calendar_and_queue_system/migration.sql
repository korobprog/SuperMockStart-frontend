-- CreateEnum
CREATE TYPE "public"."QueueStatus" AS ENUM ('WAITING', 'MATCHED', 'CANCELLED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "public"."QueueType" AS ENUM ('CANDIDATE', 'INTERVIEWER');

-- CreateEnum
CREATE TYPE "public"."SessionStatus" AS ENUM ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW');

-- CreateEnum
CREATE TYPE "public"."NotificationType" AS ENUM ('INTERVIEW_CONFIRMED', 'INTERVIEW_REMINDER', 'INTERVIEW_CANCELLED', 'FEEDBACK_REQUEST', 'FEEDBACK_REMINDER', 'ROLE_CHANGED');

-- CreateTable
CREATE TABLE "public"."interview_queue" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "profession" TEXT NOT NULL,
    "preferredDateTime" TIMESTAMP(3) NOT NULL,
    "timeFlexibility" INTEGER NOT NULL DEFAULT 30,
    "status" "public"."QueueStatus" NOT NULL DEFAULT 'WAITING',
    "queueType" "public"."QueueType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "matchedSessionId" TEXT,

    CONSTRAINT "interview_queue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."interview_sessions" (
    "id" TEXT NOT NULL,
    "interviewId" TEXT NOT NULL,
    "scheduledDateTime" TIMESTAMP(3) NOT NULL,
    "profession" TEXT NOT NULL,
    "meetingLink" TEXT NOT NULL,
    "status" "public"."SessionStatus" NOT NULL DEFAULT 'SCHEDULED',
    "candidateId" TEXT NOT NULL,
    "interviewerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "interview_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."notifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sessionId" TEXT,
    "type" "public"."NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "scheduled" TIMESTAMP(3),
    "sent" BOOLEAN NOT NULL DEFAULT false,
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."feedback" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "fromUserId" TEXT NOT NULL,
    "toUserId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "skills" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "feedback_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "interview_sessions_interviewId_key" ON "public"."interview_sessions"("interviewId");

-- CreateIndex
CREATE UNIQUE INDEX "feedback_sessionId_fromUserId_key" ON "public"."feedback"("sessionId", "fromUserId");

-- AddForeignKey
ALTER TABLE "public"."interview_queue" ADD CONSTRAINT "interview_queue_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."interview_queue" ADD CONSTRAINT "interview_queue_matchedSessionId_fkey" FOREIGN KEY ("matchedSessionId") REFERENCES "public"."interview_sessions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."interview_sessions" ADD CONSTRAINT "interview_sessions_interviewId_fkey" FOREIGN KEY ("interviewId") REFERENCES "public"."interviews"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."interview_sessions" ADD CONSTRAINT "interview_sessions_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."interview_sessions" ADD CONSTRAINT "interview_sessions_interviewerId_fkey" FOREIGN KEY ("interviewerId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."notifications" ADD CONSTRAINT "notifications_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "public"."interview_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."feedback" ADD CONSTRAINT "feedback_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "public"."interview_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."feedback" ADD CONSTRAINT "feedback_fromUserId_fkey" FOREIGN KEY ("fromUserId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."feedback" ADD CONSTRAINT "feedback_toUserId_fkey" FOREIGN KEY ("toUserId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
