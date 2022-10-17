import { useSyncExternalStore } from "react";
import styles from "../styles/Settings.module.scss";
import { takeABreakStore } from "../stores";
import { BreakOption, HotSpringPalette } from "../models/takeABreak";
import { updateTakeABreakOption, updateHotSpringPalette } from "../firebase";
import hotspringPreview from "../assets/hotspring-preview.png";
import mountainoceanPreview from "../assets/mountainocean-preview.png";
import bulletingPreview from "../assets/bulleting-preview.gif";
import Image from "next/image";
import Dropdown from "react-dropdown";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";

// Workaround for StaticImageData not found issue
// https://github.com/vercel/next.js/issues/29788
type StaticImageData = {
  src: string;
  height: number;
  width: number;
  placeholder?: string;
};

const TakeABreakSetting = () => {
  const takeABreak = useSyncExternalStore(
    takeABreakStore.subscribe,
    takeABreakStore.getSnapshot,
    takeABreakStore.getServerSnapshot
  );
  const selected = takeABreak.breakOption;
  const palette = takeABreak.hotSpringPalette;

  const handleSelect = (option: BreakOption) => {
    if (selected !== option) {
      updateTakeABreakOption(option);
    }
  };

  const handlePaletteChange = () => {
    if (palette === HotSpringPalette.lucid) {
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
        <h2 className={styles.optionsHeader}>Break Options</h2>
        <Dropdown
          className={styles.optionDropdown}
          controlClassName={styles.optionDropdownControl}
          menuClassName={styles.optionDropdownMenu}
          arrowClosed={<IoMdArrowDropdown />}
          arrowOpen={<IoMdArrowDropup />}
          value={selected}
          onChange={(option) => handleSelect(option.value as BreakOption)}
          options={[
            {
              value: BreakOption.hotspring,
              label: "Hot Spring",
              className: styles.optionDropdownOption,
            },
            {
              value: BreakOption.mountainocean,
              label: "Mountain & Ocean",
              className: styles.optionDropdownOption,
            },
            {
              value: BreakOption.bulleting,
              label: "Bulleting",
              className: styles.optionDropdownOption,
            },
          ]}
        />
        {selected === BreakOption.hotspring && (
          <div className={styles.toggleContainer}>
            <span>Lucid</span>
            <div
              className={
                "toggle " + (palette === HotSpringPalette.warm ? "on" : "off")
              }
              onClick={handlePaletteChange}
            />
            <span>Warm</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TakeABreakSetting;
