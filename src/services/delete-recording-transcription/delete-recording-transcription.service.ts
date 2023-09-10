import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma-service/prisma-service';
import { DeleteRecordingTranscriptionPayload } from './interfaces';

@Injectable()
export class DeleteRecordingTranscriptionService {
  constructor(private prisma: PrismaService) {}

  async delete({ transcriptionId }: DeleteRecordingTranscriptionPayload) {
    return await this.prisma.recordingTranscription.delete({
      where: {
        id: transcriptionId,
      },
    });
  }
}
