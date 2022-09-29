import React, { useState, useEffect, useRef } from "react";
import styles from "../styles/Sidebar.module.scss";
import {
  userStore,
  addUserStoreListener,
  removeUserStoreListener,
} from "../stores";
import { signInWithGoogle, signOutOfGoogle } from "../firebase";

import logo from "../assets/oka-logo.png";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import HomeIcon from "@mui/icons-material/Home";
import MapIcon from "@mui/icons-material/Map";
import SpaIcon from "@mui/icons-material/Spa";
import SettingsIcon from "@mui/icons-material/Settings";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import IconButton from "@mui/material/IconButton";

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
          <IconButton size="large" onClick={handleExpandCollapse}>
            <MenuIcon fontSize="large" />
          </IconButton>
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
                  <HomeIcon htmlColor="white" fontSize="large" />
                  <span>Home</span>
                </a>
              </Link>
              <Link href="/workmap" passHref>
                <a
                  className={sidebarOptionClass("/workmap")}
                  onClick={handleExpandCollapse}
                >
                  <MapIcon htmlColor="white" fontSize="large" />
                  <span>Workmap</span>
                </a>
              </Link>
              <Link href="/takeabreak" passHref>
                <a
                  className={sidebarOptionClass("/takeabreak")}
                  onClick={handleExpandCollapse}
                >
                  <SpaIcon htmlColor="white" fontSize="large" />
                  <span>Take a Break</span>
                </a>
              </Link>
              <Link href="/settings" passHref>
                <a
                  className={sidebarOptionClass("/settings")}
                  onClick={handleExpandCollapse}
                >
                  <SettingsIcon htmlColor="white" fontSize="large" />
                  <span>Settings</span>
                </a>
              </Link>

              <div className={styles.bottomOptions}>
                <div
                  className={styles.sidebarOption}
                  onClick={handleExpandCollapse}
                >
                  <MenuOpenIcon htmlColor="white" fontSize="large" />
                  <span>Hide</span>
                </div>

                {isSignedIn ? (
                  <div
                    className={styles.sidebarOption}
                    onClick={signOutOfGoogle}
                  >
                    <ExitToAppIcon htmlColor="white" fontSize="large" />
                    <span>Sign Out</span>
                  </div>
                ) : (
                  <div
                    className={styles.sidebarOption}
                    onClick={signInWithGoogle}
                  >
                    <ExitToAppIcon htmlColor="white" fontSize="large" />
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
