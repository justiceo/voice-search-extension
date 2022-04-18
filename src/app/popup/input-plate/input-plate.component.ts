import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { LocaleService } from 'src/app/services/locale.service';
import {
  DefaultLocale,
  LocaleProperties,
  LocalesForDefaultModel,
} from '../../model/locale-properties';
import { State } from '../../model/recognition-state';
import { RecognitionService } from '../../services/recognition.service';

@Component({
  selector: 'audate-input-plate',
  templateUrl: './input-plate.component.html',
  styleUrls: ['./input-plate.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputPlateComponent implements OnInit {
  locales: LocaleProperties[] = LocalesForDefaultModel;
  currentLocale: LocaleProperties = DefaultLocale;

  listening = false;

  constructor(
    private speechRecognizer: RecognitionService,
    private ref: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    let count = 1;
    this.speechRecognizer.getRecognitionState().subscribe((rstate) => {
      console.log('#event ', count++, rstate.state);
      switch (rstate.state) {
        case State.UNKNOWN:
        case State.NOT_SUPPORTED:
        case State.PERMISSION_NOT_GRANTED:
        case State.NO_AUDIO_INPUT_DEVICE:
        case State.NO_CONNECTION:
        case State.NO_SPEECH_DETECTED:
        case State.IDLE:
        case State.ABORTED:
        case State.END:
          this.listening = false;
          break;
        case State.START:
        case State.TRANSCRIBING:
          this.listening = true;
          break;
      }
      this.ref.detectChanges();
    });
  }

  micTap(): void {
    if (this.listening) {
      this.speechRecognizer.stop();
    } else {
      this.speechRecognizer.start(false);
    }
  }

  setLocale(locale: LocaleProperties): void {
    console.log('Set locale: ', locale);
    LocaleService.setRecognitionLocale(locale);
    this.currentLocale = locale;
  }
}
