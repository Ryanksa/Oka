import { useState } from "react";
import styles from "../../src/styles/Settings.module.scss";
import OkaHead from "../../src/components/OkaHead";
import AssistantSetting from "../../src/components/AssistantSetting";
import TakeABreakSettings from "../../src/components/TakeABreakSetting";
import Snackbar from "../../src/components/Snackbar";

const Settings = () => {
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const openSnackbar = (msg: string) => {
    setSnackbarMessage(msg);
  };

  const closeSnackbar = () => {
    setSnackbarMessage("");
  };

  return (
    <>
      <OkaHead title="Settings" />
      <div className={styles.settingsContainer}>
        <section className={styles.settingContainer}>
          <header className={styles.settingHeader}>Assistant</header>
          <AssistantSetting openSnackbar={openSnackbar} />
        </section>
        <section className={styles.settingContainer}>
          <header className={styles.settingHeader}>Take a Break</header>
          <TakeABreakSettings />
        </section>
      </div>
      <Snackbar
        isOpen={!!snackbarMessage}
        onClose={closeSnackbar}
        message={snackbarMessage}
        timeout={5000}
      />
    </>
  );
};

export default Settings;
