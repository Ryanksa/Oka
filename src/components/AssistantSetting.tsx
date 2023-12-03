import { useEffect, ChangeEvent } from "react";
import styles from "../styles/AssistantSetting.module.scss";
import { updateAssistant, updateAssistantImage } from "../firebase";
import Image from "next/image";
import IconButton from "./IconButton";
import Toggle from "./Toggle";
import TextField from "./TextField";
import Loading from "./Loading";
import { MdOutlineCheck, MdClear } from "react-icons/md";
import { FiEdit2, FiHelpCircle } from "react-icons/fi";
import { BsPersonFill } from "react-icons/bs";
import { Assistant, AssistantWithUrl } from "../models/assistant";
import { useSignal } from "@preact/signals-react";

type Props = {
  assistant: AssistantWithUrl;
  openSnackbar: (msg: string) => void;
};

const AssistantSetting = ({ assistant, openSnackbar }: Props) => {
  // Using an extra state to cache the assistant name to prevent flicker when updating
  const cachedName = useSignal(assistant.name);
  const editingName = useSignal("");
  const isEditingName = useSignal(false);
  const isUploading = useSignal(false);

  useEffect(() => {
    cachedName.value = assistant.name;
  }, [assistant.name]);

  const updateAssistantHandler = async (
    assistant: Assistant,
    callback: () => void
  ) => {
    try {
      await updateAssistant(assistant);
      callback();
    } catch {
      openSnackbar("Failed to update assistant");
    }
  };

  const updateAssistantImageHandler = async (file: File | null) => {
    try {
      isUploading.value = true;
      const updatePromise = updateAssistantImage(file);
      if (!updatePromise) {
        openSnackbar("Please sign in first to customize your assistant");
        isUploading.value = false;
        return;
      }
      const fileName = await updatePromise;
      updateAssistantHandler(
        {
          ...assistant,
          avatar: fileName,
        },
        () => {
          openSnackbar("Successfully updated assistant");
        }
      );
    } catch {
      openSnackbar("Failed to update assistant");
    } finally {
      isUploading.value = false;
    }
  };

  const handleStartEditingName = () => {
    editingName.value = assistant.name;
    isEditingName.value = true;
  };

  const handleFinishEditingName = () => {
    const newAssistant = {
      ...assistant,
      name: editingName.value,
    };
    updateAssistantHandler(newAssistant, () => {});
    cachedName.value = editingName.value;
    isEditingName.value = false;
  };

  const handleCancelEditingName = () => {
    isEditingName.value = false;
  };

  const handleVoiceCommandToggle = () => {
    const newAssistant = {
      ...assistant,
      voiceCommand: !assistant.voiceCommand,
    };
    updateAssistantHandler(newAssistant, () => {});
  };

  const handleChooseFile = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      updateAssistantImageHandler(files[0]);
    }
  };

  const handleClearFile = () => {
    updateAssistantImageHandler(null);
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
        <li>Switch my Take-a-Break scene.</li>
      </ul>
    </div>
  );

  return (
    <div className={styles.assistantSetting}>
      <div className={styles.avatar}>
        {assistant.avatarUrl !== "" ? (
          <Image
            src={assistant.avatarUrl}
            alt=""
            fill
            sizes="min(75vw, 12em) min(75vw, 12em)"
            priority={true}
          />
        ) : (
          <BsPersonFill className={styles.defaultAvatar} />
        )}
        <div className={styles.avatarOverlay}>
          {isUploading.value ? (
            <div className={styles.loadingContainer}>
              <Loading />
            </div>
          ) : (
            <>
              <label htmlFor="avatar-upload">Upload Image</label>
              <label htmlFor="avatar-clear" onClick={handleClearFile}>
                Clear Image
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

      <div className={styles.info}>
        <div>
          <header className={styles.settingLabel}>Name</header>
          <div className={styles.nameInput}>
            {isEditingName.value ? (
              <>
                <TextField
                  style={{ paddingTop: 0 }}
                  inputProps={{
                    autoFocus: true,
                    value: editingName.value,
                    onChange: (e: ChangeEvent<HTMLInputElement>) => {
                      editingName.value = e.target.value;
                    },
                    onKeyDown: (e) => {
                      if (e.key === "Enter") handleFinishEditingName();
                    },
                  }}
                />
                <IconButton
                  tabIndex={0}
                  onClick={handleFinishEditingName}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleFinishEditingName();
                  }}
                >
                  <MdOutlineCheck />
                </IconButton>
                <IconButton
                  tabIndex={0}
                  onClick={handleCancelEditingName}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleCancelEditingName();
                  }}
                >
                  <MdClear />
                </IconButton>
              </>
            ) : (
              <>
                {cachedName.value}
                <IconButton onClick={handleStartEditingName}>
                  <FiEdit2 />
                </IconButton>
              </>
            )}
          </div>
        </div>

        <div>
          <header className={styles.settingLabel}>
            Voice Commands
            <div className={styles.tooltipContainer}>
              <FiHelpCircle fontSize={20} />
              <Tooltip />
            </div>
          </header>
          <div className={styles.toggleContainer}>
            <span>Off</span>
            <Toggle
              on={assistant.voiceCommand}
              onClick={handleVoiceCommandToggle}
            />
            <span>On</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssistantSetting;
