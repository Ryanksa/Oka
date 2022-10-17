import { FC } from "react";
import styles from "../styles/DateIcon.module.scss";

const months = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUNE",
  "JULY",
  "AUG",
  "SEPT",
  "OCT",
  "NOV",
  "DEC",
];
const weekdays = ["SUN", "MON", "TUES", "WED", "THUR", "FRI", "SAT"];

type Props = {
  date: Date;
  circle: boolean;
  cross: boolean;
};

const DateIcon: FC<Props> = ({ date, circle, cross }) => {
  if (!date.getMonth) return <></>;
  return (
    <div className={styles.dateIconWrapper}>
      {cross && <div className={`${styles.overlay} ${styles.cross}`}></div>}
      {circle && <div className={`${styles.overlay} ${styles.circle}`}></div>}
      <div className={styles.dateIcon}>
        <div className={styles.iconHeader}>{months[date.getMonth()]}</div>
        <div className={styles.iconBody}>{date.getDate()}</div>
        <div className={styles.iconBodyBg}>{weekdays[date.getDay()]}</div>
      </div>
    </div>
  );
};

export default DateIcon;
