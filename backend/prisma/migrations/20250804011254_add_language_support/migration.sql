/*
  Warnings:

  - Added the required column `language` to the `interview_queue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `language` to the `interview_sessions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `language` to the `user_form_data` table without a default value. This is not possible if the table is not empty.

*/

-- Step 1: Add language column with default value 'en' to user_form_data
ALTER TABLE "public"."user_form_data" ADD COLUMN "language" TEXT NOT NULL DEFAULT 'en';

-- Step 2: Update language based on country for existing records
UPDATE "public"."user_form_data" SET "language" = 
  CASE 
    WHEN "country" IN ('RU', 'BY', 'KZ', 'KG', 'UZ', 'TJ', 'AM', 'GE', 'MD', 'UA') THEN 'ru'
    WHEN "country" IN ('US', 'GB', 'CA', 'AU', 'NZ', 'IE', 'ZA', 'IN', 'PK', 'BD', 'MY', 'SG', 'PH', 'NG', 'KE', 'GH', 'NO', 'SE', 'DK', 'FI', 'IS') THEN 'en'
    WHEN "country" IN ('DE', 'AT', 'CH') THEN 'de'
    WHEN "country" IN ('FR', 'BE', 'LU', 'MC') THEN 'fr'
    WHEN "country" IN ('ES', 'MX', 'AR', 'CO', 'PE', 'CL', 'VE', 'EC', 'UY', 'BO', 'PY') THEN 'es'
    WHEN "country" IN ('PT', 'BR') THEN 'pt'
    WHEN "country" = 'IT' THEN 'it'
    WHEN "country" = 'NL' THEN 'nl'
    WHEN "country" = 'PL' THEN 'pl'
    WHEN "country" = 'CZ' THEN 'cs'
    WHEN "country" = 'TR' THEN 'tr'
    WHEN "country" = 'JP' THEN 'ja'
    WHEN "country" = 'KR' THEN 'ko'
    WHEN "country" IN ('CN', 'TW', 'HK') THEN 'zh'
    WHEN "country" IN ('AE', 'SA', 'EG') THEN 'ar'
    WHEN "country" = 'IL' THEN 'he'
    ELSE 'en'
  END;

-- Step 3: Remove default value (will be handled by application logic now)
ALTER TABLE "public"."user_form_data" ALTER COLUMN "language" DROP DEFAULT;

-- Step 4: Add language column to interview_queue (no existing data expected)
ALTER TABLE "public"."interview_queue" ADD COLUMN "language" TEXT NOT NULL DEFAULT 'en';
ALTER TABLE "public"."interview_queue" ALTER COLUMN "language" DROP DEFAULT;

-- Step 5: Add language column to interview_sessions (no existing data expected)
ALTER TABLE "public"."interview_sessions" ADD COLUMN "language" TEXT NOT NULL DEFAULT 'en';
ALTER TABLE "public"."interview_sessions" ALTER COLUMN "language" DROP DEFAULT;
