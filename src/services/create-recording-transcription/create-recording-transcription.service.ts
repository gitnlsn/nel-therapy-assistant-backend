import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma-service/prisma-service';
import { CreateRecordingTranscriptionPayload } from './interfaces';

@Injectable()
export class CreateRecordingTranscriptionService {
  constructor(private prisma: PrismaService) {}

  async create({
    patientId,

    date,
    description,
    duration,

    speeches,
  }: CreateRecordingTranscriptionPayload) {
    return await this.prisma.recordingTranscription.create({
      data: {
        patientId,

        date,
        description,
        duration,
        speeches: { createMany: { data: speeches } },
      },

      include: {
        speeches: true,
      },
    });
  }
}
