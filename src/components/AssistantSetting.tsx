import React, { FC, useState, useEffect } from "react";
import styles from "../styles/Settings.module.scss";

import { updateAssistant, updateAssistantImage } from "../firebase";

import {
  assistantStore,
  addAssistantStoreListener,
  removeAssistantStoreListener,
} from "../stores";

import Image from "next/image";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Switch from "@mui/material/Switch";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import Tooltip from "@mui/material/Tooltip";
import { AlertColor } from "@mui/material/Alert";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import HelpIcon from "@mui/icons-material/Help";
import PersonIcon from "@mui/icons-material/Person";

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

  const TooltipContent = () => (
    <div className={styles.tooltip}>
      <Typography variant="h6">
        Enable voice commands and allow microphone use on Chrome. Then try
        saying the following:
      </Typography>
      <ul>
        <li>
          <Typography variant="body1">What&apos;s on the news?</Typography>
        </li>
        <li>
          <Typography variant="body1">How&apos;s the weather?</Typography>
        </li>
        <li>
          <Typography variant="body1">Take me to home.</Typography>
        </li>
        <li>
          <Typography variant="body1">Google Javascript.</Typography>
        </li>
      </ul>
    </div>
  );

  return (
    <div className={styles.assistantSetting}>
      <div className={styles.avatar}>
        {assistant.avatarUrl !== "" ? (
          <Image src={assistant.avatarUrl} alt="" layout="fill" />
        ) : (
          <PersonIcon style={{ width: "100%", height: "100%" }} />
        )}
        <div className={styles.avatarOverlay}>
          {isUploading ? (
            <CircularProgress />
          ) : (
            <>
              <label htmlFor="avatar-upload">Choose an image</label>
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
              <TextField
                variant="standard"
                autoFocus
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
              />
              <IconButton onClick={handleFinishEditingName}>
                <CheckIcon />
              </IconButton>
              <IconButton onClick={handleCancelEditingName}>
                <ClearIcon />
              </IconButton>
            </>
          ) : (
            <>
              {assistant.name}
              <IconButton onClick={handleStartEditingName}>
                <EditIcon />
              </IconButton>
            </>
          )}
        </div>
      </div>

      <div className={styles.voiceCommand}>
        <header className={styles.settingLabel}>
          Voice Commands
          <Tooltip title={<TooltipContent />} arrow>
            <HelpIcon color="inherit" />
          </Tooltip>
        </header>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography>Off</Typography>
          <Switch
            checked={assistant.voiceCommand}
            size="medium"
            onChange={handleVoiceCommandToggle}
          />
          <Typography>On</Typography>
        </Stack>
      </div>
    </div>
  );
};

export default AssistantSetting;
