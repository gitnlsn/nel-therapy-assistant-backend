import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma-service/prisma-service';
import { GetPatientFilters } from './interfaces';

@Injectable()
export class GetPatientsService {
  constructor(private prisma: PrismaService) {}

  async get({ name, note }: GetPatientFilters) {
    return await this.prisma.patient.findMany({
      where: {
        name: {
          contains: name ? name.trim() : undefined,
          mode: 'insensitive',
        },
        notes: {
          some: {
            text: {
              contains: note ? note.trim() : undefined,
              mode: 'insensitive',
            },
          },
        },
      },

      include: {
        notes: true,
      },

      take: 10,
    });
  }
}
