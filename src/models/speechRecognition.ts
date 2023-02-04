// SpeechRecognition from Web Speech API
// https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition
export interface SpeechRecognition {
  maxAlternatives: number;
  continuos: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onend: () => void;
}

export interface SpeechRecognitionEvent {
  results: SpeechRecognitionResult[];
}

export interface SpeechRecognitionResult {
  transcript: string;
}

export interface Command {
  prompt: RegExp;
  callback: (...args: string[]) => void;
}
