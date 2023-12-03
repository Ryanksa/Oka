import { useSignal } from "@preact/signals-react";
import styles from "../../src/styles/Settings.module.scss";
import store from "../../src/store";
import OkaHead from "../../src/components/OkaHead";
import AssistantSetting from "../../src/components/AssistantSetting";
import TakeABreakSettings from "../../src/components/TakeABreakSetting";
import Snackbar from "../../src/components/Snackbar";

const Settings = () => {
  const assistant = store.assistant.value;
  const takeABreak = store.takeABreak.value;
  const snackbarMessage = useSignal("");

  const openSnackbar = (msg: string) => {
    snackbarMessage.value = msg;
  };

  const closeSnackbar = () => {
    snackbarMessage.value = "";
  };

  return (
    <>
      <OkaHead title="Settings" />
      <div className={styles.settingsContainer}>
        <section className={styles.settingContainer}>
          <header className={styles.settingHeader}>Assistant</header>
          <AssistantSetting assistant={assistant} openSnackbar={openSnackbar} />
        </section>
        <section className={styles.settingContainer}>
          <header className={styles.settingHeader}>Take a Break</header>
          <TakeABreakSettings takeABreak={takeABreak} />
        </section>
      </div>
      <Snackbar
        isOpen={!!snackbarMessage.value}
        onClose={closeSnackbar}
        message={snackbarMessage.value}
        timeout={5000}
      />
    </>
  );
};

export default Settings;
