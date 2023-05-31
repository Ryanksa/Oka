import { useState } from "react";
import styles from "../styles//WorkmapPath.module.scss";
import DatePicker from "./DatePicker";
import DateIcon from "./DateIcon";
import IconButton from "./IconButton";
import { updatePath, deletePath } from "../firebase";
import { numDaysBetween, forEachDayBetween } from "../utils/date";
import Xarrow from "react-xarrows";
import { IoMdSave } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { WorkmapPath } from "../models/workmap";

const PATH_COLOUR = "#676781"; // --emphasis-light
const PATH_WIDTH = 1.5;
const PATH_HEAD_SHAPE = "circle";
const PATH_HEAD_SIZE = 4.5;
const PATH_CURVENESS = 0.3;
const PATH_ZINDEX = 2;

type Props = { path: WorkmapPath };

const WorkmapPath = ({ path }: Props) => {
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

  const arrowProps = {
    onClick: () => {
      setHoverDays([]);
      setEditing(true);
    },
  };

  const EditingButtons = () => (
    <div className={styles.buttonsContainer}>
      <IconButton onClick={handleSave}>
        <IoMdSave fontSize={30} />
      </IconButton>
      <IconButton onClick={() => deletePath(path.id)}>
        <MdDelete fontSize={30} />
      </IconButton>
    </div>
  );

  const EditingStartInput = () => (
    <div className={styles.datePickerContainer}>
      <DatePicker
        selected={startDate}
        onSelect={(date) => setStartDate(date)}
        placeholder="Start Date"
      />
    </div>
  );

  const EditingEndInput = () => (
    <div className={styles.datePickerContainer}>
      <DatePicker
        selected={endDate}
        onSelect={(date) => setEndDate(date)}
        placeholder="End Date"
      />
    </div>
  );

  const MiddleLabel = () => {
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

  return (
    <Xarrow
      start={path.from}
      end={path.to}
      headShape={PATH_HEAD_SHAPE}
      headSize={PATH_HEAD_SIZE}
      strokeWidth={PATH_WIDTH}
      color={PATH_COLOUR}
      curveness={PATH_CURVENESS}
      zIndex={PATH_ZINDEX}
      labels={
        !editing
          ? { middle: <MiddleLabel /> }
          : {
              start: <EditingStartInput />,
              middle: <EditingButtons />,
              end: <EditingEndInput />,
            }
      }
      arrowBodyProps={!editing ? arrowProps : undefined}
      arrowHeadProps={!editing ? arrowProps : undefined}
    />
  );
};

export default WorkmapPath;
