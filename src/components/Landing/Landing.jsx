import React, { useState } from 'react';
import './Landing.scss';
import logo from '../../assets/oka-logo.png';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';

function Landing() {
    const [searchText, setSearchText] = useState("");

    const handleClick = () => {
        const queryString = searchText.replace(" ", "+");
        window.location.href = "https://www.google.com/search?q=" + queryString;
    }

    const handleKeyPress = (e) => {
        if (e.keyCode === 13) {
            const queryString = e.target.value.replace(" ", "+");
            window.location.href = "https://www.google.com/search?q=" + queryString;
        }
    }

    return (
        <div className="landing-container">
            <img src={logo} className="landing-img" alt=""/>
            <ButtonGroup className="landing-search-container">
                <TextField label="Search with Google" variant="outlined" size="small"
                        className="landing-search-bar"
                        onKeyDown={(e) => handleKeyPress(e)}
                        onChange={(e) => setSearchText(e.target.value)}/>
                <Button variant="contained" color="primary"
                        startIcon={<SearchIcon/>}
                        className="landing-search-button"
                        onClick={handleClick}>
                    Search
                </Button>
            </ButtonGroup>
        </div>
    );
}
 
export default Landing;