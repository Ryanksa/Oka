import React, { useState, useEffect, useRef } from "react";
import styles from "../styles/Sidebar.module.scss";
import {
  userStore,
  addUserStoreListener,
  removeUserStoreListener,
} from "../stores";
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
  const [isSignedIn, setIsSignedIn] = useState(Boolean(userStore.user));
  const [expanded, setExpanded] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const callback = () => {
      setIsSignedIn(Boolean(userStore.user));
    };
    addUserStoreListener(callback);

    return () => removeUserStoreListener(callback);
  }, []);

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
            className={"icon-button " + styles.menuIcon}
            onClick={handleExpandCollapse}
          >
            <FiMenu fontSize={30} />
          </div>
        )}
        {expanded && (
          <div className={styles.sidebar}>
            <Link href="/" passHref>
              <div
                className={styles.logoContainer}
                onClick={handleExpandCollapse}
              >
                <Image src={logo} alt="" />
              </div>
            </Link>

            <div className={styles.optionsContainer}>
              <Link href="/home" passHref>
                <a
                  className={sidebarOptionClass("/home")}
                  onClick={handleExpandCollapse}
                >
                  <HiHome fontSize={30} />
                  <span>Home</span>
                </a>
              </Link>
              <Link href="/workmap" passHref>
                <a
                  className={sidebarOptionClass("/workmap")}
                  onClick={handleExpandCollapse}
                >
                  <IoMdMap fontSize={30} />
                  <span>Workmap</span>
                </a>
              </Link>
              <Link href="/takeabreak" passHref>
                <a
                  className={sidebarOptionClass("/takeabreak")}
                  onClick={handleExpandCollapse}
                >
                  <MdSpa fontSize={30} />
                  <span>Take a Break</span>
                </a>
              </Link>
              <Link href="/settings" passHref>
                <a
                  className={sidebarOptionClass("/settings")}
                  onClick={handleExpandCollapse}
                >
                  <IoMdSettings fontSize={30} />
                  <span>Settings</span>
                </a>
              </Link>

              <div className={styles.bottomOptions}>
                <div
                  className={styles.sidebarOption}
                  onClick={handleExpandCollapse}
                >
                  <RiMenu2Line fontSize={30} />
                  <span>Hide</span>
                </div>

                {isSignedIn ? (
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
