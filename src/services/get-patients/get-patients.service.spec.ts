import { Test, TestingModule } from '@nestjs/testing';
import { GetPatientsService } from './get-patients.service';
import { PrismaService } from '../prisma-service/prisma-service';
import { Patient } from '@prisma/client';

describe('GetPatientsService', () => {
  let service: GetPatientsService;
  let prisma: PrismaService;

  let patient: Patient;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GetPatientsService, PrismaService],
    }).compile();

    service = module.get<GetPatientsService>(GetPatientsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  beforeEach(async () => {
    patient = await prisma.patient.create({
      data: {
        name: 'John Doe',
        notes: {
          createMany: { data: [{ text: 'Note 1' }, { text: 'note 2' }] },
        },
      },
    });
  });

  afterEach(async () => {
    await prisma.patientNote.deleteMany({});
    await prisma.patient.deleteMany({});
  });

  describe('Name filter', () => {
    it.each([[undefined], [null], [' '], ['  ']])(
      'should find patient with no filter: %s',
      async (name) => {
        const existingPatients = await service.get({ name });

        expect(existingPatients.length).toBe(1);
        expect(existingPatients[0].id).toBe(patient.id);
      },
    );

    it.each([
      ['John Doe'],
      ['john doe'],
      ['John'],
      ['John '],
      ['John  '],
      ['john'],
      ['Doe'],
      [' Doe'],
      ['  Doe'],
    ])('should find patient by name filter: %s', async (name) => {
      const existingPatients = await service.get({
        name,
      });

      expect(existingPatients.length).toBe(1);
      expect(existingPatients[0].id).toBe(patient.id);
    });

    it.each([['jon'], ['deo']])(
      'should not find patient by name filter: %s',
      async (name) => {
        const existingPatients = await service.get({
          name,
        });

        expect(existingPatients.length).toBe(0);
      },
    );
  });

  describe('notes filter', () => {
    it.each([[undefined], [null], [' '], ['  ']])(
      'should find patient with no note filter: %s',
      async (note) => {
        const existingPatients = await service.get({ note });

        expect(existingPatients.length).toBe(1);
        expect(existingPatients[0].id).toBe(patient.id);
      },
    );

    it.each([['Note 1'], ['note 1'], ['note'], ['Note 2'], ['note 2']])(
      'should find patient by note filter: %s',
      async (note) => {
        const existingPatients = await service.get({
          note,
        });

        expect(existingPatients.length).toBe(1);
        expect(existingPatients[0].id).toBe(patient.id);
      },
    );
  });

  describe('multual filter use', () => {
    it('should find patient if both filters match', async () => {
      const existingPatients = await service.get({
        name: 'john',
        note: 'note',
      });

      expect(existingPatients.length).toBe(1);
      expect(existingPatients[0].id).toBe(patient.id);
    });

    it('should not find if some filter wont match', async () => {
      const existingPatients = await service.get({
        name: 'john',
        note: 'doe',
      });

      expect(existingPatients.length).toBe(0);
    });
  });
});
