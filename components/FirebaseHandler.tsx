import React, { useContext, useEffect } from "react";
import { setupFirebaseListeners } from "../firebase";
import { UserContext, WorkmapContext } from "../contexts";

const FirebaseHandler = () => {
  const userContext = useContext(UserContext);
  const workmapContext = useContext(WorkmapContext);

  useEffect(() => {
    setupFirebaseListeners(
      (user) => {
        userContext.setUser(user);
      },
      (items) => {
        workmapContext.setItems(items);
      },
      (paths) => {
        workmapContext.setPaths(paths);
      }
    );
  }, []);

  return <></>;
};

export default FirebaseHandler;
