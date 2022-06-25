import React, { useEffect, useRef, useMemo, MouseEvent, FC } from "react";
import styles from "../styles/HotSpring.module.scss";

import { useIpInfo, DEFAULT_LOCATION } from "../utils/ip-service";
import { useWeatherOneCall } from "../utils/weather-service";
import { getRandomArbitrary } from "../utils/general";
import { drawSnowBranch } from "../utils/canvas-helper";
import { HotSpringPalette } from "../models/takeABreak";

const RAIN_WIDTH = 0.015;
const NUM_SNOW = 125;
const NUM_STEAM = 7;

type Props = {
  palette: HotSpringPalette;
};

export default function HotSpring({ palette }: Props) {
  const splashRef = useRef<HTMLDivElement>(null);

  const { ipInfo, isLoading, isError } = useIpInfo();
  let loc = DEFAULT_LOCATION;
  if (!isLoading && !isError) loc = ipInfo.loc.split(",");

  const weatherOneCall = useWeatherOneCall(loc[0], loc[1]);
  let weather = "";
  if (!weatherOneCall.isLoading && !weatherOneCall.isError) {
    weather = weatherOneCall.weather.current.weather[0].main;
  }

  let paletteClass = "";
  switch (palette) {
    case HotSpringPalette.warm:
      paletteClass = styles.warm;
      break;
    case HotSpringPalette.lucid:
      paletteClass = styles.lucid;
      break;
    default:
      paletteClass = styles.warm;
  }

  return (
    <div className={`${styles.scene} ${paletteClass}`}>
      <Sun />
      <Clouds />
      <Grass />
      <Rocks />
      <Onsen splashRef={splashRef} />

      {weather === "Rain" && <Rain />}
      {weather === "Snow" && <Snow />}
    </div>
  );
}

const Sun = () => {
  return (
    <div className={styles.sunContainer}>
      <div className={styles.sun}></div>
    </div>
  );
};

const Clouds = () => {
  return (
    <>
      <div className={`${styles.cloud} ${styles.cloud1}`}></div>
      <div className={`${styles.cloud} ${styles.cloud2}`}></div>
    </>
  );
};

const Grass = () => {
  return (
    <>
      <div className={`${styles.grass} ${styles.grass1}`}></div>
      <div className={`${styles.grass} ${styles.grass2}`}></div>
      <div className={`${styles.grass} ${styles.grass3}`}></div>
      <div className={`${styles.grass} ${styles.grass4}`}></div>
      <div className={`${styles.grass} ${styles.grass5}`}></div>
      <div className={`${styles.grass} ${styles.grass6}`}></div>
    </>
  );
};

const Rocks = () => {
  return (
    <>
      <div className={`${styles.rock} ${styles.rock1}`}>
        <RockTexture />
      </div>
      <div className={`${styles.rock} ${styles.rock2}`}>
        <RockTexture />
      </div>
      <div className={`${styles.rock} ${styles.rock3}`}>
        <RockTexture />
      </div>
      <div className={`${styles.rock} ${styles.rock4}`}>
        <RockTexture />
      </div>
      <div className={`${styles.rock} ${styles.rock5}`}>
        <RockTexture />
      </div>
      <div className={`${styles.rock} ${styles.rock6}`}>
        <RockTexture />
      </div>
      <div className={`${styles.rock} ${styles.rock7}`}>
        <RockTexture />
      </div>
      <div className={`${styles.rock} ${styles.rock8}`}>
        <RockTexture />
      </div>
    </>
  );
};

const RockTexture = () => {
  const cPositions = useMemo(() => {
    let positions = [];
    for (let i = 0; i < 5; i++) {
      positions.push({
        x: getRandomArbitrary(20, 80),
        y: getRandomArbitrary(10, 40),
        r: getRandomArbitrary(0.5, 1.5),
        sx: getRandomArbitrary(0.75, 1.25),
        sy: getRandomArbitrary(0.75, 1.25),
      });
    }
    return positions;
  }, []);
  const lPositions = useMemo(() => {
    let positions = [];
    positions.push({
      x: getRandomArbitrary(20, 80),
      y: getRandomArbitrary(10, 40),
      r: getRandomArbitrary(0, 360),
      sx: getRandomArbitrary(0.5, 1.5),
      sy: getRandomArbitrary(0.5, 1.5),
    });
    return positions;
  }, []);
  const colour = "rgba(0,0,0,0.1)";

  return (
    <div className={styles.rockTexture}>
      <svg viewBox="0 0 100 50">
        {cPositions.map((p, idx) => (
          <circle
            key={idx}
            cx={p.x}
            cy={p.y}
            r={p.r}
            fill={colour}
            style={{ transform: `scaleX(${p.sx}) scaleY(${p.sy})` }}
          />
        ))}
        {lPositions.map((p, idx) => (
          <path
            key={idx}
            d={`M ${p.x} ${p.y} l 8 -2 l 9 6 l 4 6 l 0 9 m -4 -15 l 10 -5`}
            stroke={colour}
            strokeWidth={0.5}
            fill="none"
            style={{
              transform: `rotate(${p.r}deg) scaleX(${p.sx}) scaleY(${p.sy})`,
            }}
          ></path>
        ))}
      </svg>
    </div>
  );
};

