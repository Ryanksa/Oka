import { RefObject } from "react";
import Xarrow from "react-xarrows";

const SELECTING_PATH_COLOUR = "#6767812f"; // --emphasis-bg
const SELECTING_ARROW_WIDTH = 3;
const SELECTING_HEAD_SHAPE = "circle";
const SELECTING_HEAD_SIZE = 4.5;
const SELECTING_DASHNESS = {
  strokeLen: 18,
  nonStrokeLen: 9,
};
const SELECTING_CURVENESS = 0.3;
const SELECTING_ZINDEX = -1;

type Props = {
  selectingFrom: string | RefObject<HTMLElement>;
  selectingTo: string | RefObject<HTMLElement>;
};

const SelectingArrow = ({ selectingFrom, selectingTo }: Props) => {
  return (
    <Xarrow
      start={selectingFrom}
      end={selectingTo}
      strokeWidth={SELECTING_ARROW_WIDTH}
      headShape={SELECTING_HEAD_SHAPE}
      headSize={SELECTING_HEAD_SIZE}
      color={SELECTING_PATH_COLOUR}
      dashness={SELECTING_DASHNESS}
      curveness={SELECTING_CURVENESS}
      zIndex={SELECTING_ZINDEX}
      showXarrow={!!selectingFrom}
    />
  );
};

export default SelectingArrow;
