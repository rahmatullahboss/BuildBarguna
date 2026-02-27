-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('ACTIVE', 'CLOSED', 'PAUSED');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('BKASH', 'NAGAD', 'ONLINE_GATEWAY');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('DIVIDEND', 'TASK_REWARD', 'WITHDRAWAL', 'SHARE_PURCHASE');

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "titleBn" TEXT NOT NULL,
    "descriptionEn" TEXT NOT NULL,
    "descriptionBn" TEXT NOT NULL,
    "imageUrl" TEXT,
    "totalCapital" DOUBLE PRECISION NOT NULL,
    "totalShares" INTEGER NOT NULL,
    "pricePerShare" DOUBLE PRECISION NOT NULL,
    "availableShares" INTEGER NOT NULL,
    "status" "ProjectStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShareOrder" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "pricePerShare" DOUBLE PRECISION NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "paymentMethod" "PaymentMethod" NOT NULL,
    "paymentRef" TEXT,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "adminNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShareOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wallet" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "points" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WalletTransaction" (
    "id" TEXT NOT NULL,
    "walletId" TEXT NOT NULL,
    "type" "TransactionType" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WalletTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dividend" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "percentage" DOUBLE PRECISION NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "isDistributed" BOOLEAN NOT NULL DEFAULT false,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Dividend_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyTask" (
    "id" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "titleBn" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "pointReward" INTEGER NOT NULL DEFAULT 10,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DailyTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskCompletion" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TaskCompletion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_userId_key" ON "Wallet"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Dividend_projectId_month_year_key" ON "Dividend"("projectId", "month", "year");

-- CreateIndex
CREATE UNIQUE INDEX "TaskCompletion_userId_taskId_completedAt_key" ON "TaskCompletion"("userId", "taskId", "completedAt");
