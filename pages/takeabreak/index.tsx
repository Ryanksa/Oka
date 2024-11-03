import { useEffect, useRef } from "react";
import OkaHead from "../../src/components/OkaHead";
import HotSpring from "../../src/components/HotSpring";
import MountainOcean from "../../src/components/MountainOcean";
import Bulleting from "../../src/components/Bulleting";
import store from "../../src/store";
import { BreakOption } from "../../src/models/takeABreak";
import { useIpInfo, DEFAULT_COORDS } from "../../src/services/ip";
import { useWeatherOneCall } from "../../src/services/weather";

const TakeABreak = () => {
  const takeABreak = store.takeABreak.value;
  const option = takeABreak.breakOption;
  const palette = takeABreak.hotSpringPalette;
  const topScore = takeABreak.bulletingTopScore;

  const { ipInfo, isLoading, isError } = useIpInfo();
  const hasIpInfo = !isLoading && !isError;
  const coords = hasIpInfo ? ipInfo.loc.split(",") : DEFAULT_COORDS;

  const weatherOneCall = useWeatherOneCall(coords[0], coords[1]);
  let weather = "";
  if (!weatherOneCall.isLoading && !weatherOneCall.isError) {
    weather = weatherOneCall.weather.current.weather[0].main;
  }

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
        {option === BreakOption.hotspring && (
          <HotSpring palette={palette} weather={weather} />
        )}
        {option === BreakOption.mountainocean && (
          <MountainOcean weather={weather} />
        )}
        {option === BreakOption.bulleting && <Bulleting topScore={topScore} />}
      </div>
    </>
  );
};

export default TakeABreak;
