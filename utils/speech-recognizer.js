// Rough implementation of speech-recognizer using SpeechRecognition (https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition)
// Main issue is the lack of support on various browsers
// Look into using this wrapper: https://github.com/JamesBrill/react-speech-recognition

const MAX_ARGS = 10;

let recognition = null;
let restart = false;
let commands = []; // { prompt: string, callback: (...args: string[]) => void }[]

try {
  // setup speech recognition settings
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
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
    if (event.results && event.results[0]) {
      const results = Object.values(event.results[0]);
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

const matchCommand = (text, command) => {
  const lowerCased = text.toLowerCase();
  const commandPromptRegex = new RegExp(
    command.prompt.toLowerCase().replace("*", "(.*)")
  );

  const result = commandPromptRegex.exec(lowerCased);
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

const addCommand = (command) => {
  commands.push(command);
};

const clearCommands = () => {
  commands = [];
};

const startRecognizer = () => {
  try {
    recognition.start();
  } catch {}
};

const stopRecognizer = () => {
  try {
    recognition.stop();
  } catch {}
};

const enableRestart = () => {
  restart = true;
};

const disableRestart = () => {
  restart = false;
};

export {
  recognition,
  addCommand,
  clearCommands,
  startRecognizer,
  stopRecognizer,
  enableRestart,
  disableRestart,
};
