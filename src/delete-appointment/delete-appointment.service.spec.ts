import { Test, TestingModule } from '@nestjs/testing';
import { DeleteAppointmentService } from './delete-appointment.service';
import { PrismaService } from '../prisma-service/prisma-service';
import { Appointment, Patient } from '@prisma/client';

describe('DeleteAppointmentService', () => {
  let service: DeleteAppointmentService;
  let prisma: PrismaService;

  let patient: Patient;
  let appointment: Appointment;

  beforeAll(async () => {
    prisma = new PrismaService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [DeleteAppointmentService, PrismaService],
    }).compile();

    service = module.get<DeleteAppointmentService>(DeleteAppointmentService);
  });

  afterEach(async () => {
    await prisma.appointment.deleteMany();
    await prisma.patient.deleteMany();
  });

  beforeEach(async () => {
    patient = await prisma.patient.create({
      data: { name: 'patient name' },
    });

    appointment = await prisma.appointment.create({
      data: {
        patientId: patient.id,
        date: new Date(2023, 6, 15, 14, 30),
        duration: 3000,
        status: 'done',
      },
    });
  });

  it('should delete appointment', async () => {
    const deletedAppointment = await service.delete({
      appointmentId: appointment.id,
    });

    expect(deletedAppointment.id).toBe(appointment.id);

    const existingAppointments = await prisma.appointment.findMany();
    expect(existingAppointments.length).toBe(0);
  });
});
