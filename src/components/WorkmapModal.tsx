import React, { FC, useState } from "react";
import styles from "../styles//Workmap.module.scss";
import TextField from "@mui/material/TextField";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";
import TimePicker from "@mui/lab/TimePicker";
import { WorkmapItem } from "../models/workmap";

type Props = {
  currItem: WorkmapItem | null;
  closeModal: () => void;
  saveItem: (
    name: string,
    abbrev: string,
    due: Date | null,
    description: string
  ) => any;
  deleteItem: (itemId: string) => any;
};

const WorkmapModal: FC<Props> = ({
  currItem,
  closeModal,
  saveItem,
  deleteItem,
}) => {
  const [name, setName] = useState(currItem ? currItem.name : "");
  const [abbrev, setAbbrev] = useState(currItem ? currItem.abbrev : "");
  const [due, setDue] = useState(currItem ? currItem.due : null);
  const [description, setDescription] = useState(
    currItem ? currItem.description : ""
  );

  return (
    <div className={styles.workmapModal}>
      <header>
        <h4 className={styles.modalTitle}>
          {currItem ? "Edit an Item" : "Add an Item"}
        </h4>
      </header>

      <form className={styles.modalForm}>
        <div className={styles.modalFormRow}>
          <div className="text-field-container">
            <div className={name ? "text-field-label-1" : "text-field-label-0"}>
              Name
            </div>
            <input
              className="text-field"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="text-field-container">
            <div
              className={abbrev ? "text-field-label-1" : "text-field-label-0"}
            >
              Abbreviation
            </div>
            <input
              className="text-field"
              value={abbrev}
              onChange={(e) => setAbbrev(e.target.value)}
            />
          </div>
        </div>
        <div className={styles.modalFormRow}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              renderInput={(props) => (
                <TextField variant="standard" fullWidth {...props} />
              )}
              label="Due Date"
              value={due}
              onChange={(date: Date | null) => setDue(date)}
            />
            <TimePicker
              renderInput={(props) => (
                <TextField variant="standard" fullWidth {...props} />
              )}
              label="Due Time"
              value={due}
              onChange={(date: Date | null) => setDue(date)}
            />
          </LocalizationProvider>
        </div>
        <div className={`${styles.modalFormRow} ${styles.description}`}>
          <div className="text-field-container">
            <div
              className={
                description ? "text-field-label-1" : "text-field-label-0"
              }
            >
              Description
            </div>
            <textarea
              className="text-field"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
            />
          </div>
        </div>

        <div className={`${styles.modalFormRow} ${styles.buttons}`}>
          <button
            className={`${styles.modalFormButton} ${styles.saveButton}`}
            onClick={() => {
              saveItem(name, abbrev, due, description);
              closeModal();
            }}
          >
            Save
          </button>
          {currItem ? (
            <button
              className={`${styles.modalFormButton} ${styles.doneButton}`}
              onClick={() => {
                deleteItem(currItem.id);
                closeModal();
              }}
            >
              Done
            </button>
          ) : (
            <button
              className={`${styles.modalFormButton} ${styles.cancelButton}`}
              onClick={closeModal}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default WorkmapModal;
