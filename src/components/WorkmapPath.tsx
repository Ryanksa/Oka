import React, { FC, useState } from "react";
import styles from "../styles//Workmap.module.scss";
import DateIcon from "./DateIcon";
import { updatePath, deletePath } from "../firebase";
import { numDaysBetween, forEachDayBetween } from "../utils/date-helper";

import Xarrow from "react-xarrows";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";
import theme from "../theme";

import { WorkmapPath } from "../models/workmap";

const pathColour = theme.palette.info.main;

type Props = { path: WorkmapPath };

const WorkmapPath: FC<Props> = ({ path }) => {
  const [editing, setEditing] = useState(false);
  const [startDate, setStartDate] = useState(
    path.startDate ? path.startDate : null
  );
  const [endDate, setEndDate] = useState(path.endDate ? path.endDate : null);
  const [hoverDays, setHoverDays] = useState<Date[]>([]);

  const handleSave = () => {
    const promise = updatePath(path.id, { startDate, endDate });
    if (promise) {
      promise.then(() => {
        setEditing(false);
      });
    }
  };

  const editingButtons = (
    <div>
      <IconButton onClick={handleSave}>
        <SaveIcon fontSize="large" />
      </IconButton>
      <IconButton onClick={() => deletePath(path.id)}>
        <DeleteIcon fontSize="large" />
      </IconButton>
    </div>
  );
  const editingStartInput = (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div className={styles.pathDatepickerContainer}>
        <DatePicker
          renderInput={(props) => <TextField variant="outlined" {...props} />}
          label="Start Date"
          value={startDate}
          onChange={(date: Date | null) => setStartDate(date)}
        />
      </div>
    </LocalizationProvider>
  );
  const editingEndInput = (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div className={styles.pathDatepickerContainer}>
        <DatePicker
          renderInput={(props) => <TextField variant="outlined" {...props} />}
          label="End Date"
          value={endDate}
          onChange={(date: Date | null) => setEndDate(date)}
        />
      </div>
    </LocalizationProvider>
  );

  const middleLabel = () => {
    if (!startDate || !endDate) return <></>;

    const today = new Date();
    if (hoverDays.length > 0) {
      return (
        <div
          className={styles.middleLabelContainer}
          onMouseLeave={() => {
            setHoverDays([]);
          }}
        >
          {hoverDays.map((date, idx) => {
            const todayToDate = numDaysBetween(today, date);
            return (
              <div key={idx} className={styles.dateIconWrapper}>
                <DateIcon
                  date={date}
                  cross={todayToDate < 0}
                  circle={todayToDate === 0}
                />
              </div>
            );
          })}
        </div>
      );
    }

    const todayToStart = numDaysBetween(today, startDate);
    const todayToEnd = numDaysBetween(today, endDate);
    return (
      <div
        className={styles.middleLabelContainer}
        onMouseEnter={() => {
          const displayDays = forEachDayBetween(
            startDate,
            endDate,
            (date) => date
          );
          setHoverDays(displayDays);
        }}
      >
        <DateIcon
          date={todayToStart > 0 ? startDate : todayToEnd < 0 ? endDate : today}
          circle={todayToStart <= 0 && todayToEnd >= 0}
          cross={todayToEnd < 0}
        />
      </div>
    );
  };

  if (editing) {
    return (
      <Xarrow
        start={path.from}
        end={path.to}
        strokeWidth={5.5}
        color={pathColour}
        labels={{
          start: editingStartInput,
          middle: editingButtons,
          end: editingEndInput,
        }}
      />
    );
  }

  const headBodyProps = {
    onClick: () => {
      setHoverDays([]);
      setEditing(true);
    },
  };
  return (
    <Xarrow
      start={path.from}
      end={path.to}
      strokeWidth={5.5}
      color={pathColour}
      labels={{ middle: middleLabel() }}
      arrowBodyProps={headBodyProps}
      arrowHeadProps={headBodyProps}
    />
  );
};

export default WorkmapPath;
