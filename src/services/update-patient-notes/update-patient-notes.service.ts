import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma-service/prisma-service';
import { UpdatePatientNotesPayload } from './interfaces';

@Injectable()
export class UpdatePatientNotesService {
  constructor(private prisma: PrismaService) {}

  async update({ patientId, notes }: UpdatePatientNotesPayload) {
    return await this.prisma.$transaction(async (transaction) => {
      await transaction.patientNote.deleteMany({
        where: { patientId },
      });

      await transaction.patientNote.createMany({
        data: notes.map((note) => ({
          patientId,
          text: note,
        })),
      });

      return transaction.patient.findFirst({
        where: { id: patientId },
        include: {
          notes: true,
        },
      });
    });
  }
}
