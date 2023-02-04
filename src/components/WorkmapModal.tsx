import { useEffect, useState } from "react";
import styles from "../styles//WorkmapModal.module.scss";
import DatePicker from "./DatePicker";
import { WorkmapItem } from "../models/workmap";
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
            <div className="text-field-container">
              <div
                className={name ? "text-field-label-1" : "text-field-label-0"}
              >
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
            <DatePicker
              selected={due}
              onSelect={(date: Date | null) => setDue(date)}
              placeholder="Due Date"
            />
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
    </Modal>
  );
};

export default WorkmapModal;
