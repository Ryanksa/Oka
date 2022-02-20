import React, { useState, useEffect } from "react";
import styles from "../styles/Settings.module.scss";

import hotspringPreview from "../assets/hotspring-preview.png";
import bulletingExample from "../assets/bulleting-example.gif";

import Image from "next/image";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

const TakeABreakSetting = () => {
  const [selected, setSelected] = useState("");

  useEffect(() => {
    const breakOption = localStorage.getItem("takeABreak");
    if (breakOption) {
      setSelected(breakOption);
    } else {
      setSelected("hotspring");
    }
  }, []);

  const toggle = (setting: string) => {
    if (selected !== setting) {
      localStorage.setItem("takeABreak", setting);
      setSelected(setting);
    }
  };

  let imageSrc: StaticImageData | string = "";
  if (selected === "bulleting") {
    imageSrc = bulletingExample;
  } else {
    imageSrc = hotspringPreview;
  }

  return (
    <div className={styles.takeABreakSetting}>
      <div className={styles.preview}>
        <Image src={imageSrc} alt="" layout="fill" />
      </div>

      <div className={styles.options}>
        <Typography className={styles.optionsHeader}>Break Options</Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography className={styles.option}>Hot Spring</Typography>
          <Switch
            checked={selected === "hotspring"}
            size="medium"
            onChange={() => toggle("hotspring")}
          />
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography className={styles.option}>Bulleting</Typography>
          <Switch
            checked={selected === "bulleting"}
            size="medium"
            onChange={() => toggle("bulleting")}
          />
        </Stack>
      </div>
    </div>
  );
};

export default TakeABreakSetting;
