import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma-service/prisma-service';
import { CreateTranscriptionEditionPayload } from './interfaces';

@Injectable()
export class CreateTranscriptionEditionService {
  constructor(private prisma: PrismaService) {}

  async create({
    transcriptionId,
    patientId,

    date,
    duration,
    description,

    speeches,
  }: CreateTranscriptionEditionPayload) {
    return await this.prisma.$transaction(async (transaction) => {
      const newTranscription = await transaction.recordingTranscription.create({
        data: {
          date,
          description,
          duration,

          speeches: { createMany: { data: speeches } },
          patientId,
        },
      });

      return await transaction.transcriptionEdition.create({
        data: {
          originalTranscriptionId: transcriptionId,
          editionTranscriptionId: newTranscription.id,
        },

        include: {
          original: true,
          edition: true,
        },
      });
    });
  }
}
