import React, { FC, useContext, useState, useEffect } from "react";
import styles from "../styles/Settings.module.scss";

import {
  getAssistant,
  updateAssistant,
  updateAssistantImage,
} from "../firebase";

import {
  UserContext,
  addUserContextListener,
  removeUserContextListener,
} from "../contexts";

import Image from "next/image";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import { AlertColor } from "@mui/material/Alert";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";

import defaultAssistant from "../assets/default-assistant.svg";

import { Assistant } from "../models/assistant";

const AssistantSetting: FC<{
  openSnackbar: (msg: string, severity: AlertColor) => void;
}> = ({ openSnackbar }) => {
  const userContext = useContext(UserContext);
  const [user, setUser] = useState(userContext.user);

  const [assistant, setAssistant] = useState<Assistant>({
    avatar: "",
    name: "Assistant",
    voiceCommand: true,
  });
  const [avatarUrl, setAvatarUrl] = useState("");

  const [editingName, setEditingName] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [fileHandle, setFileHandle] = useState<File>();
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const callback = () => {
      setUser(userContext.user);
    };
    addUserContextListener(callback);
    return () => removeUserContextListener(callback);
  }, []);

  useEffect(() => {
    const promise = getAssistant();
    if (promise) {
      promise.then(({ assistant, imageUrl }) => {
        setAssistant(assistant);
        setAvatarUrl(imageUrl);
      });
    }
  }, [user]);

  const updateAssistantWrapper = (assistant: Assistant) => {
    const promise = updateAssistant(assistant);

    if (promise) {
      promise
        .then(() => {
          openSnackbar("Successfully updated assistant", "success");
        })
        .catch(() => {
          openSnackbar("Failed to update assistant", "error");
        });
    } else {
      openSnackbar("Please sign in first to customize your assistant", "info");
    }
  };

  const updateAssistantImageWrapper = (file: File) => {
    setIsUploading(true);
    const promise = updateAssistantImage(file);

    if (promise) {
      promise
        .then((fileName) => {
          updateAssistantWrapper({
            ...assistant,
            avatar: fileName,
          });
        })
        .catch(() => {
          openSnackbar("Failed to upload the image", "error");
        })
        .finally(() => {
          setIsUploading(false);
        });
    } else {
      openSnackbar("Please sign in first to customize your assistant", "info");
      setIsUploading(false);
    }
  };

  const handleStartEditingName = () => {
    setEditingName(assistant.name);
    setIsEditingName(true);
  };

  const handleFinishEditingName = () => {
    updateAssistantWrapper({
      ...assistant,
      name: editingName,
    });
    setAssistant((prev) => ({
      ...prev,
      name: editingName,
    }));
    setIsEditingName(false);
  };

  const handleCancelEditingName = () => {
    setIsEditingName(false);
  };

  const handleVoiceCommandToggle = () => {
    updateAssistantWrapper({
      ...assistant,
      voiceCommand: !assistant.voiceCommand,
    });
    setAssistant((prev) => ({
      ...prev,
      voiceCommand: !prev.voiceCommand,
    }));
  };

  const handleChooseFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setFileHandle(files[0]);
      setAvatarUrl(URL.createObjectURL(files[0]));
    }
  };

  const handleUploadFile = () => {
    if (fileHandle) {
      updateAssistantImageWrapper(fileHandle);
    }
  };

  return (
    <div className={styles.assistantSetting}>
      <div className={styles.avatar}>
        <Image
          src={avatarUrl !== "" ? avatarUrl : defaultAssistant}
          alt=""
          layout="fill"
        />
        <div className={styles.avatarOverlay}>
          {isUploading ? (
            <CircularProgress />
          ) : (
            <>
              <label htmlFor="avatar-upload">Choose an image</label>
              <input
                type="file"
                accept="image/*"
                id="avatar-upload"
                name="avatar-upload"
                onChange={handleChooseFile}
              />
              <Button variant="contained" onClick={handleUploadFile}>
                Upload
              </Button>
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
        <header className={styles.settingLabel}>Voice Command</header>
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
