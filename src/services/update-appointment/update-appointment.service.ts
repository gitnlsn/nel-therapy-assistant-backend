import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma-service/prisma-service';
import { UpdateAppointmentPayload } from './interfaces';

@Injectable()
export class UpdateAppointmentService {
  constructor(private prisma: PrismaService) {}

  async update({
    appointmentId,
    date,
    duration,
    status,
    notes,
  }: UpdateAppointmentPayload) {
    return await this.prisma.$transaction(async (transaction) => {
      await transaction.appointmentNote.deleteMany({
        where: {
          appointmentId,
        },
      });

      return await transaction.appointment.update({
        data: {
          date,
          duration,
          status,
          appointmentNotes: {
            createMany: { data: notes.map((note) => ({ text: note })) },
          },
        },
        where: { id: appointmentId },
        include: { appointmentNotes: true },
      });
    });
  }
}
