// SpeechRecognition from Web Speech API
// https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition
export type SpeechRecognition = {
  maxAlternatives: number;
  continuos: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onend: () => void;
};

export type SpeechRecognitionEvent = {
  results: SpeechRecognitionResult[][];
};

export type SpeechRecognitionResult = {
  transcript: string;
};

export type Command = {
  prompt: RegExp;
  callback: (...args: string[]) => void;
};