type OnsenProps = { splashRef: React.RefObject<HTMLDivElement> };

const Onsen: FC<OnsenProps> = ({ splashRef }) => {
  useEffect(() => {
    const steamElements: NodeListOf<HTMLDivElement> = document.querySelectorAll(
      `.${styles.steam}`
    );
    const intervalId = setInterval(() => {
      steamElements.forEach((steam) => {
        steam.style.left = getRandomArbitrary(-100, 300) + "vmin";
      });
    }, 20000);

    return () => clearInterval(intervalId);
  }, []);

  const onClickOnsen = (e: MouseEvent<HTMLDivElement>) => {
    if (splashRef.current) {
      splashRef.current.classList.remove(styles.active);
      const onsen = (e.target as any).getBoundingClientRect();
      const x = e.clientX + onsen.left;
      const y = e.clientY - onsen.top;
      splashRef.current.style.setProperty("left", `calc(${x}px - 7vmin)`);
      splashRef.current.style.setProperty("top", `calc(${y}px - 3.5vmin)`);
      splashRef.current.classList.add(styles.active);
    }
  };

  return (
    <>
      <div className={styles.onsen} onClick={onClickOnsen}>
        <div className={styles.splash} ref={splashRef}></div>
      </div>
      {[...Array(NUM_STEAM)].map((_, idx) => (
        <div key={idx} className={styles.steam}></div>
      ))}
    </>
  );
};

