import type { NextPage } from "next";
import { useState } from "react";
import styles from "../src/styles/Landing.module.scss";
import Image from "next/image";
import OkaHead from "../src/components/OkaHead";
import logo from "../src/assets/oka-logo.png";
import { BiSearchAlt2 } from "react-icons/bi";

const Landing: NextPage = () => {
  const [searchText, setSearchText] = useState("");

  const handleSearch = () => {
    const queryString = searchText.replace(" ", "+");
    window.open("https://www.google.com/search?q=" + queryString);
  };

  return (
    <>
      <OkaHead title="Oka" />
      <div className={styles.landingContainer}>
        <Image src={logo} alt="" />
        <div
          className={styles.landingSearchContainer}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
        >
          <input
            placeholder="Search with Google"
            className={styles.landingSearchBar}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <div className="icon-button" onClick={handleSearch} tabIndex={0}>
            <BiSearchAlt2 />
          </div>
        </div>
      </div>
    </>
  );
};

export default Landing;
