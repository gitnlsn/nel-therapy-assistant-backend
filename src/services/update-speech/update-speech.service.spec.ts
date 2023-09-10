import { Test, TestingModule } from '@nestjs/testing';
import { UpdateSpeechService } from './update-speech.service';
import { PrismaService } from '../prisma-service/prisma-service';
import {
  Patient,
  RecordingTranscription,
  TranscriptionSpeech,
} from '@prisma/client';

describe('UpdateSpeechService', () => {
  let service: UpdateSpeechService;
  let prisma: PrismaService;

  let patient: Patient;
  let recordingTranscription: RecordingTranscription;
  let transcriptionEdition: RecordingTranscription;

  let originalSpeeches: TranscriptionSpeech[];
  let editionSpeeches: TranscriptionSpeech[];

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UpdateSpeechService, PrismaService],
    }).compile();

    service = module.get<UpdateSpeechService>(UpdateSpeechService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  beforeEach(async () => {
    patient = await prisma.patient.create({
      data: {
        name: 'patient name',
      },
    });

    recordingTranscription = await prisma.recordingTranscription.create({
      data: {
        date: new Date(2023, 5, 15, 14),
        duration: 3600,
        description: 'some description',
        patientId: patient.id,

        speeches: {
          createMany: {
            data: [
              {
                text: 'hello',
                date: new Date(2023, 5, 15, 14, 5),
              },
              {
                text: 'world',
                date: new Date(2023, 5, 15, 14, 6),
              },
            ],
          },
        },
      },
    });

    transcriptionEdition = await prisma.recordingTranscription.create({
      data: {
        date: new Date(2023, 5, 16, 14),
        duration: 1800,
        description: 'another description',
        patientId: patient.id,

        speeches: {
          createMany: {
            data: [
              {
                text: 'ho',
                date: new Date(2023, 5, 16, 14, 5),
              },
              {
                text: 'boy',
                date: new Date(2023, 5, 16, 14, 6),
              },
            ],
          },
        },
      },
    });

    await prisma.transcriptionEdition.create({
      data: {
        originalTranscriptionId: recordingTranscription.id,
        editionTranscriptionId: transcriptionEdition.id,
      },
    });

    originalSpeeches = await prisma.transcriptionSpeech.findMany({
      where: { recordingTranscriptionId: recordingTranscription.id },
    });

    editionSpeeches = await prisma.transcriptionSpeech.findMany({
      where: { recordingTranscriptionId: transcriptionEdition.id },
    });
  });

  afterEach(async () => {
    await prisma.speechNote.deleteMany({});
    await prisma.transcriptionEdition.deleteMany({});
    await prisma.transcriptionSpeech.deleteMany({});
    await prisma.recordingTranscription.deleteMany({});
    await prisma.patient.deleteMany({});
  });

  it('should update speech from transcription edition', async () => {
    const udpatedSpeech = await service.udpate({
      speechId: editionSpeeches[0].id,

      text: 'new speech',

      marks: ['star', 'saved'],
      notes: ['hello', 'goodbye'],
    });

    expect(udpatedSpeech.id).toBe(editionSpeeches[0].id);
  });

  describe('exceptions', () => {
    it('should not udpate speech from original speech', () => {
      expect(async () => {
        await service.udpate({
          speechId: originalSpeeches[0].id,

          text: 'new speech',

          marks: ['star', 'saved'],
          notes: ['hello', 'goodbye'],
        });
      }).rejects.toThrow();
    });
  });
});
