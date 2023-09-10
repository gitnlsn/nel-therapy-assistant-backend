import { AppointmentStatus } from '@prisma/client';

export interface UpdateAppointmentPayload {
  appointmentId: string;

  date: Date;
  duration: number;
  status: AppointmentStatus;

  notes: string[];
}
