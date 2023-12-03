import { useEffect } from "react";
import { setupFirebaseListeners } from "../firebase";
import store from "../store";

const FirebaseHandler = () => {
  useEffect(() => {
    const unsubscribe = setupFirebaseListeners(
      (user) => {
        store.user.value = user;
      },
      (items) => {
        store.workmapItems.value = items;
      },
      (paths) => {
        store.workmapPaths.value = paths;
      },
      (assistant) => {
        store.assistant.value = assistant;
      },
      (takeABreak) => {
        store.takeABreak.value = takeABreak;
      }
    );
    return unsubscribe;
  }, []);

  return <></>;
};

export default FirebaseHandler;
