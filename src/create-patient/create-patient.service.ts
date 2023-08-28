import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma-service/prisma-service';
import { CreatePatientPayload } from './interfaces';

@Injectable()
export class CreatePatientService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreatePatientPayload) {
    return this.prisma.patient.create({ data });
  }
}
