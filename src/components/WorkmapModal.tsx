import { ChangeEvent, useEffect } from "react";
import styles from "../styles//WorkmapModal.module.scss";
import DatePicker from "./DatePicker";
import { WorkmapItem } from "../models/workmap";
import TextField from "./TextField";
import Modal from "react-modal";
import { useSignal } from "@preact/signals-react";

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
  const name = useSignal(currItem ? currItem.name : "");
  const abbrev = useSignal(currItem ? currItem.abbrev : "");
  const due = useSignal(currItem ? currItem.due : null);
  const description = useSignal(currItem ? currItem.description : "");
  const submitting = useSignal(false);

  useEffect(() => {
    if (isModalOpen) {
      name.value = currItem ? currItem.name : "";
      abbrev.value = currItem ? currItem.abbrev : "";
      due.value = currItem ? currItem.due : null;
      description.value = currItem ? currItem.description : "";
    } else {
      name.value = "";
      abbrev.value = "";
      due.value = null;
      description.value = "";
    }
  }, [isModalOpen, currItem]);

  const onNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    name.value = event.target.value;
  };

  const onAbbrevChange = (event: ChangeEvent<HTMLInputElement>) => {
    abbrev.value = event.target.value;
  };

  const onDescriptionChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    description.value = event.target.value;
  };

  return (
    <Modal
      isOpen={isModalOpen}
      onRequestClose={closeModal}
      className={styles.workmapModal}
      overlayClassName={styles.workmapModalOverlay}
      ariaHideApp={false}
    >
      <div
        className={
          styles.workmapModalContent +
          (submitting.value ? ` ${styles.submitting}` : "")
        }
      >
        <header>
          <h4 className={styles.modalTitle}>
            {currItem ? "Edit an Item" : "Add an Item"}
          </h4>
        </header>

        <div className={styles.modalForm}>
          <div className={styles.modalFormRow}>
            <TextField
              labelProps={{ children: "Name" }}
              inputProps={{
                value: name.value,
                onChange: onNameChange,
              }}
            />
            <TextField
              labelProps={{ children: "Abbreviation" }}
              inputProps={{
                value: abbrev.value,
                onChange: onAbbrevChange,
              }}
            />
          </div>
          <div className={styles.modalFormRow}>
            <DatePicker
              selected={due.value}
              onSelect={(date: Date | null) => (due.value = date)}
              placeholder="Due Date"
            />
          </div>
          <div className={`${styles.modalFormRow} ${styles.description}`}>
            <TextField
              labelProps={{ children: "Description" }}
              textAreaProps={{
                value: description.value,
                onChange: onDescriptionChange,
                rows: 6,
              }}
            />
          </div>

          <div className={`${styles.modalFormRow} ${styles.buttons}`}>
            <button
              className={`${styles.modalFormButton} ${styles.saveButton}`}
              disabled={submitting.value}
              onClick={() => {
                submitting.value = true;
                saveItem(
                  name.value,
                  abbrev.value,
                  due.value,
                  description.value
                ).finally(() => {
                  closeModal();
                  submitting.value = false;
                });
              }}
            >
              Save
            </button>
            {currItem ? (
              <button
                className={`${styles.modalFormButton} ${styles.doneButton}`}
                disabled={submitting.value}
                onClick={() => {
                  submitting.value = true;
                  deleteItem(currItem.id).finally(() => {
                    closeModal();
                    submitting.value = false;
                  });
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
        </div>
      </div>
    </Modal>
  );
};

export default WorkmapModal;
