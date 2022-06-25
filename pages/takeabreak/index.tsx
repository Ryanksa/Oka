import React, { useState, useEffect, useContext } from "react";
import HotSpring from "../../components/HotSpring";
import MountainOcean from "../../components/MountainOcean";
import Bulleting from "../../components/Bulleting";

import {
  TakeABreakContext,
  addTakeABreakContextListener,
  removeTakeABreakContextListener,
} from "../../contexts";
import { BreakOption, HotSpringPalette } from "../../models/takeABreak";

export default function TakeABreak() {
  const takeABreakContext = useContext(TakeABreakContext);
  const [option, setOption] = useState<BreakOption>(
    takeABreakContext.takeABreak.breakOption
  );
  const [palette, setPalette] = useState<HotSpringPalette>(
    takeABreakContext.takeABreak.hotSpringPalette
  );
  const [topScore, setTopScore] = useState(
    takeABreakContext.takeABreak.bulletingTopScore
  );

  useEffect(() => {
    const callback = () => {
      setOption(takeABreakContext.takeABreak.breakOption);
      setPalette(takeABreakContext.takeABreak.hotSpringPalette);
      setTopScore(takeABreakContext.takeABreak.bulletingTopScore);
    };
    addTakeABreakContextListener(callback);
    return () => removeTakeABreakContextListener(callback);
  }, []);

  if (option === BreakOption.hotspring) {
    return <HotSpring palette={palette} />;
  }
  if (option === BreakOption.mountainocean) {
    return <MountainOcean />;
  }
  if (option === BreakOption.bulleting) {
    return <Bulleting topScore={topScore} />;
  }
}
