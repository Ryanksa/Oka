import React, { FC, useState } from "react";
import styles from "../styles//Workmap.module.scss";

import { deleteItem } from "../firebase";

import Button from "@mui/material/Button";
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
};

const WorkmapModal: FC<Props> = ({ currItem, closeModal, saveItem }) => {
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
          <TextField
            label="Name"
            value={name}
            fullWidth
            variant="standard"
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            label="Abbreviation"
            value={abbrev}
            fullWidth
            variant="standard"
            onChange={(e) => setAbbrev(e.target.value)}
          />
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
          <TextField
            label="Description"
            multiline
            fullWidth
            rows={4}
            variant="filled"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className={`${styles.modalFormRow} ${styles.buttons}`}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              saveItem(name, abbrev, due, description);
              closeModal();
            }}
          >
            Save
          </Button>
          <Button variant="contained" color="info" onClick={closeModal}>
            Cancel
          </Button>
          {currItem && (
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                deleteItem(currItem.id);
                closeModal();
              }}
            >
              Delete
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default WorkmapModal;
