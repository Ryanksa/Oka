import React, { useContext, useEffect } from "react";
import { setupFirebaseListeners } from "../firebase";
import { UserContext, WorkmapContext, AssistantContext } from "../contexts";

const FirebaseHandler = () => {
  const userContext = useContext(UserContext);
  const workmapContext = useContext(WorkmapContext);
  const assistantContext = useContext(AssistantContext);

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
      }
    );
    return unsubscribe;
  }, []);

  return <></>;
};

export default FirebaseHandler;
