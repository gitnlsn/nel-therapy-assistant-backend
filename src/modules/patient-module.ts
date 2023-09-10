import { Module } from '@nestjs/common';
import { CreatePatientService } from '../services/create-patient/create-patient.service';
import { PrismaService } from '../services/prisma-service/prisma-service';
import { UpdatePatientNotesService } from '../services/update-patient-notes/update-patient-notes.service';
import { GetPatientsService } from '../services/get-patients/get-patients.service';

@Module({
  imports: [],
  controllers: [],
  providers: [
    GetPatientsService,
    CreatePatientService,
    UpdatePatientNotesService,
    PrismaService,
  ],
})
export class PatientModule {}
