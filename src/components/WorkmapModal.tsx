import { ChangeEvent, useEffect, useState } from "react";
import styles from "../styles//WorkmapModal.module.scss";
import DatePicker from "./DatePicker";
import { WorkmapItem } from "../models/workmap";
import TextField from "./TextField";
import Modal from "react-modal";

type Props = {
  isModalOpen: boolean;
  closeModal: () => void;
  currItem: WorkmapItem | null;
  saveItem: (
    name: string,
    abbrev: string,
    due: Date | null,
    description: string
  ) => any;
  deleteItem: (itemId: string) => any;
};

const WorkmapModal = ({
  isModalOpen,
  closeModal,
  currItem,
  saveItem,
  deleteItem,
}: Props) => {
  const [name, setName] = useState(currItem ? currItem.name : "");
  const [abbrev, setAbbrev] = useState(currItem ? currItem.abbrev : "");
  const [due, setDue] = useState(currItem ? currItem.due : null);
  const [description, setDescription] = useState(
    currItem ? currItem.description : ""
  );

  useEffect(() => {
    if (isModalOpen) {
      setName(currItem ? currItem.name : "");
      setAbbrev(currItem ? currItem.abbrev : "");
      setDue(currItem ? currItem.due : null);
      setDescription(currItem ? currItem.description : "");
    } else {
      setName("");
      setAbbrev("");
      setDue(null);
      setDescription("");
    }
  }, [isModalOpen, currItem]);

  const onNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const onAbbrevChange = (event: ChangeEvent<HTMLInputElement>) => {
    setAbbrev(event.target.value);
  };

  const onDescriptionChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(event.target.value);
  };

  return (
    <Modal
      isOpen={isModalOpen}
      onRequestClose={closeModal}
      className={styles.workmapModal}
      overlayClassName={styles.workmapModalOverlay}
      ariaHideApp={false}
    >
      <div className={styles.workmapModalContent}>
        <header>
          <h4 className={styles.modalTitle}>
            {currItem ? "Edit an Item" : "Add an Item"}
          </h4>
        </header>

        <form className={styles.modalForm}>
          <div className={styles.modalFormRow}>
            <TextField
              labelProps={{ children: "Name" }}
              inputProps={{
                value: name,
                onChange: onNameChange,
              }}
            />
            <TextField
              labelProps={{ children: "Abbreviation" }}
              inputProps={{
                value: abbrev,
                onChange: onAbbrevChange,
              }}
            />
          </div>
          <div className={styles.modalFormRow}>
            <DatePicker
              selected={due}
              onSelect={(date: Date | null) => setDue(date)}
              placeholder="Due Date"
            />
          </div>
          <div className={`${styles.modalFormRow} ${styles.description}`}>
            <TextField
              labelProps={{ children: "Description" }}
              textAreaProps={{
                value: description,
                onChange: onDescriptionChange,
                rows: 6,
              }}
            />
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
    </Modal>
  );
};

export default WorkmapModal;
