import React, { useRef, useEffect } from "react";
import styles from "../styles/MountainOcean.module.scss";
import { midpointDisplace, Point } from "../utils/svg-helper";
import { drawTreeBranch } from "../utils/canvas-helper";

const branchColour = "#a08a5adc";
const leafColour1 = "#429b4ca5";
const leafColour2 = "#83c48ac1";
const leafColour3 = "#e35353a1";

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
  return (
    <>
      <div className={styles.sky}>
        <div className={styles.sunContainer}>
          <div className={styles.sun}></div>
        </div>
      </div>
      <div className={styles.lightingFilter}></div>
    </>
  );
};

const Ocean = () => {
  return <div className={styles.ocean}></div>;
};

const Mountains = () => {
  const generateMountainPath = (start: Point, end: Point, depth: number) => {
    const points = midpointDisplace(start, end, depth);
    const maxY = Math.max(start.y, end.y);
    let path = "";
    for (let point of points) {
      path += `L ${point.x} ${Math.min(point.y, maxY)} `;
    }
    return `M${path.slice(1)} L ${end.x} ${maxY} L ${start.x} ${maxY} `;
  };

  return (
    <>
      <svg className={styles.mountains1} viewBox="-60 0 100 100">
        <ellipse
          className={styles.mountainBase}
          cx="100"
          cy="95"
          rx="103"
          ry="3"
        ></ellipse>
        <path
          className={styles.mountain2}
          d={
            generateMountainPath({ x: 0, y: 95 }, { x: 100, y: 35 }, 5) +
            generateMountainPath({ x: 100, y: 35 }, { x: 200, y: 95 }, 5)
          }
        ></path>
        <path
          className={styles.mountain1}
          d={
            generateMountainPath({ x: 25, y: 95 }, { x: 100, y: 40 }, 5) +
            generateMountainPath({ x: 100, y: 40 }, { x: 175, y: 95 }, 5)
          }
        ></path>
        <path
          className={styles.mountain2}
          d={
            generateMountainPath({ x: 5, y: 95 }, { x: 100, y: 55 }, 5) +
            generateMountainPath({ x: 100, y: 55 }, { x: 195, y: 95 }, 5)
          }
        ></path>
        <path
          className={styles.mountain2}
          d={
            generateMountainPath({ x: 10, y: 95 }, { x: 100, y: 60 }, 5) +
            generateMountainPath({ x: 100, y: 60 }, { x: 190, y: 95 }, 5)
          }
        ></path>
        <path
          className={styles.mountain1}
          d={
            generateMountainPath({ x: 10, y: 95 }, { x: 100, y: 75 }, 5) +
            generateMountainPath({ x: 100, y: 75 }, { x: 190, y: 95 }, 5)
          }
        ></path>
        <path
          className={styles.mountain3}
          d={
            generateMountainPath({ x: 0, y: 96 }, { x: 100, y: 90 }, 5) +
            generateMountainPath({ x: 100, y: 90 }, { x: 200, y: 96 }, 5)
          }
        ></path>
      </svg>
      <svg className={styles.mountains2} viewBox="70 0 100 100">
        <path
          className={styles.mountain1}
          d={
            generateMountainPath({ x: -60, y: 100 }, { x: 0, y: 20 }, 6) +
            generateMountainPath({ x: 0, y: 20 }, { x: 60, y: 100 }, 6)
          }
        ></path>
        <path
          className={styles.mountain3}
          d={
            generateMountainPath({ x: -150, y: 100 }, { x: 0, y: 80 }, 5) +
            generateMountainPath({ x: 0, y: 80 }, { x: 150, y: 100 }, 5)
          }
        ></path>
      </svg>
    </>
  );
};

const Trees = () => {
  const tree1Ref = useRef<HTMLCanvasElement>(null);
  const tree2Ref = useRef<HTMLCanvasElement>(null);

  const drawTree1 = () => {
    if (!tree1Ref.current) return;
    const canvas = tree1Ref.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = "round";
    ctx.lineWidth = 2;

    ctx.save();
    ctx.translate(0, canvas.height / 3 - 30);
    ctx.rotate(-0.05);
    drawTreeBranch(ctx, 150, branchColour, 5, leafColour2, 4);
    ctx.restore();

    ctx.save();
    ctx.translate(-20, (canvas.height * 3) / 4);
    ctx.rotate(-0.35);
    drawTreeBranch(ctx, 200, branchColour, 5, leafColour1, 5);
    ctx.restore();
  };

  const drawTree2 = () => {
    if (!tree2Ref.current) return;
    const canvas = tree2Ref.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = "round";
    ctx.lineWidth = 2;

    ctx.save();
    ctx.translate(0, canvas.height / 3);
    ctx.rotate(0.3);
    drawTreeBranch(ctx, 175, branchColour, 5, leafColour1, 4);
    ctx.restore();

    ctx.save();
    ctx.translate(0, (canvas.height * 2) / 3 - 50);
    ctx.rotate(0.2);
    drawTreeBranch(ctx, 120, branchColour, 5, leafColour3, 4);
    ctx.restore();

    ctx.save();
    ctx.translate(-20, (canvas.height * 2) / 3 + 50);
    ctx.rotate(0.4);
    drawTreeBranch(ctx, 125, branchColour, 5, leafColour3, 3);
    ctx.restore();
  };

  useEffect(() => {
    const drawTrees = () => {
      drawTree1();
      drawTree2();
    };
    drawTrees();
    window.addEventListener("resize", drawTrees);
    return () => {
      window.removeEventListener("resize", drawTrees);
    };
  }, []);

  return (
    <>
      <canvas
        ref={tree1Ref}
        className={`${styles.tree} ${styles.tree1}`}
      ></canvas>
      <canvas
        ref={tree2Ref}
        className={`${styles.tree} ${styles.tree2}`}
      ></canvas>
    </>
  );
};

const Room = () => {
  return (
    <div className={styles.room}>
      <div className={`${styles.window} ${styles.leftWindow}`}></div>
      <div className={`${styles.window} ${styles.rightWindow}`}></div>
      <div className={`${styles.floor} ${styles.leftFloor}`}></div>
      <div className={`${styles.floor} ${styles.rightFloor}`}></div>
    </div>
  );
};
