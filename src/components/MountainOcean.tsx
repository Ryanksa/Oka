import { useRef, useEffect } from "react";
import styles from "../styles/MountainOcean.module.scss";
import { midpointDisplace, Point } from "../utils/svg";
import { drawTreeBranch } from "../utils/canvas";

const BRANCH_COLOUR = "#a08a5adc";
const LEAF_COLOUR_1 = "#429b4ca5";
const LEAF_COLOUR_2 = "#83c48ac1";
const LEAF_COLOUR_3 = "#e35353a1";
const LEAF_COLOUR_4 = "#e49637a1";
const LEAF_COLOUR_5 = "#ef6042a5";
const NUM_MOUNTAINS = 3;

const MountainOcean = () => {
  return (
    <div className={`${styles.scene} ${styles.palette}`}>
      <Sky />
      <Clouds />
      <Ocean />
      <Mountains />
      <Trees />
      <Room />
    </div>
  );
};

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

const Clouds = () => {
  return (
    <>
      <div className={`${styles.cloud} ${styles.cloud1}`}></div>
      <div className={`${styles.cloud} ${styles.cloud2}`}></div>
    </>
  );
};

const Ocean = () => {
  return (
    <div className={styles.ocean}>
      <svg height="120" width="150" className={styles.reflectedSunlight}>
        <polygon points="0,0 150,0 75,120" />
        <filter id="reflected-sunlight">
          <feTurbulence
            id="reflected-sunlight-turbulence"
            type="turbulence"
            numOctaves="6"
            baseFrequency="0 9"
          ></feTurbulence>
          <feDisplacementMap scale="120" in="SourceGraphic"></feDisplacementMap>
          <animate
            xlinkHref="#reflected-sunlight-turbulence"
            attributeName="baseFrequency"
            dur="30s"
            keyTimes="0;0.5;1"
            values="0 9;0 9.03;0 9"
            repeatCount="indefinite"
          />
        </filter>
      </svg>
      <div className={styles.oceanWaves}>
        <div className={`${styles.wave} ${styles.wave1}`}></div>
        <div className={`${styles.wave} ${styles.wave2}`}></div>
        <div className={`${styles.wave} ${styles.wave3}`}></div>
        <div className={`${styles.wave} ${styles.wave4}`}></div>
        <div className={`${styles.wave} ${styles.wave5}`}></div>
        <div className={`${styles.wave} ${styles.wave6}`}></div>
      </div>
      <svg>
        <filter id="ocean-wave" x="0" y="0" width="100%" height="100%">
          <feTurbulence numOctaves="3" baseFrequency="0.03 0.06"></feTurbulence>
          <feDisplacementMap scale="9" in="SourceGraphic"></feDisplacementMap>
        </filter>
      </svg>
    </div>
  );
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
      <svg className={styles.mountains} viewBox="-60 40 100 100">
        <ellipse
          className={styles.mountainBase}
          cx="100"
          cy="95"
          rx="100"
          ry="3"
        ></ellipse>
        {[...Array(NUM_MOUNTAINS)].map(() => (
          <>
            <path
              className={styles.mountain2}
              d={
                generateMountainPath({ x: 0, y: 95 }, { x: 100, y: 35 }, 5) +
                generateMountainPath({ x: 100, y: 35 }, { x: 200, y: 95 }, 5)
              }
            ></path>
            <path
              className={styles.mountain2}
              d={
                generateMountainPath({ x: 25, y: 95 }, { x: 100, y: 40 }, 5) +
                generateMountainPath({ x: 100, y: 40 }, { x: 175, y: 95 }, 5)
              }
            ></path>
            <path
              className={styles.mountain1}
              d={
                generateMountainPath({ x: 10, y: 95 }, { x: 100, y: 60 }, 5) +
                generateMountainPath({ x: 100, y: 60 }, { x: 190, y: 95 }, 5)
              }
            ></path>
            <path
              className={styles.mountain2}
              d={
                generateMountainPath({ x: 10, y: 95 }, { x: 100, y: 75 }, 5) +
                generateMountainPath({ x: 100, y: 75 }, { x: 190, y: 95 }, 5)
              }
            ></path>
            <path
              className={styles.mountain1}
              d={
                generateMountainPath({ x: 10, y: 95 }, { x: 100, y: 85 }, 5) +
                generateMountainPath({ x: 100, y: 85 }, { x: 190, y: 95 }, 5)
              }
            ></path>
          </>
        ))}
      </svg>
      <svg className={styles.mountains} viewBox="70 -10 100 100">
        <path
          className={styles.mountain1}
          d={
            generateMountainPath({ x: -60, y: 100 }, { x: 0, y: 20 }, 6) +
            generateMountainPath({ x: 0, y: 20 }, { x: 60, y: 100 }, 6)
          }
        ></path>
      </svg>
      <MountainTexture />
    </>
  );
};

