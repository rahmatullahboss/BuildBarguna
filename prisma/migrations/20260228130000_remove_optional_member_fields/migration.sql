-- Remove all optional fields from MemberProfile (address, bkashNumber, transactionId, paymentAmount, referralCode)
-- and remove any previously added columns from earlier migrations if they exist
ALTER TABLE "MemberProfile" DROP COLUMN IF EXISTS "address";
ALTER TABLE "MemberProfile" DROP COLUMN IF EXISTS "bkashNumber";
ALTER TABLE "MemberProfile" DROP COLUMN IF EXISTS "transactionId";
ALTER TABLE "MemberProfile" DROP COLUMN IF EXISTS "paymentAmount";
ALTER TABLE "MemberProfile" DROP COLUMN IF EXISTS "referralCode";
ALTER TABLE "MemberProfile" DROP COLUMN IF EXISTS "nomineeName";
ALTER TABLE "MemberProfile" DROP COLUMN IF EXISTS "nomineePhone";
ALTER TABLE "MemberProfile" DROP COLUMN IF EXISTS "nomineeNationalId";
ALTER TABLE "MemberProfile" DROP COLUMN IF EXISTS "nomineeRelation";
ALTER TABLE "MemberProfile" DROP COLUMN IF EXISTS "nationalId";
