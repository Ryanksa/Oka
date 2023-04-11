import {
  useState,
  useRef,
  useEffect,
  useCallback,
  CSSProperties,
  useMemo,
} from "react";
import styles from "../styles/Bulleting.module.scss";
import { getRandomArbitrary, getRandomInt } from "../utils/general";
import { Directions, Bullet, Buff } from "../models/bulleting";
import { BsFillHeartFill } from "react-icons/bs";
import { MdSpeed, MdZoomOut } from "react-icons/md";
import { GiHourglass } from "react-icons/gi";
import { AiFillFastBackward } from "react-icons/ai";
import { updateBulletingTopScore } from "../firebase";

// Game difficulty settings
let charSpeed = 4;
let charSize = 12;
let iframeDuration = 500;
let bulletSpeed = 6;
let bulletSpeedScale = 0.3;
let bulletSize = 10;
let bulletSpawnInterval = 1000;
let buffSize = 20;
let buffSpawnInterval = 5000;

const resetDiffucltySettings = () => {
  charSpeed = 4;
  charSize = 12;
  iframeDuration = 500;
  bulletSpeed = 6;
  bulletSpeedScale = 0.3;
  bulletSize = 10;
  bulletSpawnInterval = 1000;
  buffSize = 20;
  buffSpawnInterval = 5000;
};

// Key states to control player movement
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

enum GameStates {
  PLAYING,
  ENDED,
}

type Props = {
  topScore: number;
};

