import { Transcription } from '../../common-interfaces/transcription';

export interface CreateRecordingTranscriptionPayload extends Transcription {
  patientId: string;
}
