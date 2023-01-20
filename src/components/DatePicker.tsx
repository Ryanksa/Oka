import { useState, MouseEvent, KeyboardEvent } from "react";
import styles from "../styles/DatePicker.module.scss";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import Modal from "react-modal";
import { MdClear } from "react-icons/md";
import { AiTwotoneCalendar } from "react-icons/ai";

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
      <div
        className="text-field-container"
        onClick={() => setIsSelecting(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter") setIsSelecting(true);
        }}
      >
        <div className={selected ? "text-field-label-1" : "text-field-label-0"}>
          {placeholder}
        </div>
        <input className="text-field" value={selectedDate} readOnly />
        <div className={styles.dateIcons}>
          <div className="icon-button" tabIndex={0}>
            <AiTwotoneCalendar fontSize={20} />
          </div>
          <div
            className="icon-button"
            tabIndex={0}
            onClick={handleClearSelection}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleClearSelection(e);
            }}
          >
            <MdClear fontSize={20} />
          </div>
        </div>
      </div>
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
