import { Transcription } from '../../common-interfaces/transcription';

export interface UpdateTranscriptionEditionPayload extends Transcription {
  transcriptionId: string;
  patientId: string;
}
