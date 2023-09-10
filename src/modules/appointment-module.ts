import { Module } from '@nestjs/common';
import { CreateAppointmentService } from '../services/create-appointment/create-appointment.service';
import { PrismaService } from '../services/prisma-service/prisma-service';
import { UpdateAppointmentService } from '../services/update-appointment/update-appointment.service';
import { GetAppointmentsService } from '../services/get-appointments/get-appointments.service';

@Module({
  imports: [],
  controllers: [],
  providers: [
    GetAppointmentsService,
    CreateAppointmentService,
    UpdateAppointmentService,
    PrismaService,
  ],
})
export class AppointmentModule {}
