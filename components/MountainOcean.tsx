import React from "react";
import styles from "../styles/MountainOcean.module.scss";
import { midpointDisplace, Point } from "../utils/svg-helper";

export default function MountainOcean() {
  return (
    <div className={`${styles.scene} ${styles.palette}`}>
      <Sky />
      <Ocean />
      <Mountains />
      <Trees />
      <Room />
    </div>
  );
}

const Sky = () => {
  return <div className={styles.sky}></div>;
};

const Ocean = () => {
  return <div className={styles.ocean}></div>;
};

const Mountains = () => {
  const generateMountainPath = (start: Point, end: Point, depth: number) => {
    const points = midpointDisplace(start, end, depth);
    let pointsString = "";
    for (let point of points) {
      pointsString += `L ${point.x} ${point.y} `;
    }
    pointsString = `M${pointsString.slice(1)}`;
    return `${pointsString} L 100 100 L 0 100`;
  };

  return (
    <svg className={styles.mountain} viewBox="70 20 100 100">
      <defs>
        <linearGradient id="mountain1">
          <stop offset="0%" stopColor="rgb(125, 168, 98)" />
          <stop offset="100%" stopColor="rgb(145, 196, 113)" />
        </linearGradient>
        <linearGradient id="mountain2">
          <stop offset="0%" stopColor="rgb(51, 130, 65)" />
          <stop offset="100%" stopColor="rgb(62, 159, 80)" />
        </linearGradient>
      </defs>
      <path
        className={styles.mountain2}
        fill="url(#mountain2)"
        d={generateMountainPath({ x: 0, y: 35 }, { x: 100, y: 100 }, 5)}
      ></path>
      <path
        className={styles.mountain1}
        fill="url(#mountain1)"
        d={generateMountainPath({ x: 0, y: 40 }, { x: 75, y: 100 }, 5)}
      ></path>
      <path
        className={styles.mountain2}
        fill="url(#mountain2)"
        d={generateMountainPath({ x: 0, y: 60 }, { x: 90, y: 100 }, 5)}
      ></path>
      <path
        className={styles.mountain1}
        fill="url(#mountain1)"
        d={generateMountainPath({ x: 0, y: 75 }, { x: 90, y: 100 }, 5)}
      ></path>
    </svg>
  );
};

const Trees = () => {
  return <canvas className={styles.trees}></canvas>;
};

const Room = () => {
  return <div className={styles.room}></div>;
};
