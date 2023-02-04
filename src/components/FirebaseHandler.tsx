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
        userStore.setValue(user);
      },
      (items) => {
        workmapItemsStore.setValue(items);
      },
      (paths) => {
        workmapPathsStore.setValue(paths);
      },
      (assistant) => {
        assistantStore.setValue(assistant);
      },
      (takeABreak) => {
        takeABreakStore.setValue(takeABreak);
      }
    );
    return unsubscribe;
  }, []);

  return <></>;
};

export default FirebaseHandler;
