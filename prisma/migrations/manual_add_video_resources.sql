-- Migration: Add video and resources support
-- This migration adds support for pre-recorded videos and file resources for webinars

-- Add video fields to Webinar table
ALTER TABLE "Webinar" ADD COLUMN IF NOT EXISTS "videoUrl" VARCHAR(500);
ALTER TABLE "Webinar" ADD COLUMN IF NOT EXISTS "isPreRecorded" BOOLEAN DEFAULT false;

-- Create WebinarResource table
CREATE TABLE IF NOT EXISTS "WebinarResource" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "webinarId" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "fileUrl" VARCHAR(500) NOT NULL,
    "fileName" VARCHAR(255) NOT NULL,
    "fileSize" INTEGER,
    "fileType" VARCHAR(100),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "WebinarResource_webinarId_fkey" FOREIGN KEY ("webinarId") REFERENCES "Webinar"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS "WebinarResource_webinarId_idx" ON "WebinarResource"("webinarId");

-- Comment explaining the changes
COMMENT ON COLUMN "Webinar"."videoUrl" IS 'URL to pre-recorded video file';
COMMENT ON COLUMN "Webinar"."isPreRecorded" IS 'Flag indicating if webinar uses pre-recorded video';
COMMENT ON TABLE "WebinarResource" IS 'Stores downloadable resources/files for webinars';
