import { HTMLProps } from "react";
import styles from "../styles/Toggle.module.scss";

type Props = {
  on: boolean;
} & HTMLProps<HTMLDivElement>;

const Toggle = ({ on, ...props }: Props) => {
  return (
    <div
      {...props}
      className={`
        ${styles.toggle} ${props.className ?? ""}
        ${on ? styles.on : styles.off}
      `}
    />
  );
};

export default Toggle;
