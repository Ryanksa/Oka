import React, { MouseEvent, useRef } from "react";
import styles from "../../styles/TakeABreak.module.scss";

export default function TakeABreak() {
  const splashRef = useRef<HTMLDivElement>(null);

  const onClickOnsen = (e: MouseEvent<HTMLDivElement>) => {
    if (splashRef.current) {
      splashRef.current.classList.remove(styles.active);
      const onsen = (e.target as any).getBoundingClientRect();
      const x = e.clientX + onsen.left;
      const y = e.clientY - onsen.top;
      splashRef.current.style.setProperty("left", `calc(${x}px - 12vmin)`);
      splashRef.current.style.setProperty("top", `calc(${y}px - 6vmin)`);
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
    </div>
  );
}
