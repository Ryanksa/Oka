import styles from "../styles//WorkmapPath.module.scss";
import DatePicker from "./DatePicker";
import DateIcon from "./DateIcon";
import IconButton from "./IconButton";
import { updatePath, deletePath } from "../firebase";
import { numDaysBetween, forEachDayBetween } from "../utils/date";
import Xarrow from "react-xarrows";
import { IoMdSave } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { WorkmapPath as WorkmapPathType } from "../models/workmap";
import { useSignal } from "@preact/signals-react";

const PATH_COLOUR = "#676781"; // --emphasis-light
const PATH_WIDTH = 1.5;
const PATH_HEAD_SHAPE = "circle";
const PATH_HEAD_SIZE = 4.5;
const PATH_CURVENESS = 0.3;
const PATH_ZINDEX = 2;

type Props = { path: WorkmapPathType };

const WorkmapPath = ({ path }: Props) => {
  const editing = useSignal(false);
  const startDate = useSignal(path.startDate ? path.startDate : null);
  const endDate = useSignal(path.endDate ? path.endDate : null);
  const hoverDays = useSignal<Date[]>([]);

  const handleSave = () => {
    const promise = updatePath(path.id, {
      startDate: startDate.value,
      endDate: endDate.value,
    });
    if (promise) {
      promise.then(() => {
        editing.value = false;
      });
    }
  };

  const arrowProps = {
    onClick: () => {
      hoverDays.value = [];
      editing.value = true;
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
        selected={startDate.value}
        onSelect={(date) => (startDate.value = date)}
        placeholder="Start Date"
      />
    </div>
  );

  const EditingEndInput = () => (
    <div className={styles.datePickerContainer}>
      <DatePicker
        selected={endDate.value}
        onSelect={(date) => (endDate.value = date)}
        placeholder="End Date"
      />
    </div>
  );

  const MiddleLabel = () => {
    if (!startDate.value || !endDate.value) return <></>;

    const today = new Date();
    if (hoverDays.value.length > 0) {
      return (
        <div
          className={styles.middleLabelContainer}
          onMouseLeave={() => {
            hoverDays.value = [];
          }}
        >
          {hoverDays.value.map((date, idx) => {
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

    const todayToStart = numDaysBetween(today, startDate.value);
    const todayToEnd = numDaysBetween(today, endDate.value);
    return (
      <div
        className={styles.middleLabelContainer}
        onMouseEnter={() => {
          const displayDays = forEachDayBetween(
            startDate.value!!,
            endDate.value!!,
            (date) => date
          );
          hoverDays.value = displayDays;
        }}
      >
        <DateIcon
          date={
            todayToStart > 0
              ? startDate.value
              : todayToEnd < 0
              ? endDate.value
              : today
          }
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
        !editing.value
          ? { middle: <MiddleLabel /> }
          : {
              start: <EditingStartInput />,
              middle: <EditingButtons />,
              end: <EditingEndInput />,
            }
      }
      arrowBodyProps={!editing.value ? arrowProps : undefined}
      arrowHeadProps={!editing.value ? arrowProps : undefined}
    />
  );
};

export default WorkmapPath;
