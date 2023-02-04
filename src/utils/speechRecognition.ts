import {
  SpeechRecognition,
  SpeechRecognitionResult,
  Command,
} from "../models/speechRecognition";

const MAX_ARGS = 10;

let recognition: SpeechRecognition;
let restart = false;
let commands: Command[] = [];

try {
  // setup speech recognition settings
  const SpeechRecognition =
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition;
  recognition = new SpeechRecognition() as SpeechRecognition;
  recognition.maxAlternatives = 5;
  recognition.continuos = true;
  recognition.interimResults = false;
  recognition.lang = "en-US";

  // restart speech recognition after parsing one
  recognition.onend = () => {
    if (restart) {
      startRecognizer();
    }
  };

  // parses a speech recognition result based on added commands
  recognition.onresult = (event) => {
    if (event.results.length > 0) {
      const results: SpeechRecognitionResult[] = Object.values(
        event.results[0]
      );
      for (const result of results) {
        for (let i = 0; i < commands.length; i++) {
          if (matchCommand(result.transcript, commands[i])) {
            return;
          }
        }
      }
    }
  };
} catch {
  // browser doesn't support SpeechRecognition
}

const matchCommand = (text: string, command: Command) => {
  const result = command.prompt.exec(text.toLowerCase());
  if (!result) return false;

  const args = [];
  for (let i = 1; i <= MAX_ARGS; i++) {
    if (result[i]) {
      args.push(result[i]);
    }
  }
  command.callback(...args);
  return true;
};

const addCommand = (command: Command) => {
  commands.push(command);
};

const clearCommands = () => {
  commands = [];
};

const startRecognizer = () => {
  try {
    recognition?.start();
  } catch {}
};

const stopRecognizer = () => {
  try {
    recognition?.stop();
  } catch {}
};

const enableRestart = () => {
  restart = true;
};

const disableRestart = () => {
  restart = false;
};

export {
  addCommand,
  clearCommands,
  startRecognizer,
  stopRecognizer,
  enableRestart,
  disableRestart,
};
