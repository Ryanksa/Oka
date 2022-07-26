import React, { useContext, useState, useEffect } from "react";
import styles from "../styles/Upcoming.module.scss";

import {
  UserContext,
  WorkmapContext,
  addUserContextListener,
  removeUserContextListener,
  addWorkmapContextListener,
  removeWorkmapContextListener,
} from "../contexts";
import { deleteItem } from "../firebase";

import Link from "next/link";
import Button from "@mui/material/Button";
import Countdown from "react-countdown";

export const formatUpcomingDueDate = (time: Date | null) => {
  const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  if (!time) {
    return <>No Due Date</>;
  } else if (time.getTime() >= new Date().getTime() + 86400000) {
    const year = time.getFullYear();
    const month = time.getMonth() + 1;
    const day = time.getDate();
    return <>{`Due ${weekdays[time.getDay()]} ${month}/${day}/${year}`}</>;
  } else {
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
  }
};

const Upcoming = () => {
  const userContext = useContext(UserContext);
  const workmapContext = useContext(WorkmapContext);

  const [user, setUser] = useState(userContext.user);
  const [itemsList, setItemsList] = useState(workmapContext.items);

  useEffect(() => {
    const setUserCallback = () => {
      setUser(userContext.user);
    };
    const setItemsCallback = () => {
      setItemsList(workmapContext.items);
    };

    addUserContextListener(setUserCallback);
    addWorkmapContextListener(setItemsCallback);

    return () => {
      removeUserContextListener(setUserCallback);
      removeWorkmapContextListener(setItemsCallback);
    };
  }, []);

  useEffect(() => {
    // style the cards for the item list
    const cardList = document.querySelectorAll(
      `.${styles.upcomingCard}`
    ) as NodeListOf<HTMLElement>;
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
        <Link href="/workmap" passHref>
          <Button
            variant="contained"
            color="primary"
            className={styles.upcomingButton}
          >
            WorkMap
          </Button>
        </Link>
      </h4>

      <div className={styles.upcomingCardList}>
        {user ? (
          itemsList.length > 0 ? (
            itemsList.map((item) => (
              <div
                key={item.id}
                className={
                  item.due &&
                  item.due.getTime() < new Date().getTime() + 86400000
                    ? `${styles.upcomingCard} ${styles.dueSoon}`
                    : styles.upcomingCard
                }
              >
                <div className={styles.upcomingCardHeader}>
                  <h4>{item.abbrev}</h4>
                  <div>{formatUpcomingDueDate(item.due)}</div>
                </div>
                <div className={styles.upcomingCardBody}>
                  <h4>{item.name}</h4>
                  <p>{item.description}</p>
                  <Button
                    variant="contained"
                    color="secondary"
                    className={styles.upcomingCardButton}
                    onClick={() => deleteItem(item.id)}
                  >
                    Done
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.upcomingEmpty}>
              You have no upcoming due dates
            </div>
          )
        ) : (
          <div className={styles.upcomingEmpty}>
            Sign in with Google to see your upcoming due dates
          </div>
        )}
      </div>
    </div>
  );
};

export default Upcoming;
