import { Test, TestingModule } from '@nestjs/testing';
import { UpdatePatientNotesService } from './update-patient-notes.service';
import { PrismaService } from '../prisma-service/prisma-service';
import { Patient } from '@prisma/client';

describe('UpdatePatientNotesService', () => {
  let service: UpdatePatientNotesService;
  let prisma: PrismaService;
  let patient: Patient;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UpdatePatientNotesService, PrismaService],
    }).compile();

    service = module.get<UpdatePatientNotesService>(UpdatePatientNotesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  beforeEach(async () => {
    patient = await prisma.patient.create({
      data: { name: 'patient name' },
    });
  });

  afterEach(async () => {
    await prisma.patientNote.deleteMany({});
    await prisma.patient.deleteMany({});
  });

  it('should create notes on patient', async () => {
    const UpdateedPatient = await service.update({
      patientId: patient.id,
      notes: ['note 1', 'note 2'],
    });

    expect(UpdateedPatient.notes.length).toBe(2);
    expect(UpdateedPatient.notes).toContainEqual({
      id: expect.anything(),
      text: 'note 1',
      patientId: patient.id,
    });
    expect(UpdateedPatient.notes).toContainEqual({
      id: expect.anything(),
      text: 'note 2',
      patientId: patient.id,
    });
  });
});
