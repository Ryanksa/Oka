import { useState, useEffect, useRef, useSyncExternalStore } from "react";
import styles from "../styles/Sidebar.module.scss";
import { userStore } from "../stores";
import { signInWithGoogle, signOutOfGoogle } from "../firebase";
import logo from "../assets/oka-logo.png";
import { FiMenu } from "react-icons/fi";
import { RiMenu2Line } from "react-icons/ri";
import { HiHome } from "react-icons/hi";
import { IoMdMap, IoMdSettings } from "react-icons/io";
import { MdSpa } from "react-icons/md";
import { ImExit } from "react-icons/im";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

const Sidebar = () => {
  const user = useSyncExternalStore(
    userStore.subscribe,
    userStore.getSnapshot,
    userStore.getServerSnapshot
  );
  const [expanded, setExpanded] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const hideSidebarCallback = (e: MouseEvent) => {
      if (!sidebarRef || !sidebarRef.current) {
        return;
      }
      if (!sidebarRef.current.contains(e.target as Node)) {
        setExpanded(false);
      }
    };

    let f: NodeJS.Timeout | null = null;
    const showSidebarCallback = (e: MouseEvent) => {
      if (!f && e.clientX === 0) {
        f = setTimeout(() => setExpanded(true), 300);
      } else if (f && e.clientX !== 0) {
        clearTimeout(f);
        f = null;
      }
    };

    document.addEventListener("mouseup", hideSidebarCallback);
    document.addEventListener("mousemove", showSidebarCallback);

    return () => {
      document.removeEventListener("mouseup", hideSidebarCallback);
      document.removeEventListener("mousemove", showSidebarCallback);
    };
  }, []);

  const handleExpandCollapse = () => {
    setExpanded((prevState) => {
      return !prevState;
    });
  };

  const sidebarOptionClass = (path: string): string => {
    if (typeof window !== "undefined") {
      const currPath = router.asPath;
      if (currPath === path) {
        return `${styles.sidebarOption} ${styles.active}`;
      }
    }
    return styles.sidebarOption;
  };

  return (
    <>
      <div
        ref={sidebarRef}
        className={`${styles.sidebarContainer} ${
          expanded ? styles.expanded : ""
        }`}
      >
        {!expanded && (
          <div
            tabIndex={0}
            className={"icon-button " + styles.menuIcon}
            onClick={handleExpandCollapse}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleExpandCollapse();
            }}
          >
            <FiMenu fontSize={30} />
          </div>
        )}
        {expanded && (
          <div className={styles.sidebar}>
            <Link href="/">
              <div
                className={styles.logoContainer}
                onClick={handleExpandCollapse}
              >
                <Image src={logo} alt="" width={165} />
              </div>
            </Link>

            <div className={styles.optionsContainer}>
              <Link
                href="/home"
                className={sidebarOptionClass("/home")}
                onClick={handleExpandCollapse}
              >
                <HiHome fontSize={30} />
                <span>Home</span>
              </Link>
              <Link
                href="/workmap"
                className={sidebarOptionClass("/workmap")}
                onClick={handleExpandCollapse}
              >
                <IoMdMap fontSize={30} />
                <span>Workmap</span>
              </Link>
              <Link
                href="/takeabreak"
                className={sidebarOptionClass("/takeabreak")}
                onClick={handleExpandCollapse}
              >
                <MdSpa fontSize={30} />
                <span>Take a Break</span>
              </Link>
              <Link
                href="/settings"
                className={sidebarOptionClass("/settings")}
                onClick={handleExpandCollapse}
              >
                <IoMdSettings fontSize={30} />
                <span>Settings</span>
              </Link>

              <div className={styles.bottomOptions}>
                <div
                  className={styles.sidebarOption}
                  onClick={handleExpandCollapse}
                >
                  <RiMenu2Line fontSize={30} />
                  <span>Hide</span>
                </div>

                {!!user ? (
                  <div
                    className={styles.sidebarOption}
                    onClick={signOutOfGoogle}
                  >
                    <ImExit fontSize={30} />
                    <span>Sign Out</span>
                  </div>
                ) : (
                  <div
                    className={styles.sidebarOption}
                    onClick={signInWithGoogle}
                  >
                    <ImExit fontSize={30} />
                    <span>Sign In</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      {expanded && (
        <div className={styles.overlay} onClick={handleExpandCollapse} />
      )}
    </>
  );
};

export default Sidebar;
