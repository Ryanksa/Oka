import React, { useEffect } from "react";
import styles from "../styles/Snackbar.module.scss";
import { MdClear } from "react-icons/md";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  message: React.ReactNode;
  timeout: number;
};

const Snackbar = (props: Props) => {
  const { isOpen, onClose, message, timeout } = props;

  useEffect(() => {
    if (!isOpen) return;
    const timeoutId = setTimeout(() => onClose(), timeout);
    return () => clearTimeout(timeoutId);
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <div className={styles.container}>
          {message}
          <div className="icon-button" onClick={onClose}>
            <MdClear fontSize={15} />
          </div>
        </div>
      )}
    </>
  );
};

export default Snackbar;
