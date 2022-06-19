import React, { FC, useContext, useState, useEffect } from "react";
import styles from "../styles/Settings.module.scss";

import { updateAssistant, updateAssistantImage } from "../firebase";

import {
  AssistantContext,
  addAssistantContextListener,
  removeAssistantContextListener,
} from "../contexts";

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
  const assistantContext = useContext(AssistantContext);
  const [assistant, setAssistant] = useState<AssistantWithUrl>(
    assistantContext.assistant
  );

  const [editingName, setEditingName] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const callback = () => {
      setAssistant(assistantContext.assistant);
    };
    addAssistantContextListener(callback);
    return () => removeAssistantContextListener(callback);
  }, []);

  const updateAssistantWrapper = (
    assistant: Assistant,
    callback: () => void
  ) => {
    const promise = updateAssistant(assistant);
    if (!promise) {
      openSnackbar("Please sign in first to customize your assistant", "info");
      return;
    }
    promise
      .then(() => {
        openSnackbar("Successfully updated assistant", "success");
        callback();
      })
      .catch(() => {
        openSnackbar("Failed to update assistant", "error");
      });
  };

  const updateAssistantImageWrapper = (
    file: File | null,
    callback: () => void
  ) => {
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
          callback
        );
      })
      .catch(() => {
        openSnackbar("Failed to update the image", "error");
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
      updateAssistantImageWrapper(files[0], () => {});
    }
  };

  const handleClearFile = () => {
    updateAssistantImageWrapper(null, () => {});
  };

  const tooltipTitle = (
    <div className={styles.tooltip}>
      <Typography variant="h6">
        Enable voice commands and allow microphone use. Now say the following!
      </Typography>
      <ul>
        <li>
          <Typography variant="body1">What&apos;s on the news?</Typography>
        </li>
        <li>
          <Typography variant="body1">How&apos;s the weather?</Typography>
        </li>
        <li>
          <Typography variant="body1">Take me to home</Typography>
        </li>
        <li>
          <Typography variant="body1">Google Javascript</Typography>
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
          <Tooltip title={tooltipTitle} arrow>
            <HelpIcon color="action" />
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
