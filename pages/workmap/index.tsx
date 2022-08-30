import React, { useContext, useState, useEffect, useRef } from "react";
import styles from "../../src/styles/Workmap.module.scss";

import WorkmapItemComponent from "../../src/components/WorkmapItem";
import WorkmapPathComponent from "../../src/components/WorkmapPath";
import WorkmapModal from "../../src/components/WorkmapModal";

import { addItem, updateItem, deleteItem, addPath } from "../../src/firebase";
import {
  UserContext,
  WorkmapContext,
  addUserContextListener,
  removeUserContextListener,
  addWorkmapContextListener,
  removeWorkmapContextListener,
} from "../../src/contexts";

import Xarrow, { useXarrow } from "react-xarrows";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DialogContent from "@mui/material/DialogContent";
import Modal from "@mui/material/Modal";
import theme from "../../src/theme";
import { WorkmapItem } from "../../src/models/workmap";

// 16px offset from .workmapContainer
const WORKMAP_X_OFFSET = 16;
// 88px offset from .workmapHeader
const WORKMAP_Y_OFFSET = 88;

const SELECTING_PATH_COLOUR = theme.palette.info.light;

const Workmap = () => {
  const userContext = useContext(UserContext);
  const workmapContext = useContext(WorkmapContext);
  const [user, setUser] = useState(userContext.user);
  const [itemsList, setItemsList] = useState(workmapContext.items);
  const [pathsList, setPathsList] = useState(workmapContext.paths);

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [currItem, setCurrItem] = useState<WorkmapItem | null>(null);

  const [draggingItem, setDraggingItem] = useState<HTMLElement | null>(null);
  const [selectingPathFrom, setSelectingPathFrom] = useState<string>("");
  const dragXOffset = useRef(0);
  const dragYOffset = useRef(0);
  const updateXarrow = useXarrow();

  useEffect(() => {
    const userCallback = () => {
      setUser(userContext.user);
    };
    const workmapCallback = () => {
      setItemsList(workmapContext.items);
      setPathsList(workmapContext.paths);
    };
    addUserContextListener(userCallback);
    addWorkmapContextListener(workmapCallback);

    return () => {
      removeUserContextListener(userCallback);
      removeWorkmapContextListener(workmapCallback);
    };
  }, []);

  // make workmap items draggable
  useEffect(() => {
    if (!user) return;

    const mouseDownCallbacks: {
      domItem: HTMLElement;
      callback: (event: MouseEvent) => void;
    }[] = [];
    itemsList.forEach((item) => {
      const domItem = document.getElementById(item.id) as HTMLElement;
      const callback = (event: MouseEvent) => {
        setDraggingItem(domItem);
        dragXOffset.current = event.clientX - +domItem.style.left.slice(0, -2);
        dragYOffset.current = event.clientY - +domItem.style.top.slice(0, -2);
      };
      domItem.addEventListener("mousedown", callback);
      mouseDownCallbacks.push({ domItem, callback });
    });

    return () => {
      mouseDownCallbacks.forEach(({ domItem, callback }) => {
        domItem.removeEventListener("mousedown", callback);
      });
    };
  }, [user, itemsList]);

  // Drag and drop workmap item logic
  useEffect(() => {
    const dragItem = (event: MouseEvent) => {
      if (draggingItem) {
        draggingItem.style.left = `${event.clientX - dragXOffset.current}px`;
        draggingItem.style.top = `${event.clientY - dragYOffset.current}px`;
        updateXarrow();
      }
    };

    const dropItem = () => {
      if (draggingItem) {
        updateItem(draggingItem.id, {
          x: Math.round(+draggingItem.style.left.slice(0, -2)), // -2 to get rid of 'px'
          y: Math.round(+draggingItem.style.top.slice(0, -2)), // -2 to get rid of 'px'
        });
        setDraggingItem(null);
      }
    };

    document.addEventListener("mousemove", dragItem);
    document.addEventListener("mouseup", dropItem);

    return () => {
      document.removeEventListener("mousemove", dragItem);
      document.removeEventListener("mouseup", dropItem);
    };
  }, [draggingItem, updateXarrow]);

  // handles path selection
  const enterPathSelection = (fromId: string) => {
    const selectingPoint = document.getElementById(
      styles.selectingEndpoint
    ) as HTMLElement;
    const selectableItems = document.querySelectorAll(
      `.${styles.workmapItem}:not(#${CSS.escape(fromId)})`
    ) as NodeListOf<HTMLElement>;

    // draw the selecting line
    setSelectingPathFrom(fromId);
    const mouseMoveCallback = (event: MouseEvent) => {
      selectingPoint.style.left = `${
        event.clientX - WORKMAP_X_OFFSET + window.pageXOffset
      }px`;
      selectingPoint.style.top = `${
        event.clientY - WORKMAP_Y_OFFSET + window.pageYOffset
      }px`;
      updateXarrow();
    };
    document.addEventListener("mousemove", mouseMoveCallback);

    const itemClickCallbacks: {
      item: HTMLElement;
      callback: (event: MouseEvent) => void;
    }[] = [];

    // teardown function for path selection
    const exitPathSelection = () => {
      document.removeEventListener("mousemove", mouseMoveCallback);
      document.onclick = null;
      setSelectingPathFrom("");
      itemClickCallbacks.forEach(({ item, callback }) => {
        item.classList.remove(styles.selectable);
        item.removeEventListener("click", callback);
      });
    };

    // for each selectable item, setup class and onclick function to create a new path
    selectableItems.forEach((item) => {
      item.classList.add(styles.selectable);
      const callback = (event: MouseEvent) => {
        event.stopPropagation();
        addPath(fromId, item.id);
        exitPathSelection();
      };
      item.addEventListener("click", callback);
      itemClickCallbacks.push({ item, callback });
    });

    // if user clicks anywhere else on the page, also exit selecting
    // setTimeout 0 is used to prevent this onclick from firing immediately
    setTimeout(() => {
      document.onclick = () => {
        exitPathSelection();
      };
    }, 0);
  };

  const saveItem = (
    name: string,
    abbrev: string,
    due: Date | null,
    description: string
  ) => {
    if (!user) return;
    if (currItem) {
      return updateItem(currItem.id, { name, abbrev, due, description });
    } else {
      return addItem(name, abbrev, due, description);
    }
  };

  return (
    <div className={styles.workmapContainer}>
      <header className={styles.workmapHeader}>
        <h2>Workmap</h2>
        {user && (
          <AddCircleIcon
            fontSize="large"
            className={styles.workmapAddIcon}
            onClick={() => {
              setCurrItem(null);
              setModalOpen(true);
            }}
          />
        )}
      </header>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <DialogContent>
          <WorkmapModal
            closeModal={() => setModalOpen(false)}
            currItem={currItem}
            saveItem={saveItem}
            deleteItem={deleteItem}
          />
        </DialogContent>
      </Modal>

      <div
        className={`${styles.workmapContent} ${user ? "" : styles.notSignedIn}`}
      >
        {user ? (
          <>
            {itemsList.map((item) => (
              <WorkmapItemComponent
                key={item.id}
                item={item}
                onEdit={() => {
                  setCurrItem(item);
                  setModalOpen(true);
                }}
                enterSelecting={enterPathSelection}
              />
            ))}
            {pathsList.map((path) => (
              <WorkmapPathComponent key={path.id} path={path} />
            ))}
            <div id={styles.selectingEndpoint}></div>
            <Xarrow
              start={selectingPathFrom}
              end={styles.selectingEndpoint}
              strokeWidth={5.5}
              color={SELECTING_PATH_COLOUR}
              dashness={{ strokeLen: 20, nonStrokeLen: 10, animation: true }}
              showXarrow={selectingPathFrom !== ""}
            />
          </>
        ) : (
          <div className={styles.notSignedInOverlay}>
            <p>Sign in to use Workmap</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Workmap;
