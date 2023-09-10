import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma-service/prisma-service';
import { UpdateSpeechPayload } from './interfaces';

@Injectable()
export class UpdateSpeechService {
  constructor(private prisma: PrismaService) {}

  async udpate({
    speechId,

    text,

    marks,
    notes,
  }: UpdateSpeechPayload) {
    return await this.prisma.$transaction(async (transaction) => {
      await transaction.speechNote.deleteMany({
        where: {
          transcriptionSpeechId: speechId,
        },
      });

      return await transaction.transcriptionSpeech.update({
        data: {
          text,
          marks,
          notes: {
            createMany: { data: notes.map((note) => ({ text: note })) },
          },
        },

        where: {
          id: speechId,

          // The following condition should limit updates to edition transcriptions
          transcription: {
            editionRef: { some: { editionTranscriptionId: { notIn: [''] } } },
          },
        },

        include: {
          notes: true,
        },
      });
    });
  }
}
