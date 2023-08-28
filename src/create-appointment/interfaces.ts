import { AppointmentStatus } from '@prisma/client';

export interface CreateAppointmentPayload {
  patientId: string;

  date: Date;
  duration: number;
  status: AppointmentStatus;

  notes: string[];
}
