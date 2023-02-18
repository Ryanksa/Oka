import { useEffect, ReactNode } from "react";
import styles from "../styles/Snackbar.module.scss";
import { MdClear } from "react-icons/md";
import IconButton from "./IconButton";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  message: ReactNode;
  timeout: number;
};

const Snackbar = (props: Props) => {
  const { isOpen, onClose, message, timeout } = props;

  useEffect(() => {
    if (!isOpen) return;
    const timeoutId = setTimeout(() => onClose(), timeout);
    return () => clearTimeout(timeoutId);
  }, [isOpen, timeout, onClose]);

  return (
    <>
      {isOpen && (
        <div className={styles.container}>
          {message}
          <IconButton onClick={onClose}>
            <MdClear fontSize={15} />
          </IconButton>
        </div>
      )}
    </>
  );
};

export default Snackbar;
