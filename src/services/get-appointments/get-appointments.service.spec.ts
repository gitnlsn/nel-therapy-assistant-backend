import { Test, TestingModule } from '@nestjs/testing';
import { GetAppointmentsService } from './get-appointments.service';
import { PrismaService } from '../prisma-service/prisma-service';
import { Appointment, Patient } from '@prisma/client';

describe('GetAppointmentsService', () => {
  let service: GetAppointmentsService;
  let prisma: PrismaService;

  let patient: Patient;
  let appointments: Appointment[];

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GetAppointmentsService, PrismaService],
    }).compile();

    service = module.get<GetAppointmentsService>(GetAppointmentsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  beforeEach(async () => {
    patient = await prisma.patient.create({
      data: {
        name: 'patient name',
      },
    });

    appointments = await Promise.all([
      prisma.appointment.create({
        data: {
          patientId: patient.id,
          date: new Date(2023, 5, 15, 14),
          duration: 3600,
          status: 'scheduled',
          appointmentNotes: { create: { text: 'first note' } },
        },
      }),
      prisma.appointment.create({
        data: {
          patientId: patient.id,
          date: new Date(2023, 5, 15, 15),
          duration: 3600,
          status: 'scheduled',
          appointmentNotes: { create: { text: 'second note' } },
        },
      }),
    ]);
  });

  afterEach(async () => {
    await prisma.appointmentNote.deleteMany({});
    await prisma.appointment.deleteMany({});
    await prisma.patient.deleteMany({});
  });

  it('should find all appointments', async () => {
    const existingAppointments = await service.get({ patientId: patient.id });

    expect(existingAppointments.length).toBe(2);
  });

  it('should filter by patientId', async () => {
    const existingAppointments = await service.get({ patientId: 'string' });

    expect(existingAppointments.length).toBe(0);
  });

  it('should filter by note', async () => {
    const existingAppointments = await service.get({
      patientId: patient.id,
      note: 'first',
    });

    expect(existingAppointments.length).toBe(1);
  });
});
