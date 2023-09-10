import { Test, TestingModule } from '@nestjs/testing';
import { CreatePatientService } from './create-patient.service';
import { PrismaService } from '../prisma-service/prisma-service';

describe('CreatePatientService', () => {
  let service: CreatePatientService;
  let prismaService: PrismaService;

  beforeAll(() => {
    prismaService = new PrismaService();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreatePatientService, PrismaService],
    }).compile();

    service = module.get<CreatePatientService>(CreatePatientService);
  });

  afterEach(async () => {
    await prismaService.patient.deleteMany();
  });

  it('should create patient in database', async () => {
    const createdPatient = await service.create({
      name: 'patient name',
      notes: [],
    });

    const existingPatients = await prismaService.patient.findMany();

    expect(existingPatients.length).toBe(1);
    expect(existingPatients[0].id).toBe(createdPatient.id);
    expect(existingPatients[0].name).toBe(createdPatient.name);
  });

  it('should create patient with notes in database', async () => {
    const createdPatient = await service.create({
      name: 'patient name',
      notes: ['note 1'],
    });

    const existingPatients = await prismaService.patient.findMany({
      include: { notes: true },
    });

    expect(existingPatients.length).toBe(1);
    expect(existingPatients[0].notes.length).toBe(1);
    expect(existingPatients[0].notes[0].text).toBe('note 1');
  });
});
