-- Add nominee fields to MemberProfile
ALTER TABLE "MemberProfile"
  ADD COLUMN "nomineeName" TEXT,
  ADD COLUMN "nomineePhone" TEXT,
  ADD COLUMN "nomineeNationalId" TEXT,
  ADD COLUMN "nomineeRelation" TEXT;
