import { Module } from '@nestjs/common';
import { AppointmentsServiceService } from './appointments-service/appointments-service.service';
import { AppointmentsCrudService } from './appointments-crud/appointments-crud.service';
import { CreateAppointmentService } from './create-appointment/create-appointment.service';
import { DeleteAppointmentService } from './delete-appointment/delete-appointment.service';

@Module({
  imports: [],
  controllers: [],
  providers: [AppointmentsServiceService, AppointmentsCrudService, CreateAppointmentService, DeleteAppointmentService],
})
export class AppModule {}
