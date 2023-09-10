import { SpeechMark } from "@prisma/client";

export interface UpdateSpeechPayload {
  speechId: string;

  text: string;

  marks: SpeechMark[]
  notes: string[]
}
