/*
  Warnings:

  - You are about to drop the column `recordingTranscriptionId` on the `Speech` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[transcriptionSpeechId]` on the table `Speech` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `transcriptionSpeechId` to the `Speech` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Speech" DROP CONSTRAINT "Speech_recordingTranscriptionId_fkey";

-- AlterTable
ALTER TABLE "Speech" DROP COLUMN "recordingTranscriptionId",
ADD COLUMN     "patientId" TEXT,
ADD COLUMN     "transcriptionSpeechId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "TranscriptionSpeech" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "recordingTranscriptionId" TEXT NOT NULL,

    CONSTRAINT "TranscriptionSpeech_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TranscriptionEdition" (
    "id" TEXT NOT NULL,
    "transcriptionSpeechId" TEXT NOT NULL,
    "newSpeech" TEXT NOT NULL,

    CONSTRAINT "TranscriptionEdition_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TranscriptionEdition_transcriptionSpeechId_key" ON "TranscriptionEdition"("transcriptionSpeechId");

-- CreateIndex
CREATE UNIQUE INDEX "Speech_transcriptionSpeechId_key" ON "Speech"("transcriptionSpeechId");

-- AddForeignKey
ALTER TABLE "TranscriptionSpeech" ADD CONSTRAINT "TranscriptionSpeech_recordingTranscriptionId_fkey" FOREIGN KEY ("recordingTranscriptionId") REFERENCES "RecordingTranscription"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Speech" ADD CONSTRAINT "Speech_transcriptionSpeechId_fkey" FOREIGN KEY ("transcriptionSpeechId") REFERENCES "TranscriptionSpeech"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Speech" ADD CONSTRAINT "Speech_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TranscriptionEdition" ADD CONSTRAINT "TranscriptionEdition_transcriptionSpeechId_fkey" FOREIGN KEY ("transcriptionSpeechId") REFERENCES "TranscriptionSpeech"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
