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
} from "firebase/firestore";
import store from "./redux/store";
import * as actions from "./redux/actions";

const config = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

const firebaseApp = initializeApp(config);
export const firebaseAuth = getAuth(firebaseApp);
export const firestore = getFirestore(firebaseApp);

// listens for updates from firebase and update redux accordingly
let unsubItem = null;
let unsubPath = null;
onAuthStateChanged(firebaseAuth, (user) => {
  store.dispatch({
    type: actions.SET_USER,
    payload: { user },
  });

  if (user) {
    const itemsRef = collection(firestore, "workmap/" + user.uid + "/items");
    const q = query(itemsRef, orderBy("due"));
    unsubItem = onSnapshot(q, (qSnapshot) => {
      const itemList = [];
      const nullDueList = [];
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
      store.dispatch({
        type: actions.SET_ITEMS,
        payload: { items: itemList.concat(nullDueList) },
      });
    });

    const pathsRef = collection(firestore, "workmap/" + user.uid + "/paths");
    unsubPath = onSnapshot(pathsRef, (qSnapshot) => {
      const pathList = [];
      qSnapshot.forEach((doc) => {
        pathList.push({
          id: doc.id,
          from: doc.data().from,
          to: doc.data().to,
          startDate: doc.data().startDate,
          endDate: doc.data().endDate,
        });
      });
      store.dispatch({
        type: actions.SET_PATHS,
        payload: { paths: pathList },
      });
    });
  } else {
    if (unsubItem) {
      unsubItem();
      unsubItem = null;
    }
    store.dispatch({
      type: actions.SET_ITEMS,
      payload: { items: [] },
    });

    if (unsubPath) {
      unsubPath();
      unsubPath = null;
    }
    store.dispatch({
      type: actions.SET_PATHS,
      payload: { paths: [] },
    });
  }
});

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
export const addItem = (name, abbrev, due, description) => {
  const user = store.getState().user;
  if (!user) return;

  const itemsRef = collection(firestore, "workmap/" + user.uid + "/items");
  return addDoc(itemsRef, {
    name: name.length > 0 ? name : "Task",
    abbrev: abbrev.length > 0 ? abbrev : "TASK",
    due: due,
    description: description,
    x: Math.floor(Math.random() * 1600),
    y: Math.floor(Math.random() * 900),
    focus: false,
  });
};

// handles updating an existing workmap item
export const updateItem = (itemId, update) => {
  const user = store.getState().user;
  if (!user) return;

  if (update.name && update.name.length === 0) update.name = "Task";
  if (update.abbrev && update.abbrev.length === 0) update.abbrev = "TASK";
  const itemsRef = collection(firestore, "workmap/" + user.uid + "/items");
  return updateDoc(doc(itemsRef, itemId), update);
};

// handles deleting an existing workmap item
export const deleteItem = (itemId) => {
  const user = store.getState().user;
  if (!user) return;

  const itemsRef = collection(firestore, "workmap/" + user.uid + "/items");
  return deleteDoc(doc(itemsRef, itemId)).then(() => {
    const deletePaths = store
      .getState()
      .paths.filter((path) => path.from === itemId || path.to === itemId);
    const deletePromises = [];
    const pathsRef = collection(firestore, "workmap/" + user.uid + "/paths");
    for (let i = 0; i < deletePaths.length; i++) {
      deletePromises.push(deleteDoc(doc(pathsRef, deletePaths[i].id)));
    }
    return Promise.all(deletePromises);
  });
};

// handles creating a new workmap path
export const addPath = (fromId, toId) => {
  const user = store.getState().user;
  if (!user) return;
  if (
    store
      .getState()
      .paths.filter((path) => path.from === fromId && path.to === toId).length >
    0
  )
    return;

  const pathsRef = collection(firestore, "workmap/" + user.uid + "/paths");
  return addDoc(pathsRef, {
    from: fromId,
    to: toId,
    startDate: null,
    endDate: null,
  });
};

// handles updating an existing workmap path
export const updatePath = (pathId, update) => {
  const user = store.getState().user;
  if (!user) return;

  const pathsRef = collection(firestore, "workmap/" + user.uid + "/paths");
  return updateDoc(doc(pathsRef, pathId), update);
};

// handles deleting an existing workmap path
export const deletePath = (pathId) => {
  const user = store.getState().user;
  if (!user) return;

  const pathsRef = collection(firestore, "workmap/" + user.uid + "/paths");
  return deleteDoc(doc(pathsRef, pathId));
};
