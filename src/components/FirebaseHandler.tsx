import React, { useContext, useEffect } from "react";
import { setupFirebaseListeners } from "../firebase";
import {
  UserContext,
  WorkmapContext,
  AssistantContext,
  TakeABreakContext,
} from "../contexts";

const FirebaseHandler = () => {
  const userContext = useContext(UserContext);
  const workmapContext = useContext(WorkmapContext);
  const assistantContext = useContext(AssistantContext);
  const takeABreakContext = useContext(TakeABreakContext);

  useEffect(() => {
    const unsubscribe = setupFirebaseListeners(
      (user) => {
        userContext.setUser(user);
      },
      (items) => {
        workmapContext.setItems(items);
      },
      (paths) => {
        workmapContext.setPaths(paths);
      },
      (assistant) => {
        assistantContext.setAssistant(assistant);
      },
      (takeABreak) => {
        takeABreakContext.setTakeABreak(takeABreak);
      }
    );
    return unsubscribe;
  }, []);

  return <></>;
};

export default FirebaseHandler;
