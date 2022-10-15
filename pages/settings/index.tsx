import React from "react";
import styles from "../../src/styles/Settings.module.scss";
import OkaHead from "../../src/components/OkaHead";
import AssistantSetting from "../../src/components/AssistantSetting";
import TakeABreakSettings from "../../src/components/TakeABreakSetting";
import { useSnackbar } from "react-simple-snackbar";

const SNACKBAR_BG = "#363643"; // --emphasis-dark

const Settings = () => {
  const [openSnackbar, _closeSnackbar] = useSnackbar({
    position: "bottom-right",
    style: {
      backgroundColor: SNACKBAR_BG,
    },
  });

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
    </>
  );
};

export default Settings;
