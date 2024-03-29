import OkaHead from "../../src/components/OkaHead";
import HotSpring from "../../src/components/HotSpring";
import MountainOcean from "../../src/components/MountainOcean";
import Bulleting from "../../src/components/Bulleting";
import store from "../../src/store";
import { BreakOption } from "../../src/models/takeABreak";

const TakeABreak = () => {
  const takeABreak = store.takeABreak.value;
  const option = takeABreak.breakOption;
  const palette = takeABreak.hotSpringPalette;
  const topScore = takeABreak.bulletingTopScore;

  return (
    <>
      <OkaHead title="Take a Break" />
      {option === BreakOption.hotspring && <HotSpring palette={palette} />}
      {option === BreakOption.mountainocean && <MountainOcean />}
      {option === BreakOption.bulleting && <Bulleting topScore={topScore} />}
    </>
  );
};

export default TakeABreak;
