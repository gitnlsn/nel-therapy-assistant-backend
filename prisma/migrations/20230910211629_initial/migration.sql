-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('scheduled', 'done', 'canceled', 'deleted');

-- CreateEnum
CREATE TYPE "SpeechMark" AS ENUM ('star', 'saved', 'important', 'ignore');

-- CreateTable
CREATE TABLE "Patient" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PatientNote" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,

    CONSTRAINT "PatientNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Appointment" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER NOT NULL,
    "status" "AppointmentStatus" NOT NULL,
    "patientId" TEXT NOT NULL,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AppointmentNote" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "appointmentId" TEXT NOT NULL,

    CONSTRAINT "AppointmentNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecordingTranscription" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,

    CONSTRAINT "RecordingTranscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TranscriptionSpeech" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "marks" "SpeechMark"[],
    "recordingTranscriptionId" TEXT NOT NULL,

    CONSTRAINT "TranscriptionSpeech_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpeechNote" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "transcriptionSpeechId" TEXT,

    CONSTRAINT "SpeechNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TranscriptionEdition" (
    "id" TEXT NOT NULL,
    "originalTranscriptionId" TEXT NOT NULL,
    "editionTranscriptionId" TEXT NOT NULL,

    CONSTRAINT "TranscriptionEdition_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PatientNote" ADD CONSTRAINT "PatientNote_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppointmentNote" ADD CONSTRAINT "AppointmentNote_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecordingTranscription" ADD CONSTRAINT "RecordingTranscription_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TranscriptionSpeech" ADD CONSTRAINT "TranscriptionSpeech_recordingTranscriptionId_fkey" FOREIGN KEY ("recordingTranscriptionId") REFERENCES "RecordingTranscription"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpeechNote" ADD CONSTRAINT "SpeechNote_transcriptionSpeechId_fkey" FOREIGN KEY ("transcriptionSpeechId") REFERENCES "TranscriptionSpeech"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TranscriptionEdition" ADD CONSTRAINT "TranscriptionEdition_originalTranscriptionId_fkey" FOREIGN KEY ("originalTranscriptionId") REFERENCES "RecordingTranscription"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TranscriptionEdition" ADD CONSTRAINT "TranscriptionEdition_editionTranscriptionId_fkey" FOREIGN KEY ("editionTranscriptionId") REFERENCES "RecordingTranscription"("id") ON DELETE CASCADE ON UPDATE CASCADE;
