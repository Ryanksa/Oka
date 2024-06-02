import { useEffect, useRef } from "react";
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

  const contentRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const toggleFullscreen = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== "f") return;

      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        contentRef.current?.requestFullscreen();
      }
    };

    document.addEventListener("keydown", toggleFullscreen);
    return () => {
      document.removeEventListener("keydown", toggleFullscreen);
    };
  }, []);

  return (
    <>
      <OkaHead title="Take a Break" />
      <div ref={contentRef}>
        {option === BreakOption.hotspring && <HotSpring palette={palette} />}
        {option === BreakOption.mountainocean && <MountainOcean />}
        {option === BreakOption.bulleting && <Bulleting topScore={topScore} />}
      </div>
    </>
  );
};

export default TakeABreak;
