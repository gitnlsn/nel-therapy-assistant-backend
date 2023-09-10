import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma-service/prisma-service';
import { UpdateTranscriptionEditionPayload } from './interfaces';

@Injectable()
export class UpdateTranscriptionEditionService {
  constructor(private prisma: PrismaService) {}

  async update({
    transcriptionId,
    patientId,

    date,
    duration,
    description,

    speeches,
  }: UpdateTranscriptionEditionPayload) {
    return await this.prisma.$transaction(async (transaction) => {
      await transaction.transcriptionSpeech.deleteMany({
        where: {
          recordingTranscriptionId: transcriptionId,
        },
      });

      return await transaction.recordingTranscription.update({
        data: {
          date,
          duration,
          description,

          speeches: { createMany: { data: speeches } },
        },

        where: {
          id: transcriptionId,
          patientId,

          // This condition should limit updates to transcription editions
          editionRef: { some: { editionTranscriptionId: transcriptionId } },
        },

        include: {
          speeches: true,
        },
      });
    });
  }
}
