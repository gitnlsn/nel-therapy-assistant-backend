import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma-service/prisma-service';
import { CreateAppointmentPayload } from './interfaces';

@Injectable()
export class CreateAppointmentService {
  constructor(private prisma: PrismaService) {}

  async create(payload: CreateAppointmentPayload) {
    return await this.prisma.appointment.create({
      data: {
        patientId: payload.patientId,

        date: payload.date,
        duration: payload.duration,
        status: payload.status,

        appointmentNotes: {
          createMany: {
            data: payload.notes.map((note) => ({ text: note })),
          },
        },
      },
      include: { patient: true, appointmentNotes: true },
    });
  }
}