const Bulleting = ({ topScore }: Props) => {
  // Refs to container and player
  const containerRef = useRef<HTMLDivElement>(null);
  const charRef = useRef<HTMLDivElement>(null);

  // Game and player states
  const [gameState, setGameState] = useState(GameStates.PLAYING);
  const [lives, setLives] = useState(3);

  // Game entities
  const [bullets, setBullets] = useState<Bullet[]>([]);
  const [buffs, setBuffs] = useState<Buff[]>([]);
  const buffTypes = useMemo(
    () => [
      {
        id: 0,
        effect: () => setLives((lives) => lives + 1),
        icon: <BsFillHeartFill className={styles.lifeIcon} />,
      },
      {
        id: 1,
        effect: () => (charSpeed += 0.5),
        icon: <MdSpeed className={styles.speedIcon} />,
      },
      {
        id: 2,
        effect: () => {
          if (charRef.current && containerRef.current) {
            bulletSpeed /= 10;
            bulletSpeedScale /= 10;
            const effect = document.createElement("div");
            effect.classList.add(styles.zaWarudoEffect);
            effect.style.setProperty(
              "--left",
              charRef.current.offsetLeft + "px"
            );
            effect.style.setProperty("--top", charRef.current.offsetTop + "px");
            containerRef.current.appendChild(effect);

            setTimeout(() => {
              containerRef.current?.removeChild(effect);
              bulletSpeed *= 10;
              bulletSpeedScale *= 10;
            }, 5000);
          }
        },
        icon: <GiHourglass className={styles.zaWarudoIcon} />,
      },
      {
        id: 3,
        effect: () => (charSize = Math.max(charSize - 1.5, 6)),
        icon: <MdZoomOut className={styles.shrinkIcon} />,
      },
      {
        id: 4,
        effect: () => (bulletSpeed = Math.max(bulletSpeed - 2, 0)),
        icon: <AiFillFastBackward className={styles.slowIcon} />,
      },
    ],
    []
  );

  const resetGame = useCallback(() => {
    if (!charRef.current) return;

    resetDiffucltySettings();

    setBullets([]);
    setBuffs([]);

    setLives(3);
    charRef.current.style.left = `calc(50% - ${charSize / 2}px`;
    charRef.current.style.top = `calc(50% - ${charSize / 2}px`;
  }, []);

  const startGame = useCallback(() => {
    if (!containerRef.current || !charRef.current) return;
    const container = containerRef.current;
    const char = charRef.current;

    const charW = container.offsetWidth - charSize;
    const charH = container.offsetHeight - charSize;
    const bulletW = container.offsetWidth - bulletSize;
    const bulletH = container.offsetHeight - bulletSize;
    const buffW = container.offsetWidth - buffSize;
    const buffH = container.offsetHeight - buffSize;

    // Key event handlers to controll player movement
    const handleKeyDown = (e: KeyboardEvent) => {
      const f = directions[e.code as keyof Directions];
      if (f) f(true);
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      const f = directions[e.code as keyof Directions];
      if (f) f(false);
    };

    let gameEnded = false;
    let iframeOn = false;
    let prevBulletSpawnT = 0;
    let prevBuffSpawnT = 0;

    const exitGame = () => {
      gameEnded = true;
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
      resetKeyState();
      setGameState(GameStates.ENDED);
    };

    const gameLoop = (t: number) => {
      // Update player position based on key state
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

      // Spawn in bullets and speed them up
      let newBullet: Bullet | undefined;
      if (t - prevBulletSpawnT >= bulletSpawnInterval) {
        newBullet = {
          top: getRandomArbitrary(0, bulletH),
          left: getRandomArbitrary(0, bulletW),
          topVelocity: getRandomArbitrary(-1, 1),
          leftVelocity: getRandomArbitrary(-1, 1),
        };
        bulletSpeed += bulletSpeedScale;
        prevBulletSpawnT =
          Math.floor(t / bulletSpawnInterval) * bulletSpawnInterval;
      }

      // Chance to spawn in buffs
      let newBuff: Buff | undefined;
      if (t - prevBuffSpawnT >= buffSpawnInterval) {
        if (getRandomInt(0, 10) > 6) {
          const buffType = getRandomInt(0, buffTypes.length);
          newBuff = {
            top: getRandomArbitrary(0, buffH),
            left: getRandomArbitrary(0, buffW),
            type: buffType,
          };
        }
        prevBuffSpawnT = Math.floor(t / buffSpawnInterval) * buffSpawnInterval;
      }

      // Update bullets positions and check collision
      setBullets((bullets) => {
        if (newBullet) bullets.push(newBullet);
        return bullets.map((bullet) => {
          bullet.top = bullet.top + bullet.topVelocity * bulletSpeed;
          bullet.left = bullet.left + bullet.leftVelocity * bulletSpeed;

          if (bullet.top <= 0) {
            bullet.top = 0;
            bullet.topVelocity *= -1;
          } else if (bullet.top >= bulletH) {
            bullet.top = bulletH;
            bullet.topVelocity *= -1;
          }
          if (bullet.left <= 0) {
            bullet.left = 0;
            bullet.leftVelocity *= -1;
          } else if (bullet.left >= bulletW) {
            bullet.left = bulletW;
            bullet.leftVelocity *= -1;
          }

          if (
            !iframeOn &&
            isColliding(
              char.offsetLeft,
              char.offsetTop,
              charSize,
              bullet.left,
              bullet.top,
              bulletSize
            )
          ) {
            setLives((lives) => {
              if (lives <= 1) {
                exitGame();
                return 0;
              }
              iframeOn = true;
              char.classList.add(styles.hit);
              setTimeout(() => {
                iframeOn = false;
                char.classList.remove(styles.hit);
              }, iframeDuration);
              return lives - 1;
            });
          }

          return bullet;
        });
      });

      // Check buff collision and apply
      setBuffs((buffs) => {
        if (newBuff) buffs.push(newBuff);
        return buffs.filter((buff) => {
          if (
            isColliding(
              char.offsetLeft,
              char.offsetTop,
              charSize,
              buff.left,
              buff.top,
              buffSize
            )
          ) {
            buffTypes[buff.type].effect();
            return false;
          }
          return true;
        });
      });

      if (!gameEnded) {
        window.requestAnimationFrame(gameLoop);
      }
    };

    setGameState(GameStates.PLAYING);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    window.requestAnimationFrame(gameLoop);

    return exitGame;
  }, []);

  useEffect(() => {
    if (gameState === GameStates.ENDED) {
      const newScore = bullets.length;
      if (newScore > topScore) {
        updateBulletingTopScore(newScore);
      }
    } else if (gameState === GameStates.PLAYING) {
      resetGame();
      return startGame();
    }
  }, [gameState]);

  return (
    <div className={styles.bulletingContainer}>
      <div className={styles.stats}>
        <div className={styles.lives}>
          Lives:
          {[...Array(lives)].map((_, idx) => (
            <BsFillHeartFill
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

        {gameState === GameStates.ENDED && (
          <div className={styles.gameOverContainer}>
            <div className={styles.gameOver}>
              <div className={styles.gameOverText}>Game Over</div>
              <div className={styles.topScore}>
                Best Score: <span>{topScore}</span>
              </div>
            </div>
            <button
              className={styles.restartButton}
              onClick={() => setGameState(GameStates.PLAYING)}
            >
              Restart
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bulleting;