const Rain = () => {
  return (
    <>
      <svg
        className={styles.rainSvg}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path
          className={`${styles.rainDrop} ${styles.rainDrop1}`}
          d="M 7 0 V 92"
          stroke="white"
          strokeWidth={RAIN_WIDTH}
        ></path>
        <path
          className={`${styles.rainDrop} ${styles.rainDrop2}`}
          d="M 17 0 V 47"
          stroke="white"
          strokeWidth={RAIN_WIDTH}
        ></path>
        <path
          className={`${styles.rainDrop} ${styles.rainDrop3}`}
          d="M 28 0 V 86"
          stroke="white"
          strokeWidth={RAIN_WIDTH}
        ></path>
        <path
          className={`${styles.rainDrop} ${styles.rainDrop4}`}
          d="M 35 0 V 50"
          stroke="white"
          strokeWidth={RAIN_WIDTH}
        ></path>
        <path
          className={`${styles.rainDrop} ${styles.rainDrop5}`}
          d="M 51 0 V 67"
          stroke="white"
          strokeWidth={RAIN_WIDTH}
        ></path>
        <path
          className={`${styles.rainDrop} ${styles.rainDrop6}`}
          d="M 62 0 V 52"
          stroke="white"
          strokeWidth={RAIN_WIDTH}
        ></path>
        <path
          className={`${styles.rainDrop} ${styles.rainDrop7}`}
          d="M 77 0 V 71"
          stroke="white"
          strokeWidth={RAIN_WIDTH}
        ></path>
        <path
          className={`${styles.rainDrop} ${styles.rainDrop8}`}
          d="M 88 0 V 45"
          stroke="white"
          strokeWidth={RAIN_WIDTH}
        ></path>
        <path
          className={`${styles.rainDrop} ${styles.rainDrop9}`}
          d="M 94 0 V 54"
          stroke="white"
          strokeWidth={RAIN_WIDTH}
        ></path>
        <path
          className={`${styles.rainDrop} ${styles.rainDrop10}`}
          d="M 11 0 V 56"
          stroke="white"
          strokeWidth={RAIN_WIDTH}
        ></path>
        <path
          className={`${styles.rainDrop} ${styles.rainDrop11}`}
          d="M 22 0 V 49"
          stroke="white"
          strokeWidth={RAIN_WIDTH}
        ></path>
        <path
          className={`${styles.rainDrop} ${styles.rainDrop12}`}
          d="M 32 0 V 47"
          stroke="white"
          strokeWidth={RAIN_WIDTH}
        ></path>
        <path
          className={`${styles.rainDrop} ${styles.rainDrop13}`}
          d="M 40 0 V 77"
          stroke="white"
          strokeWidth={RAIN_WIDTH}
        ></path>
        <path
          className={`${styles.rainDrop} ${styles.rainDrop14}`}
          d="M 44 0 V 44"
          stroke="white"
          strokeWidth={RAIN_WIDTH}
        ></path>
        <path
          className={`${styles.rainDrop} ${styles.rainDrop15}`}
          d="M 56 0 V 46"
          stroke="white"
          strokeWidth={RAIN_WIDTH}
        ></path>
        <path
          className={`${styles.rainDrop} ${styles.rainDrop16}`}
          d="M 69 0 V 89"
          stroke="white"
          strokeWidth={RAIN_WIDTH}
        ></path>
        <path
          className={`${styles.rainDrop} ${styles.rainDrop17}`}
          d="M 81 0 V 51"
          stroke="white"
          strokeWidth={RAIN_WIDTH}
        ></path>
        <path
          className={`${styles.rainDrop} ${styles.rainDrop18}`}
          d="M 86 0 V 79"
          stroke="white"
          strokeWidth={RAIN_WIDTH}
        ></path>
        <path
          className={`${styles.rainDrop} ${styles.rainDrop19}`}
          d="M 98 0 V 42"
          stroke="white"
          strokeWidth={RAIN_WIDTH}
        ></path>
        <RainSplash x={35} y={50} className={styles.rainSplash1} />
        <RainSplash x={62} y={52} className={styles.rainSplash2} />
        <RainSplash x={94} y={54} className={styles.rainSplash3} />
        <RainSplash x={11} y={56} className={styles.rainSplash8} />
        <RainSplash x={22} y={49} className={styles.rainSplash9} />
        <RainSplash x={81} y={51} className={styles.rainSplash12} />
      </svg>
      <div className={`${styles.splash} ${styles.rainSplash4}`}></div>
      <div className={`${styles.splash} ${styles.rainSplash5}`}></div>
      <div className={`${styles.splash} ${styles.rainSplash6}`}></div>
      <div className={`${styles.splash} ${styles.rainSplash7}`}></div>
      <div className={`${styles.splash} ${styles.rainSplash10}`}></div>
      <div className={`${styles.splash} ${styles.rainSplash11}`}></div>
      <div className={`${styles.splash} ${styles.rainSplash13}`}></div>
    </>
  );
};

type RainSplashProps = { x: number; y: number; className: string };

const RainSplash: FC<RainSplashProps> = ({ x, y, className }) => {
  const leftH = getRandomArbitrary(0.4, 0.7);
  const rightH = getRandomArbitrary(0.4, 0.7);
  return (
    <>
      <path
        className={`${styles.rainSplash} ${className}`}
        d={`M ${x - leftH} ${y} a 6 2 -10 0 0 -0.25 -0.7`}
        stroke="white"
        fill="none"
        strokeWidth={RAIN_WIDTH}
      ></path>
      <path
        className={`${styles.rainSplash} ${className}`}
        d={`M ${x + rightH} ${y} a 6 2 -10 0 1 0.25 -0.7`}
        stroke="white"
        fill="none"
        strokeWidth={RAIN_WIDTH}
      ></path>
    </>
  );
};

const Snow = () => {
  const snowRefs = useRef<HTMLCanvasElement[]>([]);

  useEffect(() => {
    if (snowRefs.current) {
      snowRefs.current.forEach((canvas) => {
        drawSnowflake(canvas);
      });
    }
  }, []);

  const drawSnowflake = (canvas: HTMLCanvasElement) => {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.strokeStyle = "white";
    ctx.lineCap = "round";
    ctx.lineWidth = 1;
    const sides = 8;
    ctx.translate(canvas.width / 2, canvas.height / 2);
    for (let i = 0; i < sides; i++) {
      ctx.rotate((Math.PI * 2) / sides);
      drawSnowBranch(ctx, 12, 2, 0.6, 1, 1);
    }
  };

  return (
    <>
      {[...Array(NUM_SNOW)].map((_, idx) => (
        <canvas
          key={idx}
          className={styles.snowflake}
          ref={(element) => snowRefs.current.push(element!)}
        ></canvas>
      ))}
    </>
  );
};
