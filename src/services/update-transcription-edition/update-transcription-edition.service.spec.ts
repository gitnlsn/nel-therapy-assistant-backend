import { Test, TestingModule } from '@nestjs/testing';
import { UpdateTranscriptionEditionService } from './update-transcription-edition.service';
import { PrismaService } from '../prisma-service/prisma-service';
import { Patient, RecordingTranscription } from '@prisma/client';

describe('UpdateTranscriptionEditionService', () => {
  let service: UpdateTranscriptionEditionService;
  let prisma: PrismaService;

  let patient: Patient;
  let recordingTranscription: RecordingTranscription;
  let transcriptionEdition: RecordingTranscription;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UpdateTranscriptionEditionService, PrismaService],
    }).compile();

    service = module.get<UpdateTranscriptionEditionService>(
      UpdateTranscriptionEditionService,
    );
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
  });

  afterEach(async () => {
    await prisma.transcriptionEdition.deleteMany({});
    await prisma.transcriptionSpeech.deleteMany({});
    await prisma.recordingTranscription.deleteMany({});
    await prisma.patient.deleteMany({});
  });

  const speeches = [
    {
      text: 'hoho',
      date: new Date(2023, 5, 16, 14, 5),
    },
    {
      text: 'girl',
      date: new Date(2023, 5, 16, 14, 6),
    },
  ];

  const payload = {
    date: new Date(2023, 6, 18, 14),
    duration: 3600,
    description: 'payload decription',

    speeches,
  };

  it('should updated transcription edition', async () => {
    const updatedTrasncription = await service.update({
      transcriptionId: transcriptionEdition.id,
      patientId: patient.id,

      ...payload,
    });

    expect(updatedTrasncription.id).toBe(transcriptionEdition.id);
    expect(updatedTrasncription.date).toEqual(payload.date);
    expect(updatedTrasncription.duration).toBe(payload.duration);
    expect(updatedTrasncription.description).toBe(payload.description);
    expect(updatedTrasncription.speeches.length).toBe(payload.speeches.length);
  });

  describe('exceptions', () => {
    it('should not update original transcription', async () => {
      expect(async () => {
        await service.update({
          transcriptionId: recordingTranscription.id,
          patientId: patient.id,

          ...payload,
        });
      }).rejects.toThrow();
    });

    it('should not update if wrong transcription id', async () => {
      expect(async () => {
        await service.update({
          transcriptionId: 'wrong transcription id',
          patientId: patient.id,

          ...payload,
        });
      }).rejects.toThrow();
    });

    it('should not update if wrong patient id', async () => {
      expect(async () => {
        await service.update({
          transcriptionId: transcriptionEdition.id,
          patientId: 'wrong patient id',

          ...payload,
        });
      }).rejects.toThrow();
    });
  });
});
