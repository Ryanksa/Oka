import React, { FC, useState, useEffect } from "react";
import styles from "../styles/Settings.module.scss";

import { updateAssistant, updateAssistantImage } from "../firebase";

import {
  assistantStore,
  addAssistantStoreListener,
  removeAssistantStoreListener,
} from "../stores";

import Image from "next/image";
import { AlertColor } from "@mui/material/Alert";
import { MdOutlineCheck, MdClear } from "react-icons/md";
import { FiEdit2, FiHelpCircle } from "react-icons/fi";
import { BsPersonFill } from "react-icons/bs";

import { Assistant, AssistantWithUrl } from "../models/assistant";

type Props = {
  openSnackbar: (msg: string, severity: AlertColor) => void;
};

const AssistantSetting: FC<Props> = ({ openSnackbar }) => {
  const [assistant, setAssistant] = useState<AssistantWithUrl>(
    assistantStore.assistant
  );

  const [editingName, setEditingName] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const callback = () => {
      setAssistant(assistantStore.assistant);
    };
    addAssistantStoreListener(callback);
    return () => removeAssistantStoreListener(callback);
  }, []);

  const updateAssistantWrapper = (
    assistant: Assistant,
    callback: () => void
  ) => {
    const promise = updateAssistant(assistant);
    if (promise) {
      promise
        .then(() => {
          callback();
        })
        .catch(() => {
          openSnackbar("Failed to update assistant", "error");
        });
    }
  };

  const updateAssistantImageWrapper = (file: File | null) => {
    setIsUploading(true);
    const promise = updateAssistantImage(file);
    if (!promise) {
      openSnackbar("Please sign in first to customize your assistant", "info");
      setIsUploading(false);
      return;
    }
    promise
      .then((fileName) => {
        updateAssistantWrapper(
          {
            ...assistant,
            avatar: fileName,
          },
          () => {
            openSnackbar("Successfully updated assistant", "success");
          }
        );
      })
      .catch(() => {
        openSnackbar("Failed to update assistant", "error");
      })
      .finally(() => {
        setIsUploading(false);
      });
  };

  const handleStartEditingName = () => {
    setEditingName(assistant.name);
    setIsEditingName(true);
  };

  const handleFinishEditingName = () => {
    updateAssistantWrapper(
      {
        ...assistant,
        name: editingName,
      },
      () => {
        setAssistant((prev) => ({
          ...prev,
          name: editingName,
        }));
      }
    );
    setIsEditingName(false);
  };

  const handleCancelEditingName = () => {
    setIsEditingName(false);
  };

  const handleVoiceCommandToggle = () => {
    updateAssistantWrapper(
      {
        ...assistant,
        voiceCommand: !assistant.voiceCommand,
      },
      () => {}
    );
  };

  const handleChooseFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      updateAssistantImageWrapper(files[0]);
    }
  };

  const handleClearFile = () => {
    updateAssistantImageWrapper(null);
  };

  const Tooltip = () => (
    <div className={`${styles.tooltip}`}>
      <h4>
        Enable voice commands and allow microphone use on Chrome. Then try
        saying the following:
      </h4>
      <ul>
        <li>What&apos;s on the news?</li>
        <li>How&apos;s the weather?</li>
        <li>Take me to home.</li>
        <li>Google Javascript.</li>
      </ul>
    </div>
  );

  return (
    <div className={styles.assistantSetting}>
      <div className={styles.avatar}>
        {assistant.avatarUrl !== "" ? (
          <Image src={assistant.avatarUrl} alt="" layout="fill" />
        ) : (
          <BsPersonFill style={{ width: "100%", height: "100%" }} />
        )}
        <div className={styles.avatarOverlay}>
          {isUploading ? (
            <div className="loading" />
          ) : (
            <>
              <label htmlFor="avatar-upload">Upload an image</label>
              <label htmlFor="avatar-clear" onClick={handleClearFile}>
                Clear image
              </label>
              <input
                type="file"
                accept="image/*"
                id="avatar-upload"
                name="avatar-upload"
                onChange={handleChooseFile}
              />
            </>
          )}
        </div>
      </div>

      <div className={styles.name}>
        <header className={styles.settingLabel}>Name</header>
        <div className={styles.nameInput}>
          {isEditingName ? (
            <>
              <input
                className="text-field"
                autoFocus
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
              />
              <div className="icon-button" onClick={handleFinishEditingName}>
                <MdOutlineCheck />
              </div>
              <div className="icon-button" onClick={handleCancelEditingName}>
                <MdClear />
              </div>
            </>
          ) : (
            <>
              {assistant.name}
              <div className="icon-button" onClick={handleStartEditingName}>
                <FiEdit2 />
              </div>
            </>
          )}
        </div>
      </div>

      <div className={styles.voiceCommand}>
        <header className={styles.settingLabel}>
          Voice Commands
          <div className={styles.tooltipContainer}>
            <FiHelpCircle fontSize={20} />
            <Tooltip />
          </div>
        </header>
        <div className={styles.toggleContainer}>
          <span>Off</span>
          <div
            className={"toggle " + (assistant.voiceCommand ? "on" : "off")}
            onClick={handleVoiceCommandToggle}
          />
          <span>On</span>
        </div>
      </div>
    </div>
  );
};

export default AssistantSetting;
