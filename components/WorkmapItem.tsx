import React, { FC, useState } from "react";
import styles from "../styles/Workmap.module.scss";
import { updateItem } from "../firebase";
import { formatDueDate } from "../utils/date-helper";

import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import CenterFocusWeakIcon from "@mui/icons-material/CenterFocusWeak";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

import { WorkmapItem } from "../models/workmap";

const WorkmapItem: FC<{
  item: WorkmapItem;
  onEdit: () => void;
  enterSelecting: (fromId: string) => void;
}> = ({ item, onEdit, enterSelecting }) => {
  const [focus, setFocus] = useState(item.focus);

  const descriptionLines = item.description.split("\n");
  return (
    <Card
      id={item.id}
      className={styles.workmapItem + (focus ? ` ${styles.focus}` : "")}
      style={{ left: item.x, top: item.y }}
    >
      <CardHeader
        title={item.name}
        className={styles.itemHeader}
        subheader={item.due ? "Due " + formatDueDate(item.due) : "No Due Date"}
        action={
          <IconButton onClick={onEdit}>
            <EditIcon />
          </IconButton>
        }
      />
      <CardContent className={styles.itemContent}>
        <ul>
          {descriptionLines.map((line, idx: number) => {
            if (line.trim().startsWith("- ")) {
              if (line.startsWith(" ")) {
                return (
                  <ul key={idx}>
                    <li>{line.trim().slice(2)}</li>
                  </ul>
                );
              }
              return <li key={idx}>{line.trim().slice(2)}</li>;
            }
            return <div key={idx}>{line.trim()}</div>;
          })}
        </ul>
      </CardContent>
      <CardActions>
        <IconButton
          onClick={() => {
            updateItem(item.id, { focus: !focus });
            setFocus(!focus);
          }}
        >
          <CenterFocusWeakIcon />
        </IconButton>
        <IconButton onClick={() => enterSelecting(item.id)}>
          <TrendingUpIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default WorkmapItem;
