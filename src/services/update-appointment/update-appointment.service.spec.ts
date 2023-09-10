import { Test, TestingModule } from '@nestjs/testing';
import { UpdateAppointmentService } from './update-appointment.service';
import { PrismaService } from '../prisma-service/prisma-service';
import { Appointment, AppointmentStatus, Patient } from '@prisma/client';

describe('UpdateAppointmentService', () => {
  let service: UpdateAppointmentService;
  let prisma: PrismaService;

  let patient: Patient;
  let appointment: Appointment;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UpdateAppointmentService, PrismaService],
    }).compile();

    service = module.get<UpdateAppointmentService>(UpdateAppointmentService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  beforeEach(async () => {
    patient = await prisma.patient.create({
      data: { name: 'patient name' },
    });

    appointment = await prisma.appointment.create({
      data: {
        patientId: patient.id,
        date: new Date(2023, 5, 15, 14),
        duration: 1800,
        status: 'done',
      },
    });
  });

  afterEach(async () => {
    await prisma.appointmentNote.deleteMany({});
    await prisma.appointment.deleteMany({});
    await prisma.patient.deleteMany({});
  });

  it('should update appointment', async () => {
    const updatePayload = {
      date: new Date(2023, 7, 15, 14),
      duration: 3600,
      status: 'scheduled' as AppointmentStatus,
      notes: ['note 1', 'note 2'],
    };

    const updatedAppointment = await service.update({
      appointmentId: appointment.id,
      ...updatePayload,
    });

    expect(updatedAppointment.date).toEqual(updatePayload.date);
    expect(updatedAppointment.duration).toEqual(updatePayload.duration);
    expect(updatedAppointment.status).toEqual(updatePayload.status);
    expect(updatedAppointment.appointmentNotes.length).toBe(2);
  });
});
