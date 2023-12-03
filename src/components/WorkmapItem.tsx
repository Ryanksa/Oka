import styles from "../styles/WorkmapItem.module.scss";
import { updateItem } from "../firebase";
import { dueIn, formatDueDate, MILLISECSPERDAY } from "../utils/date";
import { FiEdit2 } from "react-icons/fi";
import { MdOutlineCenterFocusWeak } from "react-icons/md";
import { TbArrowRotaryLastRight } from "react-icons/tb";
import { WorkmapItem as WorkmapItemType } from "../models/workmap";
import IconButton from "./IconButton";
import { useSignal } from "@preact/signals-react";

type Props = {
  item: WorkmapItemType;
  onEdit: () => void;
  enterSelecting: (fromId: string) => void;
};

const WorkmapItem = ({ item, onEdit, enterSelecting }: Props) => {
  const focus = useSignal(item.focus);
  const dueSoon = item.due ? dueIn(item.due, MILLISECSPERDAY) : false;
  const body = item.description.split("\n").map((line, idx) => {
    if (line.startsWith("- ")) {
      return <li key={idx}>{line.trim().slice(2)}</li>;
    } else if (line.trim().startsWith("- ")) {
      return (
        <ul key={idx}>
          <li>{line.trim().slice(2)}</li>
        </ul>
      );
    } else {
      return <div key={idx}>{line.trim()}</div>;
    }
  });

  return (
    <div
      id={item.id}
      className={
        styles.workmapItem +
        (focus.value ? ` ${styles.focus}` : "") +
        (dueSoon ? ` ${styles.dueSoon}` : "")
      }
      style={{ left: item.x, top: item.y }}
    >
      <h2 className={styles.itemHeader}>
        <div>
          {item.name}
          <div className={styles.itemSubheader}>
            {item.due ? "Due " + formatDueDate(item.due) : "No Due Date"}
          </div>
        </div>
        <IconButton onClick={onEdit}>
          <FiEdit2 fontSize={20} />
        </IconButton>
      </h2>
      <div className={styles.itemBody}>
        <ul>{body.map((element) => element)}</ul>
      </div>
      <div className={styles.itemFooter}>
        <IconButton
          onClick={() => {
            updateItem(item.id, { focus: !focus.value });
            focus.value = !focus.peek();
          }}
        >
          <MdOutlineCenterFocusWeak fontSize={25} />
        </IconButton>
        <IconButton onClick={() => enterSelecting(item.id)}>
          <TbArrowRotaryLastRight fontSize={25} />
        </IconButton>
      </div>
    </div>
  );
};

export default WorkmapItem;
