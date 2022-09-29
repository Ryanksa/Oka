import React, { useState, useEffect } from "react";
import styles from "../styles/Settings.module.scss";

import {
  takeABreakStore,
  addTakeABreakStoreListener,
  removeTakeABreakStoreListener,
} from "../stores";
import { BreakOption, HotSpringPalette } from "../models/takeABreak";
import { updateTakeABreakOption, updateHotSpringPalette } from "../firebase";

import hotspringPreview from "../assets/hotspring-preview.png";
import mountainoceanPreview from "../assets/mountainocean-preview.png";
import bulletingPreview from "../assets/bulleting-preview.gif";

import Image from "next/image";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

// Workaround for StaticImageData not found issue
// https://github.com/vercel/next.js/issues/29788
type StaticImageData = {
  src: string;
  height: number;
  width: number;
  placeholder?: string;
};

const TakeABreakSetting = () => {
  const [selected, setSelected] = useState<BreakOption>(
    takeABreakStore.takeABreak.breakOption
  );
  const [palette, setPalette] = useState<HotSpringPalette>(
    takeABreakStore.takeABreak.hotSpringPalette
  );

  useEffect(() => {
    const callback = () => {
      setSelected(takeABreakStore.takeABreak.breakOption);
      setPalette(takeABreakStore.takeABreak.hotSpringPalette);
    };
    addTakeABreakStoreListener(callback);
    return () => removeTakeABreakStoreListener(callback);
  }, []);

  const handleSelect = (option: BreakOption) => {
    if (selected !== option) {
      updateTakeABreakOption(option);
    }
  };

  const handlePaletteChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      updateHotSpringPalette(HotSpringPalette.warm);
    } else {
      updateHotSpringPalette(HotSpringPalette.lucid);
    }
  };

  let imageSrc: StaticImageData | string = "";
  switch (selected) {
    case BreakOption.hotspring:
      imageSrc = hotspringPreview;
      break;
    case BreakOption.mountainocean:
      imageSrc = mountainoceanPreview;
      break;
    case BreakOption.bulleting:
      imageSrc = bulletingPreview;
      break;
    default:
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
          onChange={(e) => handleSelect(e.target.value as BreakOption)}
        >
          <MenuItem value={BreakOption.hotspring}>Hot Spring</MenuItem>
          <MenuItem value={BreakOption.mountainocean}>
            Mountain & Ocean
          </MenuItem>
          <MenuItem value={BreakOption.bulleting}>Bulleting</MenuItem>
        </Select>
        {selected === BreakOption.hotspring && (
          <Stack direction="row" alignItems="center">
            <Typography>Lucid</Typography>
            <Switch
              checked={palette === HotSpringPalette.warm}
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
