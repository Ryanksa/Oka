import { useState, useEffect, useRef, useSyncExternalStore } from "react";
import styles from "../../src/styles/Workmap.module.scss";
import itemStyles from "../../src/styles/WorkmapItem.module.scss";
import OkaHead from "../../src/components/OkaHead";
import WorkmapItemComponent from "../../src/components/WorkmapItem";
import WorkmapPathComponent from "../../src/components/WorkmapPath";
import WorkmapModal from "../../src/components/WorkmapModal";
import SelectingArrow from "../../src/components/SelectingArrow";
import { addItem, updateItem, deleteItem, addPath } from "../../src/firebase";
import {
  userStore,
  workmapItemsStore,
  workmapPathsStore,
} from "../../src/stores";
import { WorkmapItem } from "../../src/models/workmap";
import { useXarrow } from "react-xarrows";
import { IoMdAddCircle } from "react-icons/io";

const ITEM_WIDTH = 270;
const RAND_X_RANGE = 1200;
const RAND_Y_RANGE = 600;

const Workmap = () => {
  const user = useSyncExternalStore(
    userStore.subscribe,
    userStore.getSnapshot,
    userStore.getServerSnapshot
  );
  const itemsList = useSyncExternalStore(
    workmapItemsStore.subscribe,
    workmapItemsStore.getSnapshot,
    workmapItemsStore.getServerSnapshot
  );
  const pathsList = useSyncExternalStore(
    workmapPathsStore.subscribe,
    workmapPathsStore.getSnapshot,
    workmapPathsStore.getServerSnapshot
  );

  // Map interactions
  const workmapRef = useRef<HTMLDivElement>(null);
  const [clickedPos, setClickedPos] = useState<[number, number] | null>(null);
  const [pathFrom, setPathFrom] = useState<string | null>(null);

  // Drag and drop
  const [draggingItem, setDraggingItem] = useState<HTMLDivElement | null>(null);
  const dragXOffset = useRef(0);
  const dragYOffset = useRef(0);

  // Item creation
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [currItem, setCurrItem] = useState<WorkmapItem | null>(null);

  // Path selection
  const [selectingPathFrom, setSelectingPathFrom] = useState<string>("");
  const selectingEndpoint = useRef<HTMLDivElement>(null);
  const updateXarrow = useXarrow();

  // Make workmap items draggable
  useEffect(() => {
    if (!user) return;

    const mouseDownCallbacks: {
      domItem: HTMLDivElement;
      callback: (event: MouseEvent) => void;
    }[] = [];

    itemsList.forEach((item) => {
      const domItem = document.getElementById(item.id) as HTMLDivElement;
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
          // -2 to get rid of 'px'
          x: Math.round(+draggingItem.style.left.slice(0, -2)),
          y: Math.round(+draggingItem.style.top.slice(0, -2)),
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

  // Workmap path selection mouse tracking
  useEffect(() => {
    const mouseMoveCallback = (event: MouseEvent) => {
      if (!selectingEndpoint.current) return;
      selectingEndpoint.current.style.left = `${
        event.clientX + window.pageXOffset
      }px`;
      selectingEndpoint.current.style.top = `${
        event.clientY + window.pageYOffset
      }px`;
    };
    document.addEventListener("mousemove", mouseMoveCallback);

    return () => {
      document.removeEventListener("mousemove", mouseMoveCallback);
    };
  }, []);

  const enterItemCreation = () => {
    setCurrItem(null);
    setModalOpen(true);
  };

  const enterPathSelection = (fromId: string) => {
    const selectableItems = document.querySelectorAll(
      `.${itemStyles.workmapItem}:not(#${CSS.escape(fromId)})`
    ) as NodeListOf<HTMLDivElement>;

    // draw the selecting line
    setSelectingPathFrom(fromId);
    const mouseMoveCallback = () => updateXarrow();
    document.addEventListener("mousemove", mouseMoveCallback);

    // function to clean up after path selection finishes
    const exitPathSelection = () => {
      document.removeEventListener("mousemove", mouseMoveCallback);
      document.onclick = null;
      setSelectingPathFrom("");
      selectableItems.forEach((item) => {
        item.classList.remove(itemStyles.selectable);
      });
    };

    // for each selectable item, add selectable class
    selectableItems.forEach((item) => {
      item.classList.add(itemStyles.selectable);
    });

    // setTimeout 0 to prevent this onclick from firing immediately
    setTimeout(() => {
      document.onclick = (event) => {
        if (event.target === workmapRef.current) {
          setPathFrom(fromId);
        } else {
          selectableItems.forEach((item) => {
            if (event.target === item) {
              event.stopPropagation();
              addPath(fromId, item.id);
            }
          });
        }
        exitPathSelection();
      };
    }, 0);
  };

  const saveItem = async (
    name: string,
    abbrev: string,
    due: Date | null,
    description: string
  ) => {
    if (!user) return;

    if (!currItem) {
      const x = clickedPos
        ? clickedPos[0]
        : Math.floor(Math.random() * RAND_X_RANGE);
      const y = clickedPos
        ? clickedPos[1]
        : Math.floor(Math.random() * RAND_Y_RANGE);

      const item = await addItem(name, abbrev, due, description, x, y);
      if (pathFrom && item) {
        await addPath(pathFrom, item.id);
      }
    } else {
      await updateItem(currItem.id, { name, abbrev, due, description });
    }
  };

  return (
    <>
      <OkaHead title="Workmap" />
      <div
        ref={workmapRef}
        className={styles.workmapContainer}
        onClick={
          user
            ? (event) => {
                if (event.target !== workmapRef.current) return;
                setClickedPos([event.clientX - ITEM_WIDTH / 2, event.clientY]);
                enterItemCreation();
              }
            : undefined
        }
      >
        <header className={styles.workmapHeader}>
          <h2>Workmap</h2>
          {user && (
            <IoMdAddCircle
              className={styles.workmapAddIcon}
              onClick={() => {
                setClickedPos(null);
                enterItemCreation();
              }}
            />
          )}
        </header>
        {user && (
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
            <div ref={selectingEndpoint} className={styles.selectingEndpoint} />
            <SelectingArrow
              selectingFrom={selectingPathFrom}
              selectingTo={selectingEndpoint}
            />
            <WorkmapModal
              isModalOpen={modalOpen}
              closeModal={() => {
                setModalOpen(false);
                setPathFrom(null);
              }}
              currItem={currItem}
              saveItem={saveItem}
              deleteItem={deleteItem}
            />
          </>
        )}
        {!user && (
          <div className={styles.notSignedIn}>
            <div className={styles.notSignedInOverlay}>
              <p>Sign in to use Workmap</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Workmap;
