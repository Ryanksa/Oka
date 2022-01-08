import React, { useState, useEffect, useRef, MouseEvent } from "react";
import styles from "../../styles/TakeABreak.module.scss";

import { getIpInfo } from "../../utils/ip-service";
import { getWeatherOneCall } from "../../utils/weather-service";
import { getRandomArbitrary } from "../../utils/general";

function RainSplash(x: number, y: number, className: string) {
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
}

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
    <div className={styles.scene}>
      <div className={styles.sunContainer}>
        <div className={styles.sun}></div>
      </div>
      <div className={`${styles.mountain} ${styles.mountain1}`}></div>
      <div className={`${styles.mountain} ${styles.mountain2}`}></div>
      <div className={`${styles.mountain} ${styles.mountain3}`}></div>
      <div className={`${styles.grass} ${styles.grass1}`}></div>
      <div className={`${styles.grass} ${styles.grass2}`}></div>
      <div className={`${styles.grass} ${styles.grass3}`}></div>
      <div className={`${styles.grass} ${styles.grass4}`}></div>
      <div
        className={`${styles.rock} ${styles.rock1} ${styles.rockReflection}`}
      ></div>
      <div
        className={`${styles.rock} ${styles.rock2} ${styles.rockReflection}`}
      ></div>
      <div
        className={`${styles.rock} ${styles.rock3} ${styles.rockReflection}`}
      ></div>
      <div
        className={`${styles.rock} ${styles.rock4} ${styles.rockReflection}`}
      ></div>
      <div
        className={`${styles.rock} ${styles.rock5} ${styles.rockReflection}`}
      ></div>
      <div
        className={`${styles.rock} ${styles.rock6} ${styles.rockReflection}`}
      ></div>
      <div
        className={`${styles.rock} ${styles.rock7} ${styles.rockReflection}`}
      ></div>
      <div
        className={`${styles.rock} ${styles.rock8} ${styles.rockReflection}`}
      ></div>
      <div
        className={`${styles.rock} ${styles.rock9} ${styles.rockReflection}`}
      ></div>
      <div
        className={`${styles.rock} ${styles.rock10} ${styles.rockReflection}`}
      ></div>
      <div className={styles.onsen} onClick={onClickOnsen}>
        <div className={styles.splash} ref={splashRef}></div>
      </div>
      <div className={`${styles.smoke} ${styles.smoke1}`}></div>
      <div className={`${styles.smoke} ${styles.smoke2}`}></div>
      <div className={`${styles.smoke} ${styles.smoke3}`}></div>
      <div className={`${styles.smoke} ${styles.smoke4}`}></div>

      {weather === "Rain" && (
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
            {RainSplash(35, 50, styles.rainSplash1)}
            {RainSplash(62, 52, styles.rainSplash2)}
            {RainSplash(94, 54, styles.rainSplash3)}
          </svg>
          <div className={`${styles.splash} ${styles.rainSplash4}`}></div>
          <div className={`${styles.splash} ${styles.rainSplash5}`}></div>
          <div className={`${styles.splash} ${styles.rainSplash6}`}></div>
          <div className={`${styles.splash} ${styles.rainSplash7}`}></div>
        </>
      )}
    </div>
  );
}