const MountainTexture = () => {
  return (
    <svg>
      <defs>
        <filter
          id="mountains-turbulence"
          x="0"
          y="0"
          width="100%"
          height="100%"
        >
          <feTurbulence numOctaves="3" baseFrequency="0.06 0.03"></feTurbulence>
          <feDisplacementMap scale="9" in="SourceGraphic"></feDisplacementMap>
        </filter>
        <pattern
          id="mountain-texture-1"
          patternUnits="userSpaceOnUse"
          width="16.5"
          height="32.877"
          patternTransform="scale(0.15)"
        >
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="hsla(131, 39%, 46%, 1)"
          />
          <path
            d="M-5 2l5 10L5 2zm16.5 0l5 10 5-10zM8.25 4.438l-5 10h10zm-5 14l5 10.001 5-10zM0 20.878l-5 10H5zm16.5 0l-5 10h10z"
            stroke-width="1"
            stroke="hsla(96, 34%, 51%, 1)"
            fill="none"
          />
        </pattern>
        <pattern
          id="mountain-texture-2"
          patternUnits="userSpaceOnUse"
          width="16.5"
          height="32.877"
          patternTransform="scale(0.15)"
        >
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="hsla(131, 44%, 43%, 1)"
          />
          <path
            d="M-5 2l5 10L5 2zm16.5 0l5 10 5-10zM8.25 4.438l-5 10h10zm-5 14l5 10.001 5-10zM0 20.878l-5 10H5zm16.5 0l-5 10h10z"
            stroke-width="1"
            stroke="hsla(131, 44%, 38%, 1)"
            fill="none"
          />
        </pattern>
      </defs>
    </svg>
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
    drawTreeBranch(ctx, 150, BRANCH_COLOUR, 5, LEAF_COLOUR_2, 4);
    ctx.restore();

    ctx.save();
    ctx.translate(0, canvas.height / 2);
    ctx.rotate(-0.3);
    drawTreeBranch(ctx, 180, BRANCH_COLOUR, 5, LEAF_COLOUR_3, 5);
    ctx.restore();

    ctx.save();
    ctx.translate(-20, (canvas.height * 3) / 4);
    ctx.rotate(-0.35);
    drawTreeBranch(ctx, 180, BRANCH_COLOUR, 5, LEAF_COLOUR_4, 5);
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
    drawTreeBranch(ctx, 165, BRANCH_COLOUR, 5, LEAF_COLOUR_1, 4);
    ctx.restore();

    ctx.save();
    ctx.translate(0, (canvas.height * 2) / 3 - 50);
    ctx.rotate(0.2);
    drawTreeBranch(ctx, 135, BRANCH_COLOUR, 5, LEAF_COLOUR_5, 4);
    ctx.restore();

    ctx.save();
    ctx.translate(-20, (canvas.height * 2) / 3 + 50);
    ctx.rotate(0.4);
    drawTreeBranch(ctx, 120, BRANCH_COLOUR, 5, LEAF_COLOUR_3, 4);
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
    <>
      <div className={styles.room}>
        <div className={`${styles.window} ${styles.leftWindow}`}></div>
        <div className={`${styles.window} ${styles.rightWindow}`}></div>
        <div className={`${styles.floor} ${styles.leftFloor}`}></div>
        <div className={`${styles.floor} ${styles.rightFloor}`}></div>
      </div>
      <svg>
        <filter id="marble" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.045"
            result="noise"
            numOctaves={6}
          />
          <feDiffuseLighting in="noise" lighting-color="white" surfaceScale="3">
            <feDistantLight azimuth="30" elevation="75" />
          </feDiffuseLighting>
        </filter>
      </svg>
    </>
  );
};

export default MountainOcean;
