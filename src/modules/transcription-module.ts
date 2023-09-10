import { Module } from '@nestjs/common';
import { CreateRecordingTranscriptionService } from 'src/services/create-recording-transcription/create-recording-transcription.service';
import { CreateTranscriptionEditionService } from 'src/services/create-transcription-edition/create-transcription-edition.service';
import { DeleteRecordingTranscriptionService } from 'src/services/delete-recording-transcription/delete-recording-transcription.service';
import { UpdateSpeechService } from 'src/services/update-speech/update-speech.service';
import { UpdateTranscriptionEditionService } from 'src/services/update-transcription-edition/update-transcription-edition.service';

@Module({
  imports: [
    CreateRecordingTranscriptionService,
    CreateTranscriptionEditionService,
    DeleteRecordingTranscriptionService,
    UpdateTranscriptionEditionService,
    UpdateSpeechService,
  ],
  controllers: [],
  providers: [],
})
export class TranscriptionModule {}
