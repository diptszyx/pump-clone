-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('BUY', 'SELL', 'REWARD');

-- CreateTable
CREATE TABLE "Token" (
    "id" SERIAL NOT NULL,
    "address" VARCHAR(42) NOT NULL,
    "creator" TEXT NOT NULL,
    "tokenURI" TEXT NOT NULL,
    "tvl" DOUBLE PRECISION NOT NULL DEFAULT 6000,
    "marketCap" DOUBLE PRECISION NOT NULL DEFAULT 6000,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" SERIAL NOT NULL,
    "tokenAddress" VARCHAR(42) NOT NULL,
    "userAddress" TEXT NOT NULL,
    "type" "TransactionType" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "valueUsd" DOUBLE PRECISION NOT NULL,
    "txHash" VARCHAR(66) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Token_address_key" ON "Token"("address");

-- CreateIndex
CREATE INDEX "Transaction_tokenAddress_idx" ON "Transaction"("tokenAddress");

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_tokenAddress_fkey" FOREIGN KEY ("tokenAddress") REFERENCES "Token"("address") ON DELETE RESTRICT ON UPDATE CASCADE;
