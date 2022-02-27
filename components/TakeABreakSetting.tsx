import React, { useState, useEffect } from "react";
import styles from "../styles/Settings.module.scss";

import hotspringPreview from "../assets/hotspring-preview.png";
import bulletingExample from "../assets/bulleting-example.gif";

import Image from "next/image";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

const TakeABreakSetting = () => {
  const [selected, setSelected] = useState("");
  const [palette, setPalette] = useState("");

  useEffect(() => {
    const breakOption = localStorage.getItem("takeABreak");
    if (breakOption) {
      setSelected(breakOption);
    } else {
      setSelected("hotspring");
    }

    const hotSpringPalette = localStorage.getItem("hotSpringPalette");
    if (hotSpringPalette) {
      setPalette(hotSpringPalette);
    } else {
      setPalette("warm");
    }
  }, []);

  const handleSelect = (setting: string) => {
    if (selected !== setting) {
      localStorage.setItem("takeABreak", setting);
      setSelected(setting);
    }
  };

  const handlePaletteChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      localStorage.setItem("hotSpringPalette", "warm");
      setPalette("warm");
    } else {
      localStorage.setItem("hotSpringPalette", "lucid");
      setPalette("lucid");
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
        <Select
          className={styles.optionSelect}
          displayEmpty
          value={selected}
          onChange={(e) => handleSelect(e.target.value)}
        >
          <MenuItem value="hotspring">Hot Spring</MenuItem>
          <MenuItem value="bulleting">Bulleting</MenuItem>
        </Select>
        {selected === "hotspring" && (
          <Stack direction="row" alignItems="center">
            <Typography>Lucid</Typography>
            <Switch
              checked={palette === "warm"}
              size="medium"
              onChange={handlePaletteChange}
            />
            <Typography>Warm</Typography>
          </Stack>
        )}
      </div>
    </div>
  );
};

export default TakeABreakSetting;
