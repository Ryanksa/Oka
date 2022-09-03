import React, { useState } from "react";
import styles from "../../src/styles/Settings.module.scss";
import OkaHead from "../../src/components/OkaHead";
import AssistantSetting from "../../src/components/AssistantSetting";
import TakeABreakSettings from "../../src/components/TakeABreakSetting";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertColor } from "@mui/material/Alert";

const Settings = () => {
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>("info");

  const handleOpenSnackbar = (msg: string, severity: AlertColor) => {
    setSnackbarMessage(msg);
    setSnackbarSeverity(severity);
  };

  const handleCloseSnackbar = () => {
    setSnackbarMessage("");
  };

  return (
    <>
      <OkaHead title="Settings" />
      <div className={styles.settingsContainer}>
        <section className={styles.settingContainer}>
          <header className={styles.settingHeader}>Assistant</header>
          <AssistantSetting openSnackbar={handleOpenSnackbar} />
        </section>
        <section className={styles.settingContainer}>
          <header className={styles.settingHeader}>Take a Break</header>
          <TakeABreakSettings />
        </section>

        <Snackbar
          open={snackbarMessage !== ""}
          autoHideDuration={5000}
          onClose={handleCloseSnackbar}
        >
          <MuiAlert
            elevation={6}
            variant="filled"
            onClose={handleCloseSnackbar}
            severity={snackbarSeverity}
          >
            {snackbarMessage}
          </MuiAlert>
        </Snackbar>
      </div>
    </>
  );
};

export default Settings;
