import { Test, TestingModule } from '@nestjs/testing';
import { CreateTranscriptionEditionService } from './create-transcription-edition.service';
import { PrismaService } from '../prisma-service/prisma-service';
import { Patient, RecordingTranscription } from '@prisma/client';

describe('CreateTranscriptionEditionService', () => {
  let service: CreateTranscriptionEditionService;
  let prisma: PrismaService;

  let patient: Patient;
  let recordingTranscription: RecordingTranscription;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreateTranscriptionEditionService, PrismaService],
    }).compile();

    service = module.get<CreateTranscriptionEditionService>(
      CreateTranscriptionEditionService,
    );
    prisma = module.get<PrismaService>(PrismaService);
  });

  beforeEach(async () => {
    patient = await prisma.patient.create({ data: { name: 'patient name' } });

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
  });

  afterEach(async () => {
    await prisma.transcriptionSpeech.deleteMany({});
    await prisma.recordingTranscription.deleteMany({});
    await prisma.patient.deleteMany({});
  });

  const speeches = [
    { date: new Date(2023, 5, 15, 13, 10), text: 'hoy' },
    { date: new Date(2023, 5, 15, 13, 11), text: 'ma boy' },
  ];

  const editionPayload = {
    date: new Date(2023, 5, 15, 13),
    duration: 1800,
    description: 'another description',
    speeches,
  };

  it('should create edition', async () => {
    const transcriptionEdition = await service.create({
      patientId: patient.id,
      transcriptionId: recordingTranscription.id,

      ...editionPayload,
    });

    expect(transcriptionEdition.original.id).toBe(recordingTranscription.id);
    expect(transcriptionEdition.edition.date).toEqual(editionPayload.date);
    expect(transcriptionEdition.edition.description).toBe(
      editionPayload.description,
    );
    expect(transcriptionEdition.edition.duration).toBe(editionPayload.duration);
  });

  describe('exceptions', () => {
    it('should not create with wrong patientId', () => {
      expect(async () => {
        await service.create({
          patientId: 'wrong patient id',
          transcriptionId: recordingTranscription.id,

          ...editionPayload,
        });
      }).rejects.toThrow();
    });

    it('should not create with wrong transcriptionId', () => {
      expect(async () => {
        await service.create({
          patientId: patient.id,
          transcriptionId: 'wrong transcription id',

          ...editionPayload,
        });
      }).rejects.toThrow();
    });
  });
});
