import { HTMLProps } from "react";
import styles from "../styles/IconButton.module.scss";

type Props = HTMLProps<HTMLDivElement>;

const IconButton = (props: Props) => {
  return (
    <div {...props} className={`${styles.iconButton} ${props.className ?? ""}`}>
      {props.children}
    </div>
  );
};

export default IconButton;
