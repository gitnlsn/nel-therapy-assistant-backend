import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma-service/prisma-service';
import { GetAppointmentsFilter } from './interfaces';

@Injectable()
export class GetAppointmentsService {
  constructor(private prisma: PrismaService) {}

  async get({ patientId, note }: GetAppointmentsFilter) {
    return await this.prisma.appointment.findMany({
      where: {
        patientId,
        appointmentNotes: {
          some: {
            text: {
              contains: note ? note.trim() : undefined,
              mode: 'insensitive',
            },
          },
        },
      }, 

      include: {
        appointmentNotes: true,
      },
    });
  }
}
