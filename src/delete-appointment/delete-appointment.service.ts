import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma-service/prisma-service';
import { DeleteAppointmentPayload } from './interfaces';

@Injectable()
export class DeleteAppointmentService {
  constructor(private prisma: PrismaService) {}

  async delete(payload: DeleteAppointmentPayload) {
    return await this.prisma.appointment.delete({
      where: { id: payload.appointmentId },
    });
  }
}
