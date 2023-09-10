import { Transcription } from '../../common-interfaces/transcription';

export interface CreateTranscriptionEditionPayload extends Transcription {
  transcriptionId: string;
  patientId: string;
}
