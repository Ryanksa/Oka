import { useEffect } from "react";
import { setupFirebaseListeners } from "../firebase";
import {
  userStore,
  workmapItemsStore,
  workmapPathsStore,
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
        workmapItemsStore.setItems(items);
      },
      (paths) => {
        workmapPathsStore.setPaths(paths);
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
