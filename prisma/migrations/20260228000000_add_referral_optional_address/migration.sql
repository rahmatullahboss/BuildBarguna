-- AlterTable: make address optional and add referralCode to MemberProfile
ALTER TABLE "MemberProfile" ALTER COLUMN "address" DROP NOT NULL;
ALTER TABLE "MemberProfile" ADD COLUMN "referralCode" TEXT;
