-- Add referralCode to MemberProfile
ALTER TABLE "MemberProfile" ADD COLUMN IF NOT EXISTS "referralCode" TEXT;
