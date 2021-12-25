import { initializeApp } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  doc,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  where,
  getDocs,
} from "firebase/firestore";

import { User, Unsubscribe } from "firebase/auth";
import { WorkmapItem, WorkmapPath } from "./models/workmap";

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const firebaseApp = initializeApp(config);
export const firebaseAuth = getAuth(firebaseApp);
export const firestore = getFirestore(firebaseApp);

let unsubItem: Unsubscribe | null = null;
let unsubPath: Unsubscribe | null = null;

export const setupFirebaseListeners = (
  setUserCallback: (user: User | null) => void,
  setItemsCallback: (items: WorkmapItem[]) => void,
  setPathsCallback: (paths: WorkmapPath[]) => void
) => {
  onAuthStateChanged(firebaseAuth, (user) => {
    setUserCallback(user);

    if (user) {
      const itemsRef = collection(firestore, "workmap/" + user.uid + "/items");
      const q = query(itemsRef, orderBy("due"));
      unsubItem = onSnapshot(q, (qSnapshot) => {
        const itemList: WorkmapItem[] = [];
        const nullDueList: WorkmapItem[] = [];
        qSnapshot.forEach((doc) => {
          if (doc.data().due) {
            itemList.push({
              id: doc.id,
              name: doc.data().name,
              abbrev: doc.data().abbrev,
              due: doc.data().due.toDate(),
              description: doc.data().description,
              x: doc.data().x,
              y: doc.data().y,
              focus: doc.data().focus,
            });
          } else {
            nullDueList.push({
              id: doc.id,
              name: doc.data().name,
              abbrev: doc.data().abbrev,
              due: null,
              description: doc.data().description,
              x: doc.data().x,
              y: doc.data().y,
              focus: doc.data().focus,
            });
          }
        });
        setItemsCallback(itemList.concat(nullDueList));
      });

      const pathsRef = collection(firestore, "workmap/" + user.uid + "/paths");
      unsubPath = onSnapshot(pathsRef, (qSnapshot) => {
        const pathList: WorkmapPath[] = [];
        qSnapshot.forEach((doc) => {
          pathList.push({
            id: doc.id,
            from: doc.data().from,
            to: doc.data().to,
            startDate: doc.data().startDate.toDate(),
            endDate: doc.data().endDate.toDate(),
          });
        });
        setPathsCallback(pathList);
      });
    } else {
      if (unsubItem) {
        unsubItem();
        unsubItem = null;
      }
      setItemsCallback([]);

      if (unsubPath) {
        unsubPath();
        unsubPath = null;
      }
      setPathsCallback([]);
    }
  });
};

// handles signing in with Google OAuth
export const signInWithGoogle = () => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(firebaseAuth, provider);
};

// handles signing out
export const signOutOfGoogle = () => {
  signOut(firebaseAuth);
};

// handles adding a new workmap item
export const addItem = (
  name: string,
  abbrev: string,
  due: Date | null,
  description: string
) => {
  const user = firebaseAuth.currentUser;
  if (!user) return;

  const itemsRef = collection(firestore, "workmap/" + user.uid + "/items");
  return addDoc(itemsRef, {
    name: name.length > 0 ? name : "Task",
    abbrev: abbrev.length > 0 ? abbrev : "TASK",
    due: due,
    description: description,
    x: Math.floor(Math.random() * 1366),
    y: Math.floor(Math.random() * 768),
    focus: false,
  });
};

// handles updating an existing workmap item
export const updateItem = (itemId: string, update: any) => {
  const user = firebaseAuth.currentUser;
  if (!user) return;

  if (update.name && update.name.length === 0) update.name = "Task";
  if (update.abbrev && update.abbrev.length === 0) update.abbrev = "TASK";
  const itemsRef = collection(firestore, "workmap/" + user.uid + "/items");
  return updateDoc(doc(itemsRef, itemId), update);
};

// handles deleting an existing workmap item
export const deleteItem = (itemId: string) => {
  const user = firebaseAuth.currentUser;
  if (!user) return;

  const itemsRef = collection(firestore, "workmap/" + user.uid + "/items");
  return deleteDoc(doc(itemsRef, itemId)).then(() => {
    const pathsRef = collection(firestore, "workmap/" + user.uid + "/paths");

    const fromQuery = query(pathsRef, where("from", "==", itemId));
    const toQuery = query(pathsRef, where("to", "==", itemId));

    const deletePromises = [];
    deletePromises.push(
      getDocs(fromQuery).then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          deleteDoc(doc.ref);
        });
      })
    );
    deletePromises.push(
      getDocs(toQuery).then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          deleteDoc(doc.ref);
        });
      })
    );

    return Promise.all(deletePromises);
  });
};

// handles creating a new workmap path
export const addPath = (fromId: string, toId: string) => {
  const user = firebaseAuth.currentUser;
  if (!user) return;

  const pathsRef = collection(firestore, "workmap/" + user.uid + "/paths");
  const q = query(
    pathsRef,
    where("from", "==", fromId),
    where("to", "==", toId)
  );

  return getDocs(q).then((querySnapshot) => {
    if (querySnapshot.empty) {
      return addDoc(pathsRef, {
        from: fromId,
        to: toId,
        startDate: null,
        endDate: null,
      });
    }
  });
};

// handles updating an existing workmap path
export const updatePath = (pathId: string, update: any) => {
  const user = firebaseAuth.currentUser;
  if (!user) return;

  const pathsRef = collection(firestore, "workmap/" + user.uid + "/paths");
  return updateDoc(doc(pathsRef, pathId), update);
};

// handles deleting an existing workmap path
export const deletePath = (pathId: string) => {
  const user = firebaseAuth.currentUser;
  if (!user) return;

  const pathsRef = collection(firestore, "workmap/" + user.uid + "/paths");
  return deleteDoc(doc(pathsRef, pathId));
};
