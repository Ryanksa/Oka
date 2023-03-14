import { useEffect, useSyncExternalStore } from "react";
import styles from "../styles/Upcoming.module.scss";
import { userStore, workmapItemsStore } from "../stores";
import { MILLISECSPERDAY, WEEKDAYS } from "../utils/date";
import Link from "next/link";
import Countdown from "react-countdown";
import { IoMdMap } from "react-icons/io";
import IconButton from "./IconButton";

const Upcoming = () => {
  const user = useSyncExternalStore(
    userStore.subscribe,
    userStore.getSnapshot,
    userStore.getServerSnapshot
  );
  const itemsList = useSyncExternalStore(
    workmapItemsStore.subscribe,
    workmapItemsStore.getSnapshot,
    workmapItemsStore.getServerSnapshot
  );

  useEffect(() => {
    // style the cards for the item list
    const cardList = document.querySelectorAll(
      `.${styles.upcomingCard}`
    ) as NodeListOf<HTMLDivElement>;
    let complement;
    for (let i = 0; i < cardList.length; i++) {
      complement = cardList.length - i;
      cardList[i].style.top = `${5 * i}px`;
      cardList[i].style.zIndex = "" + complement;
    }
  }, [itemsList]);

  return (
    <div className={styles.upcomingContainer}>
      <h4 className={styles.upcomingHeader}>
        Upcoming Due Dates
        <Link href="/workmap">
          <IconButton className={styles.upcomingButton}>
            <IoMdMap />
          </IconButton>
        </Link>
      </h4>

      <div className={styles.upcomingCardList}>
        {user ? (
          itemsList.map((item) => (
            <div
              key={item.id}
              className={
                item.due &&
                item.due.getTime() < new Date().getTime() + MILLISECSPERDAY
                  ? `${styles.upcomingCard} ${styles.dueSoon}`
                  : styles.upcomingCard
              }
            >
              <div className={styles.upcomingCardHeader}>
                <h4>{item.abbrev}</h4>
                <div>
                  <UpcomingDueDate time={item.due} />
                </div>
              </div>
              <div className={styles.upcomingCardBody}>
                <h4>{item.name}</h4>
                <p>{item.description}</p>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.upcomingEmpty}>
            Sign in with Google to see your upcoming due dates
          </div>
        )}
      </div>
    </div>
  );
};

const UpcomingDueDate = (props: { time: Date | null }) => {
  const time = props.time;
  if (!time) {
    return <>No Due Date</>;
  }
  if (time.getTime() >= new Date().getTime() + MILLISECSPERDAY) {
    const year = time.getFullYear();
    const month = time.getMonth() + 1;
    const day = time.getDate();
    return <>{`Due ${WEEKDAYS[time.getDay()]} ${month}/${day}/${year}`}</>;
  }
  return (
    <Countdown
      date={time}
      renderer={({ hours, minutes, seconds, completed }) => {
        if (completed) {
          return "Overdue!";
        } else if (hours > 0) {
          return "Due in " + hours + "hr " + minutes + "min";
        } else {
          return "Due in " + minutes + "min " + seconds + "sec";
        }
      }}
    />
  );
};

export default Upcoming;
