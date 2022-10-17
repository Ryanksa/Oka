import {
  FC,
  useState,
  useEffect,
  useSyncExternalStore,
  ChangeEvent,
} from "react";
import styles from "../styles/Settings.module.scss";
import { updateAssistant, updateAssistantImage } from "../firebase";
import { assistantStore } from "../stores";
import Image from "next/image";
import { MdOutlineCheck, MdClear } from "react-icons/md";
import { FiEdit2, FiHelpCircle } from "react-icons/fi";
import { BsPersonFill } from "react-icons/bs";
import { Assistant } from "../models/assistant";

type Props = {
  openSnackbar: (msg: string) => void;
};

const AssistantSetting: FC<Props> = ({ openSnackbar }) => {
  const assistant = useSyncExternalStore(
    assistantStore.subscribe,
    assistantStore.getSnapshot,
    assistantStore.getServerSnapshot
  );
  // Using an extra state to cache the assistant name to prevent flicker when updating
  const [cachedName, setCachedName] = useState(assistant.name);
  const [editingName, setEditingName] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setCachedName(assistant.name);
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
      setIsUploading(true);
      const fileName = await updateAssistantImage(file);
      if (!fileName) {
        openSnackbar("Please sign in first to customize your assistant");
        setIsUploading(false);
        return;
      }
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
      setIsUploading(false);
    }
  };

  const handleStartEditingName = () => {
    setEditingName(assistant.name);
    setIsEditingName(true);
  };

  const handleFinishEditingName = () => {
    const newAssistant = {
      ...assistant,
      name: editingName,
    };
    updateAssistantHandler(newAssistant, () => {});
    setCachedName(editingName);
    setIsEditingName(false);
  };

  const handleCancelEditingName = () => {
    setIsEditingName(false);
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
              {cachedName}
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
