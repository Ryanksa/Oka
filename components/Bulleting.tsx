import React, { useState, useRef, useEffect, CSSProperties } from "react";
import styles from "../styles/Bulleting.module.scss";
import { getRandomArbitrary, getRandomInt } from "../utils/general";
import { Directions, Bullet, Buff } from "../models/bulleting";
import { Button } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FastForwardIcon from "@mui/icons-material/FastForward";
import TimerIcon from "@mui/icons-material/Timer";

const REFRESH_RATE = 10;

// Game difficulty settings
let charSpeed = 3;
let charSize = 15;
let iframeDuration = 500;
let bulletSpeed = 3;
let bulletSpeedScale = 0.2;
let bulletSize = 10;
let bulletSpawnInterval = 1000;
let buffSize = 20;
let buffSpawnInterval = 5000;

const resettingDiffucltSettings = () => {
  charSpeed = 3;
  charSize = 15;
  iframeDuration = 500;
  bulletSpeed = 3;
  bulletSpeedScale = 0.2;
  bulletSize = 10;
  bulletSpawnInterval = 1000;
  buffSize = 20;
  buffSpawnInterval = 5000;
};

// For controlling character
const keyState = {
  up: 0,
  down: 0,
  left: 0,
  right: 0,
};
const directions: Directions = {
  ArrowUp: (keyDown: boolean) => {
    if (keyDown) keyState.up = charSpeed;
    else keyState.up = 0;
  },
  ArrowDown: (keyDown: boolean) => {
    if (keyDown) keyState.down = charSpeed;
    else keyState.down = 0;
  },
  ArrowLeft: (keyDown: boolean) => {
    if (keyDown) keyState.left = charSpeed;
    else keyState.left = 0;
  },
  ArrowRight: (keyDown: boolean) => {
    if (keyDown) keyState.right = charSpeed;
    else keyState.right = 0;
  },
};
const resetKeyState = () => {
  keyState.up = 0;
  keyState.down = 0;
  keyState.left = 0;
  keyState.right = 0;
};

// Collision logic
const isColliding = (
  l1: number,
  t1: number,
  s1: number,
  l2: number,
  t2: number,
  s2: number
) => {
  const l2l1 = l2 - l1;
  const t2t1 = t2 - t1;
  return (
    ((l2l1 >= 0 && l2l1 <= s1) || (l2l1 <= 0 && l2l1 >= -s2)) &&
    ((t2t1 >= 0 && t2t1 <= s1) || (t2t1 <= 0 && t2t1 >= -s2))
  );
};
let iframeOn = false;

// Game buffs
const buffs = {
  health: 0,
  speed: 1,
  zaWarudo: 2,
};

