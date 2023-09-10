import { Test, TestingModule } from '@nestjs/testing';
import { CreateRecordingTranscriptionService } from './create-recording-transcription.service';
import { PrismaService } from '../prisma-service/prisma-service';
import { Patient } from '@prisma/client';

describe('CreateRecordingTranscriptionService', () => {
  let service: CreateRecordingTranscriptionService;
  let prisma: PrismaService;

  let patient: Patient;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreateRecordingTranscriptionService, PrismaService],
    }).compile();

    service = module.get<CreateRecordingTranscriptionService>(
      CreateRecordingTranscriptionService,
    );
    prisma = module.get<PrismaService>(PrismaService);
  });

  beforeEach(async () => {
    patient = await prisma.patient.create({
      data: {
        name: 'patient name',
      },
    });
  });

  afterEach(async () => {
    await prisma.transcriptionSpeech.deleteMany({});
    await prisma.recordingTranscription.deleteMany({});
    await prisma.patient.deleteMany({});
  });

  it('should create recording transcription', async () => {
    const speeches = [
      {
        date: new Date(2023, 5, 15, 14, 5),
        text: 'hello',
      },
      {
        date: new Date(2023, 5, 15, 14, 5, 5),
        text: 'world',
      },
    ];

    const payload = {
      date: new Date(2023, 5, 15, 14),
      duration: 3600,
      description: 'some description',
      speeches,
    };

    const recordingTranscription = await service.create({
      patientId: patient.id,

      ...payload,
    });

    expect(recordingTranscription.date).toEqual(payload.date);
    expect(recordingTranscription.duration).toEqual(payload.duration);
    expect(recordingTranscription.description).toEqual(payload.description);

    expect(recordingTranscription.speeches.length).toEqual(
      payload.speeches.length,
    );
  });
});
