import { useEffect, useRef } from "react";
import styles from "../../src/styles/Workmap.module.scss";
import itemStyles from "../../src/styles/WorkmapItem.module.scss";
import OkaHead from "../../src/components/OkaHead";
import WorkmapItemComponent from "../../src/components/WorkmapItem";
import WorkmapPathComponent from "../../src/components/WorkmapPath";
import WorkmapModal from "../../src/components/WorkmapModal";
import SelectingArrow from "../../src/components/SelectingArrow";
import { addItem, updateItem, deleteItem, addPath } from "../../src/firebase";
import store from "../../src/store";
import { WorkmapItem } from "../../src/models/workmap";
import { useXarrow } from "react-xarrows";
import { IoMdAddCircle } from "react-icons/io";
import { useSignal } from "@preact/signals-react";

const ITEM_WIDTH = 318;
const ITEM_HEIGHT = 149; // minimum item height with no content
const RAND_X_RANGE = 1200;
const RAND_Y_RANGE = 600;

const Workmap = () => {
  const user = store.user.value;
  const itemsList = store.workmapItems.value;
  const pathsList = store.workmapPaths.value;

  // Map interactions
  const workmapRef = useRef<HTMLDivElement>(null);
  const clickedPos = useSignal<[number, number] | null>(null);
  const pathFrom = useSignal<string | null>(null);

  // Drag and drop
  const draggingItem = useSignal<HTMLDivElement | null>(null);
  const dragXOffset = useRef(0);
  const dragYOffset = useRef(0);

  // Item creation
  const modalOpen = useSignal<boolean>(false);
  const currItem = useSignal<WorkmapItem | null>(null);

  // Path selection
  const selectingPathFrom = useSignal<string>("");
  const selectingEndpoint = useRef<HTMLDivElement>(null);
  const updateXarrow = useXarrow();

  // Make workmap items draggable
  useEffect(() => {
    if (!user) return;

    const mouseDownCallbacks: {
      domItem: HTMLDivElement;
      callback: (event: MouseEvent) => void;
    }[] = [];
    const touchDownCallbacks: {
      domItem: HTMLDivElement;
      callback: (event: TouchEvent) => void;
    }[] = [];

    itemsList.forEach((item) => {
      const domItem = document.getElementById(item.id) as HTMLDivElement;

      const mouseCallback = (event: MouseEvent) => {
        draggingItem.value = domItem;
        dragXOffset.current = event.clientX - +domItem.style.left.slice(0, -2);
        dragYOffset.current = event.clientY - +domItem.style.top.slice(0, -2);
      };
      domItem.addEventListener("mousedown", mouseCallback);
      mouseDownCallbacks.push({ domItem, callback: mouseCallback });

      const touchCallback = (event: TouchEvent) => {
        draggingItem.value = domItem;
        const touch = event.targetTouches[0];
        dragXOffset.current = touch.clientX - +domItem.style.left.slice(0, -2);
        dragYOffset.current = touch.clientY - +domItem.style.top.slice(0, -2);
      };
      domItem.addEventListener("touchstart", touchCallback);
      touchDownCallbacks.push({ domItem, callback: touchCallback });
    });

    return () => {
      mouseDownCallbacks.forEach(({ domItem, callback }) => {
        domItem.removeEventListener("mousedown", callback);
      });
      touchDownCallbacks.forEach(({ domItem, callback }) => {
        domItem.removeEventListener("touchstart", callback);
      });
    };
  }, [user, itemsList]);

  // Drag and drop workmap item logic
  useEffect(() => {
    const mouseDragItem = (event: MouseEvent) => {
      if (draggingItem.value) {
        draggingItem.value.style.left = `${
          event.clientX - dragXOffset.current
        }px`;
        draggingItem.value.style.top = `${
          event.clientY - dragYOffset.current
        }px`;
        updateXarrow();
      }
    };
    const touchDragItem = (event: TouchEvent) => {
      if (draggingItem.value) {
        const touch = event.targetTouches[0];
        draggingItem.value.style.left = `${
          touch.clientX - dragXOffset.current
        }px`;
        draggingItem.value.style.top = `${
          touch.clientY - dragYOffset.current
        }px`;
        updateXarrow();
      }
    };
    const dropItem = () => {
      if (draggingItem.value) {
        updateItem(draggingItem.value.id, {
          // -2 to get rid of 'px'
          x: Math.round(+draggingItem.value.style.left.slice(0, -2)),
          y: Math.round(+draggingItem.value.style.top.slice(0, -2)),
        });
        draggingItem.value = null;
      }
    };

    document.addEventListener("mousemove", mouseDragItem);
    document.addEventListener("mouseup", dropItem);
    document.addEventListener("touchmove", touchDragItem);
    document.addEventListener("touchend", dropItem);

    return () => {
      document.removeEventListener("mousemove", mouseDragItem);
      document.removeEventListener("mouseup", dropItem);
      document.removeEventListener("touchmove", touchDragItem);
      document.removeEventListener("touchend", dropItem);
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
    currItem.value = null;
    modalOpen.value = true;
  };

  const enterPathSelection = (fromId: string) => {
    const selectableItems = document.querySelectorAll(
      `.${itemStyles.workmapItem}:not(#${CSS.escape(fromId)})`
    ) as NodeListOf<HTMLDivElement>;

    // draw the selecting line
    selectingPathFrom.value = fromId;
    const mouseMoveCallback = () => updateXarrow();
    document.addEventListener("mousemove", mouseMoveCallback);

    // function to clean up after path selection finishes
    const exitPathSelection = () => {
      document.removeEventListener("mousemove", mouseMoveCallback);
      document.onclick = null;
      selectingPathFrom.value = "";
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
          pathFrom.value = fromId;
        } else {
          selectableItems.forEach((item) => {
            if (item.contains(event.target as Node)) {
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

    if (!currItem.value) {
      const x = clickedPos.value
        ? clickedPos.value[0]
        : Math.floor(Math.random() * RAND_X_RANGE);
      const y = clickedPos.value
        ? clickedPos.value[1]
        : Math.floor(Math.random() * RAND_Y_RANGE);

      const item = await addItem(name, abbrev, due, description, x, y);
      if (pathFrom.value && item) {
        await addPath(pathFrom.value, item.id);
      }
    } else {
      await updateItem(currItem.value.id, { name, abbrev, due, description });
    }
  };

  return (
    <>
      <OkaHead title="Workmap" />
      <div className={styles.workmapContainer}>
        <header className={styles.workmapHeader}>
          <h2>Workmap</h2>
          {user && (
            <IoMdAddCircle
              className={styles.workmapAddIcon}
              onClick={() => {
                clickedPos.value = null;
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
                  currItem.value = item;
                  modalOpen.value = true;
                }}
                enterSelecting={enterPathSelection}
              />
            ))}
            {pathsList.map((path) => (
              <WorkmapPathComponent key={path.id} path={path} />
            ))}
            <div ref={selectingEndpoint} className={styles.selectingEndpoint} />
            <SelectingArrow
              selectingFrom={selectingPathFrom.value}
              selectingTo={selectingEndpoint}
            />
            <WorkmapModal
              isModalOpen={modalOpen.value}
              closeModal={() => {
                modalOpen.value = false;
                pathFrom.value = null;
              }}
              currItem={currItem.value}
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
      <div
        ref={workmapRef}
        className={styles.workmap}
        onClick={
          user
            ? (event) => {
                if (event.target !== workmapRef.current) return;
                clickedPos.value = [
                  window.scrollX + event.clientX - ITEM_WIDTH / 2,
                  window.scrollY + event.clientY - ITEM_HEIGHT / 2,
                ];
                enterItemCreation();
              }
            : undefined
        }
      ></div>
    </>
  );
};

export default Workmap;
