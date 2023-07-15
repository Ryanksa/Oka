import { initializeApp } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
  User,
  Unsubscribe,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  doc,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  where,
  getDocs,
  getDoc,
  DocumentReference,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import {
  WorkmapItem,
  WorkmapPath,
  WorkmapItemUpdate,
  WorkmapPathUpdate,
} from "./models/workmap";
import { Assistant, AssistantWithUrl } from "./models/assistant";
import { TakeABreak, BreakOption, HotSpringPalette } from "./models/takeABreak";
import {
  DEFAULT_WORKMAP_ITEMS,
  DEFAULT_WORKMAP_PATHS,
  DEFAULT_ASSISTANT,
  DEFAULT_TAKEABREAK,
} from "./stores";

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const firebaseApp = initializeApp(config);
const firebaseAuth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

let unsubItem: Unsubscribe | null = null;
let unsubPath: Unsubscribe | null = null;
let unsubAssistant: Unsubscribe | null = null;
let unsubTakeABreak: Unsubscribe | null = null;

let localStorageCallback: () => void = () => {};

export const setupFirebaseListeners = (
  setUserCallback: (user: User | null) => void,
  setItemsCallback: (items: WorkmapItem[]) => void,
  setPathsCallback: (paths: WorkmapPath[]) => void,
  setAssistantCallback: (assistant: AssistantWithUrl) => void,
  setTakeABreakCallback: (takeABreak: TakeABreak) => void
) => {
  const unsubAll = () => {
    if (unsubItem) {
      unsubItem();
      unsubItem = null;
    }
    if (unsubPath) {
      unsubPath();
      unsubPath = null;
    }
    if (unsubAssistant) {
      unsubAssistant();
      unsubAssistant = null;
    }
    if (unsubTakeABreak) {
      unsubTakeABreak();
      unsubTakeABreak = null;
    }
  };

  const unsubAuthState = onAuthStateChanged(firebaseAuth, (user) => {
    setUserCallback(user);
    if (user) {
      // Get workmap items data from firestore
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
              due: doc.data().due ? doc.data().due.toDate() : null,
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

      // Get workmap path data from firestore
      const pathsRef = collection(firestore, "workmap/" + user.uid + "/paths");
      unsubPath = onSnapshot(pathsRef, (qSnapshot) => {
        const pathList: WorkmapPath[] = [];
        qSnapshot.forEach((doc) => {
          pathList.push({
            id: doc.id,
            from: doc.data().from,
            to: doc.data().to,
            startDate: doc.data().startDate
              ? doc.data().startDate.toDate()
              : null,
            endDate: doc.data().endDate ? doc.data().endDate.toDate() : null,
          });
        });
        setPathsCallback(pathList);
      });

      // Get assistant data from firestore
      const assistantRef = doc(firestore, "assistant/" + user.uid);
      unsubAssistant = onSnapshot(assistantRef, (doc) => {
        const data = doc.data();
        if (!data) {
          return setAssistantCallback({ ...DEFAULT_ASSISTANT });
        }

        const assistant: AssistantWithUrl = {
          name: data.name,
          voiceCommand: data.voiceCommand,
          avatar: data.avatar,
          avatarUrl: "",
        };
        if (assistant.avatar === "") {
          return setAssistantCallback(assistant);
        }
        const imageRef = ref(storage, `${user.uid}/${data.avatar}`);
        getDownloadURL(imageRef)
          .then((imageUrl) => {
            assistant.avatarUrl = imageUrl;
            setAssistantCallback(assistant);
          })
          .catch(() => {
            assistant.avatar = "";
            assistant.avatarUrl = "";
            setAssistantCallback(assistant);
          });
      });

      // Get take a break data from firestore
      const takeABreakRef = doc(firestore, "takeABreak/" + user.uid);
      unsubTakeABreak = onSnapshot(takeABreakRef, (doc) => {
        const data = doc.data();
        const takeABreak: TakeABreak = { ...DEFAULT_TAKEABREAK };
        if (data) {
          takeABreak.breakOption = data.breakOption;
          takeABreak.hotSpringPalette = data.hotSpringPalette;
          takeABreak.bulletingTopScore = data.bulletingTopScore;
        }
        setTakeABreakCallback(takeABreak);
      });
    } else {
      // User's not logged in, unsubscribe to listeners
      unsubAll();

      // Get data from localStorage if exists
      localStorageCallback = () => {
        const workmapItems: WorkmapItem[] = [...DEFAULT_WORKMAP_ITEMS];
        const workmapPaths: WorkmapPath[] = [...DEFAULT_WORKMAP_PATHS];
        const assistant: AssistantWithUrl = { ...DEFAULT_ASSISTANT };
        const takeABreak: TakeABreak = { ...DEFAULT_TAKEABREAK };
        if (typeof window !== "undefined") {
          const assistantName = localStorage.getItem("assistantName");
          if (assistantName != null) {
            assistant.name = assistantName;
          }

          const voiceCommand = localStorage.getItem("voiceCommand");
          if (voiceCommand != null) {
            switch (voiceCommand) {
              case "true":
                assistant.voiceCommand = true;
                break;
              case "false":
              default:
                assistant.voiceCommand = false;
            }
          }

          const breakOption = localStorage.getItem("breakOption");
          if (breakOption != null) {
            switch (breakOption) {
              case BreakOption.hotspring:
              case BreakOption.mountainocean:
              case BreakOption.bulleting:
                takeABreak.breakOption = breakOption;
                break;
              default:
                takeABreak.breakOption = BreakOption.hotspring;
            }
          }

          const hotSpringPalette = localStorage.getItem("hotSpringPalette");
          if (hotSpringPalette != null) {
            switch (hotSpringPalette) {
              case HotSpringPalette.warm:
              case HotSpringPalette.lucid:
                takeABreak.hotSpringPalette = hotSpringPalette;
                break;
              default:
                takeABreak.hotSpringPalette = HotSpringPalette.warm;
            }
          }

          const bulletingTopScore = localStorage.getItem("bulletingTopScore");
          if (bulletingTopScore != null) {
            takeABreak.bulletingTopScore = +bulletingTopScore;
          }
        }
        setItemsCallback(workmapItems);
        setPathsCallback(workmapPaths);
        setAssistantCallback(assistant);
        setTakeABreakCallback(takeABreak);
      };
      localStorageCallback();
    }
  });

  // Return a callback to unsubscribe to all listeners
  return () => {
    unsubAuthState();
    unsubAll();
  };
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
  description: string,
  x: number,
  y: number
) => {
  const user = firebaseAuth.currentUser;
  if (!user) return;

  const itemsRef = collection(firestore, "workmap/" + user.uid + "/items");
  return addDoc(itemsRef, {
    name: name.length > 0 ? name : "Task",
    abbrev: abbrev.length > 0 ? abbrev : "TASK",
    due: due,
    description: description,
    x: x,
    y: y,
    focus: false,
  });
};

