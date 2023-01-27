import { FC, useState } from "react";
import styles from "../styles//WorkmapPath.module.scss";
import DatePicker from "./DatePicker";
import DateIcon from "./DateIcon";
import { updatePath, deletePath } from "../firebase";
import { numDaysBetween, forEachDayBetween } from "../utils/date-helper";
import Xarrow from "react-xarrows";
import { IoMdSave } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { WorkmapPath } from "../models/workmap";

const PATH_COLOUR = "#676781"; // --emphasis-light

type Props = { path: WorkmapPath };

const WorkmapPath: FC<Props> = ({ path }) => {
  const [editing, setEditing] = useState(false);
  const [startDate, setStartDate] = useState(
    path.startDate ? path.startDate : null
  );
  const [endDate, setEndDate] = useState(path.endDate ? path.endDate : null);
  const [hoverDays, setHoverDays] = useState<Date[]>([]);

  const arrowProps = {
    onClick: () => {
      setHoverDays([]);
      setEditing(true);
    },
  };

  const handleSave = () => {
    const promise = updatePath(path.id, { startDate, endDate });
    if (promise) {
      promise.then(() => {
        setEditing(false);
      });
    }
  };

  const EditingButtons = () => (
    <div className={styles.buttonsContainer}>
      <div className="icon-button" onClick={handleSave}>
        <IoMdSave fontSize={30} />
      </div>
      <div className="icon-button" onClick={() => deletePath(path.id)}>
        <MdDelete fontSize={30} />
      </div>
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
    <>
      {editing ? (
        <Xarrow
          start={path.from}
          end={path.to}
          strokeWidth={5.5}
          color={PATH_COLOUR}
          labels={{
            start: <EditingStartInput />,
            middle: <EditingButtons />,
            end: <EditingEndInput />,
          }}
        />
      ) : (
        <Xarrow
          start={path.from}
          end={path.to}
          strokeWidth={5.5}
          color={PATH_COLOUR}
          labels={{ middle: <MiddleLabel /> }}
          arrowBodyProps={arrowProps}
          arrowHeadProps={arrowProps}
        />
      )}
    </>
  );
};

export default WorkmapPath;
