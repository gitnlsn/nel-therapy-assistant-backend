import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma-service/prisma-service';
import { CreatePatientPayload } from './interfaces';

@Injectable()
export class CreatePatientService {
  constructor(private prisma: PrismaService) {}

  async create({ name, notes }: CreatePatientPayload) {
    return await this.prisma.patient.create({
      data: {
        name,
        notes: {
          createMany: { data: notes.map((note) => ({ text: note })) },
        },
      },

      include: {
        notes: true,
      },
    });
  }
}
