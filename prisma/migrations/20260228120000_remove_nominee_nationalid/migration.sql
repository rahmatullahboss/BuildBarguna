-- Remove nominee fields and nationalId from MemberProfile
ALTER TABLE "MemberProfile" DROP COLUMN IF EXISTS "nomineeName";
ALTER TABLE "MemberProfile" DROP COLUMN IF EXISTS "nomineePhone";
ALTER TABLE "MemberProfile" DROP COLUMN IF EXISTS "nomineeNationalId";
ALTER TABLE "MemberProfile" DROP COLUMN IF EXISTS "nomineeRelation";
ALTER TABLE "MemberProfile" DROP COLUMN IF EXISTS "nationalId";

-- Add referralCode if not exists (from previous migration)
ALTER TABLE "MemberProfile" ADD COLUMN IF NOT EXISTS "referralCode" TEXT;

-- Make address optional if not already
ALTER TABLE "MemberProfile" ALTER COLUMN "address" DROP NOT NULL;
