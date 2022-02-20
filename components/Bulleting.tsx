import React, { useState, useRef, useEffect } from "react";
import styles from "../styles/Bulleting.module.scss";

import { Button } from "@mui/material";
import { getRandomArbitrary } from "../utils/general";

import { Bullet } from "../models/bullet";
import { Directions } from "../models/directions";

// Game difficulty settings
let charSpeed = 2;
let charSize = 10;
let bulletSpeed = 10;
let bulletSize = 10;

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

export default function Bulleting() {
  // For game mechanics
  const containerRef = useRef<HTMLDivElement>(null);
  const charRef = useRef<HTMLDivElement>(null);
  const [bullets, setBullets] = useState<Bullet[]>([]);
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

      // Spawn a new bullet in every second
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
      }, 1000);

      // Game loop, 10ms refresh rate
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

        // Bullets movement
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
              isColliding(
                char.offsetLeft,
                char.offsetTop,
                charSize,
                newBullet.left,
                newBullet.top,
                bulletSize
              )
            ) {
              exitGame();
            }

            newBullets.push(newBullet);
          }
          return newBullets;
        });
      }, 10);

      // Exit game
      const exitGame = () => {
        clearInterval(gameId);
        clearInterval(bulletSpawnerId);
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

  const restartGame = () => {
    if (charRef.current) {
      charRef.current.style.left = `calc(50% - ${charSize / 2}px`;
      charRef.current.style.top = `calc(50% - ${charSize / 2}px`;
    }
    setBullets([]);
    initGame();
  };

  const resetKeyState = () => {
    keyState.up = 0;
    keyState.down = 0;
    keyState.left = 0;
    keyState.right = 0;
  };

  return (
    <div>
      <div className={styles.header}>
        <div className={styles.score}>
          Score: <span>{bullets.length}</span>
        </div>
        <div className={styles.score + " " + styles.top}>
          Best: <span>{topScore}</span>
        </div>
      </div>
      <div className={styles.gameContainer} ref={containerRef}>
        <div
          className={styles.character}
          ref={charRef}
          style={{ "--size": `${charSize}px` } as React.CSSProperties}
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
              } as React.CSSProperties
            }
          />
        ))}

        {gameEnded && (
          <div className={styles.gameOverContainer}>
            <div className={styles.gameOverText}>Game Over...</div>
            <Button variant="contained" onClick={restartGame}>
              Restart
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
