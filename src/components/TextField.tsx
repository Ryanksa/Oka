import { ReactNode, HTMLProps } from "react";
import styles from "../styles/TextField.module.scss";

type Props = {
  labelProps?: HTMLProps<HTMLDivElement>;
  inputProps?: HTMLProps<HTMLInputElement>;
  textAreaProps?: HTMLProps<HTMLTextAreaElement>;
  actions?: ReactNode;
} & HTMLProps<HTMLDivElement>;

const TextField = ({
  labelProps,
  inputProps,
  textAreaProps,
  actions,
  ...props
}: Props) => {
  const value = inputProps?.value ?? textAreaProps?.value;
  return (
    <div
      {...props}
      className={`${styles.textFieldContainer} ${props.className ?? ""}`}
    >
      {labelProps && (
        <div
          {...labelProps}
          className={
            (value ? styles.textFieldLabel1 : styles.textFieldLabel0) +
            ` ${labelProps.className ?? ""}`
          }
        />
      )}
      {inputProps && (
        <input
          {...inputProps}
          className={`${styles.textField} ${inputProps.className ?? ""}`}
        />
      )}
      {textAreaProps && (
        <textarea
          {...textAreaProps}
          className={`${styles.textField} ${textAreaProps.className ?? ""}`}
        />
      )}
      {actions}
    </div>
  );
};

export default TextField;
