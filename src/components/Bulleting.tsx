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
      // Spawn in bullets and speed them up
      if (t - prevBulletSpawnT >= bulletSpawnInterval) {
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
        prevBulletSpawnT =
          Math.floor(t / bulletSpawnInterval) * bulletSpawnInterval;
      }

      // Chance to spawn in buffs
      if (t - prevBuffSpawnT >= buffSpawnInterval) {
        if (getRandomInt(0, 10) > 6) {
          const buffId = getRandomInt(0, buffTypes.length);
          setBuffs((buffs) => [
            ...buffs,
            {
              top: getRandomArbitrary(0, buffH),
              left: getRandomArbitrary(0, buffW),
              type: buffId,
            },
          ]);
        }
        prevBuffSpawnT = Math.floor(t / buffSpawnInterval) * buffSpawnInterval;
      }

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

      // Update bullets positions and check collision
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

          newBullets.push(newBullet);
        }
        return newBullets;
      });

      // Check buff collision and apply
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
    if (gameState === GameStates.PLAYING) {
      if (!charRef.current) return;
      charRef.current.style.left = `calc(50% - ${charSize / 2}px`;
      charRef.current.style.top = `calc(50% - ${charSize / 2}px`;
      resetDiffucltySettings();
      setBullets([]);
      setBuffs([]);
      setLives(3);
      return startGame();
    }

    if (gameState === GameStates.ENDED) {
      const newScore = bullets.length;
      if (newScore > topScore) {
        updateBulletingTopScore(newScore);
      }
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
