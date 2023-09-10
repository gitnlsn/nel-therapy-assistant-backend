import { SpeechMark } from '@prisma/client';

export interface Speech {
  date: Date;
  text: string;

  marks?: SpeechMark[];
  notes?: string[];
}
