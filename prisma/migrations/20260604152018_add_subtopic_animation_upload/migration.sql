-- AlterTable
ALTER TABLE "Subtopic" ADD COLUMN "relatedProcessSlug" TEXT;

-- CreateTable
CREATE TABLE "UploadedMaterial" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fileName" TEXT NOT NULL,
    "topicSlug" TEXT,
    "rawText" TEXT NOT NULL,
    "suggestions" TEXT NOT NULL,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
