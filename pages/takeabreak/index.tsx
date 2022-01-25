import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  MouseEvent,
  FC,
} from "react";
import styles from "../../styles/TakeABreak.module.scss";

import { getIpInfo } from "../../utils/ip-service";
import { getWeatherOneCall } from "../../utils/weather-service";
import { getRandomArbitrary } from "../../utils/general";

export default function TakeABreak() {
  const [weather, setWeather] = useState("");
  const splashRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getIpInfo().then((res) => {
      const loc = res.data.loc.split(",");
      getWeatherOneCall(loc[0], loc[1]).then((res) => {
        const weather = res.data.current.weather[0].main;
        setWeather(weather);
      });
    });
  }, []);

  return (
    <div className={styles.scene}>
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
      <div className={`${styles.rock} ${styles.rock9}`}>
        <RockTexture />
      </div>
      <div className={`${styles.rock} ${styles.rock10}`}>
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
    });
    return positions;
  }, []);
  const colour = "rgba(0,0,0,0.1)";

  return (
    <div className={styles.rockTexture}>
      <svg viewBox="0 0 100 50">
        {cPositions.map((p, idx) => (
          <circle key={idx} cx={p.x} cy={p.y} r={p.r} fill={colour} />
        ))}
        {lPositions.map((p, idx) => (
          <path
            key={idx}
            d={`M ${p.x} ${p.y} l 8 -2 l 9 6 l 4 6 l -7 2 m 7 -2 l 0 9 m -4 -15 l 10 -5`}
            stroke={colour}
            strokeWidth={0.5}
            fill="none"
            style={{ transform: `rotate(${p.r}deg)` }}
          ></path>
        ))}
      </svg>
    </div>
  );
};

const Onsen: FC<{ splashRef: React.RefObject<HTMLDivElement> }> = ({
  splashRef,
}) => {
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
      splashRef.current.style.setProperty("left", `calc(${x}px - 9vmin)`);
      splashRef.current.style.setProperty("top", `calc(${y}px - 4.5vmin)`);
      splashRef.current.classList.add(styles.active);
    }
  };

  return (
    <>
      <div className={styles.onsen} onClick={onClickOnsen}>
        <div className={styles.splash} ref={splashRef}></div>
      </div>
      {[...Array(5)].map((_, idx) => (
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
          strokeWidth={0.02}
        ></path>
        <path
          className={`${styles.rainDrop} ${styles.rainDrop2}`}
          d="M 17 0 V 47"
          stroke="white"
          strokeWidth={0.02}
        ></path>
        <path
          className={`${styles.rainDrop} ${styles.rainDrop3}`}
          d="M 28 0 V 86"
          stroke="white"
          strokeWidth={0.02}
        ></path>
        <path
          className={`${styles.rainDrop} ${styles.rainDrop4}`}
          d="M 35 0 V 50"
          stroke="white"
          strokeWidth={0.02}
        ></path>
        <path
          className={`${styles.rainDrop} ${styles.rainDrop5}`}
          d="M 51 0 V 67"
          stroke="white"
          strokeWidth={0.02}
        ></path>
        <path
          className={`${styles.rainDrop} ${styles.rainDrop6}`}
          d="M 62 0 V 52"
          stroke="white"
          strokeWidth={0.02}
        ></path>
        <path
          className={`${styles.rainDrop} ${styles.rainDrop7}`}
          d="M 77 0 V 71"
          stroke="white"
          strokeWidth={0.02}
        ></path>
        <path
          className={`${styles.rainDrop} ${styles.rainDrop8}`}
          d="M 88 0 V 45"
          stroke="white"
          strokeWidth={0.02}
        ></path>
        <path
          className={`${styles.rainDrop} ${styles.rainDrop9}`}
          d="M 94 0 V 54"
          stroke="white"
          strokeWidth={0.02}
        ></path>
        <RainSplash x={35} y={50} className={styles.rainSplash1} />
        <RainSplash x={62} y={52} className={styles.rainSplash2} />
        <RainSplash x={94} y={54} className={styles.rainSplash3} />
      </svg>
      <div className={`${styles.splash} ${styles.rainSplash4}`}></div>
      <div className={`${styles.splash} ${styles.rainSplash5}`}></div>
      <div className={`${styles.splash} ${styles.rainSplash6}`}></div>
      <div className={`${styles.splash} ${styles.rainSplash7}`}></div>
    </>
  );
};

const RainSplash: FC<{ x: number; y: number; className: string }> = ({
  x,
  y,
  className,
}) => {
  const leftH = getRandomArbitrary(0.3, 0.7);
  const rightH = getRandomArbitrary(0.3, 0.7);
  const leftV = getRandomArbitrary(0.2, 0.6);
  const rightV = getRandomArbitrary(0.2, 0.6);

  return (
    <>
      <path
        className={`${styles.rainSplash} ${className}`}
        d={`M ${x - leftH} ${y} v -${leftV}`}
        stroke="white"
        fill="white"
        strokeWidth={0.02}
      ></path>
      <path
        className={`${styles.rainSplash} ${className}`}
        d={`M ${x + rightH} ${y} v -${rightV}`}
        stroke="white"
        strokeWidth={0.02}
      ></path>
    </>
  );
};

const Snow = () => {
  return (
    <>
      {[...Array(75)].map((_, idx) => (
        <div key={idx} className={styles.snowflake}></div>
      ))}
    </>
  );
};
