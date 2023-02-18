import { useState, MouseEvent, KeyboardEvent } from "react";
import styles from "../styles/DatePicker.module.scss";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import Modal from "react-modal";
import { MdClear } from "react-icons/md";
import { AiTwotoneCalendar } from "react-icons/ai";
import TextField from "./TextField";
import IconButton from "./IconButton";

type Props = {
  selected: Date | null;
  onSelect: (date: Date | null) => void;
  placeholder: string;
};

const DatePicker = (props: Props) => {
  const { selected, onSelect, placeholder } = props;
  const [isSelecting, setIsSelecting] = useState(false);

  const handleClearSelection = (e: MouseEvent | KeyboardEvent) => {
    e.stopPropagation();
    onSelect(null);
  };

  const selectedDate = selected
    ? selected.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <div className={styles.container}>
      <TextField
        onClick={() => setIsSelecting(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter") setIsSelecting(true);
        }}
        labelProps={{ children: placeholder }}
        inputProps={{ value: selectedDate, readOnly: true }}
        actions={
          <div className={styles.dateIcons}>
            <IconButton tabIndex={0}>
              <AiTwotoneCalendar fontSize={20} />
            </IconButton>
            <IconButton
              tabIndex={0}
              onClick={handleClearSelection}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleClearSelection(e);
              }}
            >
              <MdClear fontSize={20} />
            </IconButton>
          </div>
        }
      />
      <Modal
        isOpen={isSelecting}
        onRequestClose={() => setIsSelecting(false)}
        className={styles.pickerModal}
        overlayClassName={styles.pickerModalOverlay}
        ariaHideApp={false}
      >
        <DayPicker
          mode="single"
          selected={selected as Date | undefined}
          onSelect={(date) => {
            onSelect(date as Date | null);
            setIsSelecting(false);
          }}
        />
      </Modal>
    </div>
  );
};

export default DatePicker;
