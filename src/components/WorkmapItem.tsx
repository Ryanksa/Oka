import { FC, useState } from "react";
import styles from "../styles/WorkmapItem.module.scss";
import { updateItem } from "../firebase";
import { formatDueDate } from "../utils/date-helper";
import { FiEdit2 } from "react-icons/fi";
import { MdOutlineCenterFocusWeak } from "react-icons/md";
import { TbArrowRotaryLastRight } from "react-icons/tb";
import { WorkmapItem } from "../models/workmap";

type Props = {
  item: WorkmapItem;
  onEdit: () => void;
  enterSelecting: (fromId: string) => void;
};

const WorkmapItem: FC<Props> = ({ item, onEdit, enterSelecting }) => {
  const [focus, setFocus] = useState(item.focus);
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
      className={styles.workmapItem + (focus ? ` ${styles.focus}` : "")}
      style={{ left: item.x, top: item.y }}
    >
      <h2 className={styles.itemHeader}>
        <div>
          {item.name}
          <div className={styles.itemSubheader}>
            {item.due ? "Due " + formatDueDate(item.due) : "No Due Date"}
          </div>
        </div>
        <div className="icon-button" onClick={onEdit}>
          <FiEdit2 fontSize={20} />
        </div>
      </h2>
      <div className={styles.itemBody}>
        <ul>{body.map((element) => element)}</ul>
      </div>
      <div className={styles.itemFooter}>
        <div
          className="icon-button"
          onClick={() => {
            updateItem(item.id, { focus: !focus });
            setFocus(!focus);
          }}
        >
          <MdOutlineCenterFocusWeak fontSize={25} />
        </div>
        <div className="icon-button" onClick={() => enterSelecting(item.id)}>
          <TbArrowRotaryLastRight fontSize={25} />
        </div>
      </div>
    </div>
  );
};

export default WorkmapItem;