export default function Bulleting() {
  // For game mechanics
  const containerRef = useRef<HTMLDivElement>(null);
  const charRef = useRef<HTMLDivElement>(null);
  const [bullets, setBullets] = useState<Bullet[]>([]);
  const [lives, setLives] = useState(3);
  const [buffs, setBuffs] = useState<Buff[]>([]);
  const buffTypes = [
    {
      id: 0,
      effect: () => setLives((lives) => lives + 1),
      icon: <FavoriteIcon className={styles.lifeIcon} />,
    },
    {
      id: 1,
      effect: () => (charSpeed += 0.5),
      icon: <FastForwardIcon className={styles.speedIcon} />,
    },
    {
      id: 2,
      effect: () => {
        if (charRef.current && containerRef.current) {
          bulletSpeed /= 4;
          bulletSpeedScale /= 4;
          const effect = document.createElement("div");
          effect.classList.add(styles.zaWarudoEffect);
          effect.style.setProperty("--left", charRef.current.offsetLeft + "px");
          effect.style.setProperty("--top", charRef.current.offsetTop + "px");
          containerRef.current.appendChild(effect);

          setTimeout(() => {
            containerRef.current?.removeChild(effect);
            bulletSpeed *= 4;
            bulletSpeedScale *= 4;
          }, 5000);
        }
      },
      icon: <TimerIcon className={styles.zaWarudoIcon} />,
    },
  ];

  // For game states
  const [gameEnded, setGameEnded] = useState(false);
  const [topScore, setTopScore] = useState(0);

  const initGame = () => {
    setGameEnded(false);

    if (containerRef.current && charRef.current) {
      const container = containerRef.current;
      const char = charRef.current;

      // Max dimensions
      const charW = container.offsetWidth - charSize;
      const charH = container.offsetHeight - charSize;
      const bulletW = container.offsetWidth - bulletSize;
      const bulletH = container.offsetHeight - bulletSize;
      const buffW = container.offsetWidth - buffSize;
      const buffH = container.offsetHeight - buffSize;

      // For controlling character
      const keydownCallback = (e: KeyboardEvent) => {
        const f = directions[e.code as keyof Directions];
        if (f) f(true);
      };
      const keyupCallback = (e: KeyboardEvent) => {
        const f = directions[e.code as keyof Directions];
        if (f) f(false);
      };
      document.addEventListener("keydown", keydownCallback);
      document.addEventListener("keyup", keyupCallback);

      // Spawn a new bullet in every second and chance to speed up bullets
      let bulletSpawnerId = setInterval(() => {
        setBullets((bullets) => [
          ...bullets,
          {
            top: getRandomArbitrary(0, bulletH),
            left: getRandomArbitrary(0, bulletW),
            topVelocity: getRandomArbitrary(-1, 1),
            leftVelocity: getRandomArbitrary(-1, 1),
          },
        ]);
        bulletSpeed += bulletSpeedScale;
      }, bulletSpawnInterval);

      // Chance to spawn in a buff every 5s
      let buffSpawnerId = setInterval(() => {
        if (getRandomInt(0, 10) < 3) {
          const buffId = getRandomInt(0, 3);
          setBuffs((buffs) => [
            ...buffs,
            {
              top: getRandomArbitrary(0, buffH),
              left: getRandomArbitrary(0, buffW),
              type: buffId,
            },
          ]);
        }
      }, buffSpawnInterval);

      // Game loop
      let gameId = setInterval(() => {
        // Character movement
        if (keyState.up) {
          char.style.top = `${Math.max(char.offsetTop - charSpeed, 0)}px`;
        } else if (keyState.down) {
          char.style.top = `${Math.min(char.offsetTop + charSpeed, charH)}px`;
        }
        if (keyState.left) {
          char.style.left = `${Math.max(char.offsetLeft - charSpeed, 0)}px`;
        } else if (keyState.right) {
          char.style.left = `${Math.min(char.offsetLeft + charSpeed, charW)}px`;
        }

        // Bullets movement and collision logic
        setBullets((bullets) => {
          const newBullets: Bullet[] = [];
          for (let i = 0; i < bullets.length; i++) {
            const newBullet: Bullet = {
              top: bullets[i].top + bullets[i].topVelocity * bulletSpeed,
              left: bullets[i].left + bullets[i].leftVelocity * bulletSpeed,
              topVelocity: bullets[i].topVelocity,
              leftVelocity: bullets[i].leftVelocity,
            };

            if (newBullet.top <= 0) {
              newBullet.top = 0;
              newBullet.topVelocity *= -1;
            } else if (newBullet.top >= bulletH) {
              newBullet.top = bulletH;
              newBullet.topVelocity *= -1;
            }
            if (newBullet.left <= 0) {
              newBullet.left = 0;
              newBullet.leftVelocity *= -1;
            } else if (newBullet.left >= bulletW) {
              newBullet.left = bulletW;
              newBullet.leftVelocity *= -1;
            }

            if (
              !iframeOn &&
              isColliding(
                char.offsetLeft,
                char.offsetTop,
                charSize,
                newBullet.left,
                newBullet.top,
                bulletSize
              )
            ) {
              setLives((lives) => {
                if (lives > 1) {
                  iframeOn = true;
                  char.classList.add(styles.hit);
                  setTimeout(() => {
                    iframeOn = false;
                    char.classList.remove(styles.hit);
                  }, iframeDuration);
                  return lives - 1;
                } else {
                  exitGame();
                  return 0;
                }
              });
            }

            newBullets.push(newBullet);
          }
          return newBullets;
        });

        // Buff collision logic
        setBuffs((buffs) => {
          for (let i = 0; i < buffs.length; i++) {
            if (
              isColliding(
                char.offsetLeft,
                char.offsetTop,
                charSize,
                buffs[i].left,
                buffs[i].top,
                buffSize
              )
            ) {
              const buff = buffTypes[buffs[i].type];
              if (buff) buff.effect();
              return [...buffs.slice(0, i), ...buffs.slice(i + 1)];
            }
          }
          return buffs;
        });
      }, REFRESH_RATE);

      // Exit game
      const exitGame = () => {
        clearInterval(gameId);
        clearInterval(bulletSpawnerId);
        clearInterval(buffSpawnerId);
        document.removeEventListener("keydown", keydownCallback);
        document.removeEventListener("keyup", keyupCallback);
        resetKeyState();
        setGameEnded(true);
      };

      return () => {
        exitGame();
      };
    }
  };

  const restartGame = () => {
    if (charRef.current) {
      charRef.current.style.left = `calc(50% - ${charSize / 2}px`;
      charRef.current.style.top = `calc(50% - ${charSize / 2}px`;
    }
    setBullets([]);
    setBuffs([]);
    setLives(3);
    resettingDiffucltSettings();
    initGame();
  };

  useEffect(initGame, []);

  useEffect(() => {
    const newScore = bullets.length;

    let topScoreString = localStorage.getItem("bulletingTopScore");
    let topScore = 0;
    if (topScoreString) {
      topScore = +topScoreString;
    }

    if (newScore > topScore) {
      localStorage.setItem("bulletingTopScore", "" + newScore);
      setTopScore(newScore);
    } else {
      setTopScore(topScore);
    }
  }, [gameEnded]);

  return (
    <div>
      <div className={styles.stats}>
        <div className={styles.lives}>
          Lives:
          {[...Array(lives)].map((_, idx) => (
            <FavoriteIcon
              key={idx}
              className={styles.lifeIcon}
              style={{ "--size": "20px" } as CSSProperties}
            />
          ))}
        </div>
        <div className={styles.score}>
          Score: <span>{bullets.length}</span>
        </div>
      </div>

      <div className={styles.gameContainer} ref={containerRef}>
        <div
          className={styles.character}
          ref={charRef}
          style={
            {
              "--size": `${charSize}px`,
              "--iframe-duration": `${iframeDuration}ms`,
            } as CSSProperties
          }
        />
        {bullets.map((bullet, idx) => (
          <div
            key={idx}
            className={styles.bullet}
            style={
              {
                "--size": `${bulletSize}px`,
                "--top": `${bullet.top}px`,
                "--left": `${bullet.left}px`,
              } as CSSProperties
            }
          />
        ))}
        {buffs.map((buff, idx) => (
          <div
            key={idx}
            className={styles.buff}
            style={
              {
                "--size": `${buffSize}px`,
                "--top": `${buff.top}px`,
                "--left": `${buff.left}px`,
              } as CSSProperties
            }
          >
            {buffTypes[buff.type].icon}
          </div>
        ))}

        {gameEnded && (
          <div className={styles.gameOverContainer}>
            <div className={styles.gameOver}>
              <div className={styles.gameOverText}>Game Over</div>
              <div className={styles.topScore}>
                Best Score: <span>{topScore}</span>
              </div>
            </div>
            <Button variant="contained" onClick={restartGame}>
              Restart
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
