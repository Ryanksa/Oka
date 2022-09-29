import React, { useEffect } from "react";
import { setupFirebaseListeners } from "../firebase";
import {
  userStore,
  workmapStore,
  assistantStore,
  takeABreakStore,
} from "../stores";

const FirebaseHandler = () => {
  useEffect(() => {
    const unsubscribe = setupFirebaseListeners(
      (user) => {
        userStore.setUser(user);
      },
      (items) => {
        workmapStore.setItems(items);
      },
      (paths) => {
        workmapStore.setPaths(paths);
      },
      (assistant) => {
        assistantStore.setAssistant(assistant);
      },
      (takeABreak) => {
        takeABreakStore.setTakeABreak(takeABreak);
      }
    );
    return unsubscribe;
  }, []);

  return <></>;
};

export default FirebaseHandler;
