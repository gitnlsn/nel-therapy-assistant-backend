import { Test, TestingModule } from '@nestjs/testing';
import { CreateAppointmentService } from './create-appointment.service';
import { PrismaService } from '../prisma-service/prisma-service';
import { Patient } from '@prisma/client';
import { CreateAppointmentPayload } from './interfaces';

describe('CreateAppointmentService', () => {
  let service: CreateAppointmentService;
  let prisma: PrismaService;

  let patient: Patient;

  beforeAll(async () => {
    prisma = new PrismaService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [CreateAppointmentService, PrismaService],
    }).compile();

    service = module.get<CreateAppointmentService>(CreateAppointmentService);
  });

  beforeEach(async () => {
    patient = await prisma.patient.create({
      data: { name: 'patient name' },
    });
  });

  afterEach(async () => {
    await prisma.appointment.deleteMany({});
    await prisma.patient.deleteMany({});
  });

  it('should create appointment', async () => {
    const payload: CreateAppointmentPayload = {
      patientId: patient.id,

      date: new Date(2023, 6, 15, 14, 30),
      duration: 3000,
      notes: ['note 1', 'note 2'],
      status: 'done',
    };

    const createdAppointment = await service.create(payload);

    expect(createdAppointment.date).toEqual(payload.date);
    expect(createdAppointment.duration).toEqual(payload.duration);
    expect(createdAppointment.status).toEqual(payload.status);
    expect(createdAppointment.appointmentNotes.length).toEqual(
      payload.notes.length,
    );
    expect(
      createdAppointment.appointmentNotes.map((note) => note.text),
    ).toEqual(payload.notes);
  });
});
