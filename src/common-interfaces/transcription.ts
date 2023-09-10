import { Speech } from './speech';

export interface Transcription {
  date: Date;
  duration: number;
  description: string;

  speeches: Speech[];
}
