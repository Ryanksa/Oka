import React, { useState, useEffect } from "react";
import OkaHead from "../../src/components/OkaHead";
import HotSpring from "../../src/components/HotSpring";
import MountainOcean from "../../src/components/MountainOcean";
import Bulleting from "../../src/components/Bulleting";
import {
  takeABreakStore,
  addTakeABreakStoreListener,
  removeTakeABreakStoreListener,
} from "../../src/stores";
import { BreakOption, HotSpringPalette } from "../../src/models/takeABreak";

export default function TakeABreak() {
  const [option, setOption] = useState<BreakOption>(
    takeABreakStore.takeABreak.breakOption
  );
  const [palette, setPalette] = useState<HotSpringPalette>(
    takeABreakStore.takeABreak.hotSpringPalette
  );
  const [topScore, setTopScore] = useState(
    takeABreakStore.takeABreak.bulletingTopScore
  );

  useEffect(() => {
    const callback = () => {
      setOption(takeABreakStore.takeABreak.breakOption);
      setPalette(takeABreakStore.takeABreak.hotSpringPalette);
      setTopScore(takeABreakStore.takeABreak.bulletingTopScore);
    };
    addTakeABreakStoreListener(callback);
    return () => removeTakeABreakStoreListener(callback);
  }, []);

  return (
    <>
      <OkaHead title="Take a Break" />
      {option === BreakOption.hotspring && <HotSpring palette={palette} />}
      {option === BreakOption.mountainocean && <MountainOcean />}
      {option === BreakOption.bulleting && <Bulleting topScore={topScore} />}
    </>
  );
}
