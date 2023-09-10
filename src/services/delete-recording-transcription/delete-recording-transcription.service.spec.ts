import { Test, TestingModule } from '@nestjs/testing';
import { DeleteRecordingTranscriptionService } from './delete-recording-transcription.service';
import { PrismaService } from '../prisma-service/prisma-service';
import { Patient, RecordingTranscription } from '@prisma/client';

describe('DeleteRecordingTranscriptionService', () => {
  let service: DeleteRecordingTranscriptionService;
  let prisma: PrismaService;

  let patient: Patient;
  let recordingTranscription: RecordingTranscription;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeleteRecordingTranscriptionService, PrismaService],
    }).compile();

    service = module.get<DeleteRecordingTranscriptionService>(
      DeleteRecordingTranscriptionService,
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
  });

  afterEach(async () => {
    await prisma.transcriptionSpeech.deleteMany({});
    await prisma.recordingTranscription.deleteMany({});
    await prisma.patient.deleteMany({});
  });

  it('should delete recording transcription', async () => {
    const deletedTranscription = await service.delete({
      transcriptionId: recordingTranscription.id,
    });

    expect(deletedTranscription.id).toBe(recordingTranscription.id);

    const existingRecordings = await prisma.recordingTranscription.findMany({
      where: {
        id: recordingTranscription.id,
      },
    });

    expect(existingRecordings.length).toBe(0);
  });
});