// handles updating an existing workmap item
export const updateItem = (itemId: string, update: WorkmapItemUpdate) => {
  const user = firebaseAuth.currentUser;
  if (!user) return;

  if (update.name && update.name.length === 0) update.name = "Task";
  if (update.abbrev && update.abbrev.length === 0) update.abbrev = "TASK";
  const itemsRef = collection(firestore, "workmap/" + user.uid + "/items");
  return updateDoc<WorkmapItemUpdate>(doc(itemsRef, itemId), update);
};

// handles deleting an existing workmap item
export const deleteItem = (itemId: string) => {
  const user = firebaseAuth.currentUser;
  if (!user) return;

  const itemsRef = collection(firestore, "workmap/" + user.uid + "/items");
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

  return Promise.all(deletePromises).then(() =>
    deleteDoc(doc(itemsRef, itemId))
  );
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
export const updatePath = (pathId: string, update: WorkmapPathUpdate) => {
  const user = firebaseAuth.currentUser;
  if (!user) return;

  const pathsRef = collection(firestore, "workmap/" + user.uid + "/paths");
  return updateDoc<WorkmapPathUpdate>(doc(pathsRef, pathId), update);
};

// handles deleting an existing workmap path
export const deletePath = (pathId: string) => {
  const user = firebaseAuth.currentUser;
  if (!user) return;

  const pathsRef = collection(firestore, "workmap/" + user.uid + "/paths");
  return deleteDoc(doc(pathsRef, pathId));
};

// handles creating/updating user's assistant object
export const updateAssistant = (assistant: Assistant) => {
  const user = firebaseAuth.currentUser;
  if (!user) {
    if (typeof window !== "undefined") {
      localStorage.setItem("assistantName", assistant.name);
      localStorage.setItem("voiceCommand", "" + assistant.voiceCommand);
      localStorageCallback();
    }
    return;
  }

  const docRef = doc(firestore, "assistant", user.uid);
  return setDoc(docRef, {
    avatar: assistant.avatar,
    name: assistant.name,
    voiceCommand: assistant.voiceCommand,
  });
};

// handles updating user's assistant avatar image
export const updateAssistantImage = (file: File | null) => {
  const user = firebaseAuth.currentUser;
  if (!user) return;

  if (file && !file.type.startsWith("image/")) {
    return;
  }

  const docRef = doc(firestore, "assistant", user.uid);
  getDoc(docRef).then((doc) => {
    if (doc.exists() && doc.data().avatar) {
      const filePath = `${user.uid}/${doc.data().avatar}`;
      const oldImageRef = ref(storage, filePath);
      deleteObject(oldImageRef);
    }
  });

  if (file) {
    const fileName = `${new Date().getTime()}_${file.name}`;
    const imageRef = ref(storage, `${user.uid}/${fileName}`);
    return uploadBytes(imageRef, file).then(() => fileName);
  }
  return Promise.resolve("");
};

export const createTakeABreakIfNotExist = (docRef: DocumentReference) => {
  return getDoc(docRef).then((doc) => {
    if (!doc.exists()) {
      return setDoc(docRef, { ...DEFAULT_TAKEABREAK });
    }
  });
};

export const updateTakeABreakOption = (option: BreakOption) => {
  const user = firebaseAuth.currentUser;
  if (!user) {
    if (typeof window !== "undefined") {
      localStorage.setItem("breakOption", option);
      localStorageCallback();
    }
    return;
  }

  const docRef = doc(firestore, "takeABreak", user.uid);
  return createTakeABreakIfNotExist(docRef).then(() => {
    updateDoc(docRef, {
      breakOption: option,
    });
  });
};

export const updateHotSpringPalette = (palette: HotSpringPalette) => {
  const user = firebaseAuth.currentUser;
  if (!user) {
    if (typeof window !== "undefined") {
      localStorage.setItem("hotSpringPalette", palette);
      localStorageCallback();
    }
    return;
  }

  const docRef = doc(firestore, "takeABreak", user.uid);
  return createTakeABreakIfNotExist(docRef).then(() => {
    updateDoc(docRef, {
      hotSpringPalette: palette,
    });
  });
};

export const updateBulletingTopScore = (score: number) => {
  const user = firebaseAuth.currentUser;
  if (!user) {
    if (typeof window !== "undefined") {
      localStorage.setItem("bulletingTopScore", "" + score);
      localStorageCallback();
    }
    return;
  }

  const docRef = doc(firestore, "takeABreak", user.uid);
  return createTakeABreakIfNotExist(docRef).then(() => {
    updateDoc(docRef, {
      bulletingTopScore: score,
    });
  });
};
