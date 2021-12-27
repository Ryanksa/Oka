import React, { useContext, useState, useEffect } from "react";
import styles from "../styles/Assistant.module.scss";

import {
  AssistantContext,
  addAssistantContextListener,
  removeAssistantContextListener,
} from "../contexts";
import { AssistantWithUrl } from "../models/assistant";
import defaultAssistant from "../assets/default-assistant.svg";

import Image from "next/image";

import * as SpeechRecognizer from "../utils/speech-recognizer";

const Assistant = () => {
  const assistantContext = useContext(AssistantContext);
  const [assistant, setAssistant] = useState<AssistantWithUrl>({
    name: assistantContext.name,
    voiceCommand: assistantContext.voiceCommand,
    avatar: assistantContext.avatar,
    avatarUrl: assistantContext.avatarUrl,
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const callback = () => {
      setAssistant({
        name: assistantContext.name,
        voiceCommand: assistantContext.voiceCommand,
        avatar: assistantContext.avatar,
        avatarUrl: assistantContext.avatarUrl,
      });
      onVoiceCommandToggle();
    };
    addAssistantContextListener(callback);
    return () => removeAssistantContextListener(callback);
  }, []);

  const onVoiceCommandToggle = () => {
    if (assistantContext.voiceCommand) {
      SpeechRecognizer.addCommand({
        prompt: "google *",
        callback: (query: string) => {
          showMessage(`Googling "${query}"`);
          window.open("https://www.google.com/search?q=" + query);
        },
      });
      SpeechRecognizer.startRecognizer();
      return () => SpeechRecognizer.stopRecognizer();
    } else {
      SpeechRecognizer.stopRecognizer();
    }
  };

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage("");
    }, 5000);
  };

  return (
    <div
      className={`${styles.wrapper} ${
        message === "" ? styles.hide : styles.show
      }`}
    >
      {message !== "" && (
        <div className={styles.assistantTextBox}>{message}</div>
      )}
      <div className={styles.assistantContainer}>
        <Image
          src={
            assistant.avatarUrl !== "" ? assistant.avatarUrl : defaultAssistant
          }
          alt=""
          layout="fill"
        />
      </div>
    </div>
  );
};

export default Assistant;
