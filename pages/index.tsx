import type { NextPage } from "next";
import { useState, KeyboardEvent } from "react";
import styles from "../src/styles/Landing.module.scss";
import Image from "next/image";
import logo from "../src/assets/oka-logo.png";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";

const Landing: NextPage = () => {
  const [searchText, setSearchText] = useState("");

  const handleClick = () => {
    const queryString = searchText.replace(" ", "+");
    window.open("https://www.google.com/search?q=" + queryString);
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const queryString = (e.target as any).value.replace(" ", "+");
      window.open("https://www.google.com/search?q=" + queryString);
    }
  };

  return (
    <div className={styles.landingContainer}>
      <Image src={logo} alt="" />
      <ButtonGroup className={styles.landingSearchContainer}>
        <TextField
          label="Search with Google"
          variant="outlined"
          size="small"
          className={styles.landingSearchBar}
          onKeyDown={handleKeyPress}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          startIcon={<SearchIcon />}
          className={styles.landingSearchButton}
          onClick={handleClick}
        >
          Search
        </Button>
      </ButtonGroup>
    </div>
  );
};

export default Landing;
