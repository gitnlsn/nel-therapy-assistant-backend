-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('scheduled', 'done', 'canceled', 'deleted');

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
    "date" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER NOT NULL,
    "patientId" TEXT NOT NULL,

    CONSTRAINT "RecordingTranscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TranscriptionSpeech" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "recordingTranscriptionId" TEXT NOT NULL,

    CONSTRAINT "TranscriptionSpeech_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Speech" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "transcriptionSpeechId" TEXT NOT NULL,
    "patientId" TEXT,

    CONSTRAINT "Speech_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TranscriptionEdition" (
    "id" TEXT NOT NULL,
    "transcriptionSpeechId" TEXT NOT NULL,
    "newSpeech" TEXT NOT NULL,

    CONSTRAINT "TranscriptionEdition_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Speech_transcriptionSpeechId_key" ON "Speech"("transcriptionSpeechId");

-- CreateIndex
CREATE UNIQUE INDEX "TranscriptionEdition_transcriptionSpeechId_key" ON "TranscriptionEdition"("transcriptionSpeechId");

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
ALTER TABLE "Speech" ADD CONSTRAINT "Speech_transcriptionSpeechId_fkey" FOREIGN KEY ("transcriptionSpeechId") REFERENCES "TranscriptionSpeech"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Speech" ADD CONSTRAINT "Speech_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TranscriptionEdition" ADD CONSTRAINT "TranscriptionEdition_transcriptionSpeechId_fkey" FOREIGN KEY ("transcriptionSpeechId") REFERENCES "TranscriptionSpeech"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
