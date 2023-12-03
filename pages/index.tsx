import type { NextPage } from "next";
import { useSignal } from "@preact/signals-react";
import styles from "../src/styles/Landing.module.scss";
import Image from "next/image";
import OkaHead from "../src/components/OkaHead";
import IconButton from "../src/components/IconButton";
import logo from "../src/assets/oka-logo.png";
import { BiSearchAlt2 } from "react-icons/bi";

const Landing: NextPage = () => {
  const searchText = useSignal("");

  const handleSearch = () => {
    const queryString = searchText.value.replace(" ", "+");
    window.open("https://www.google.com/search?q=" + queryString);
  };

  return (
    <>
      <OkaHead title="Oka" />
      <div className={styles.landingContainer}>
        <Image
          src={logo}
          alt=""
          className={styles.landingLogo}
          priority={true}
        />
        <div
          className={styles.landingSearchContainer}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
        >
          <input
            placeholder="Search with Google"
            className={styles.landingSearchBar}
            value={searchText.value}
            onChange={(e) => (searchText.value = e.target.value)}
          />
          <IconButton onClick={handleSearch} tabIndex={0}>
            <BiSearchAlt2 />
          </IconButton>
        </div>
      </div>
    </>
  );
};

export default Landing;
