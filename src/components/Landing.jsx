import React, { useState } from 'react';
import logo from '../img/oka-logo.png';

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
            <div className="input-group landing-searchbar">
                <input type="text"
                        className="form-control"
                        placeholder="Search the web" 
                        onKeyDown={(e) => handleKeyPress(e)}
                        onChange={(e) => setSearchText(e.target.value)} />
                <div className="input-group-append">
                    <button className="btn btn-primary"
                            type="button" 
                            onClick={handleClick}>
                        Search
                    </button>
                </div>
            </div>
        </div>
    );
}
 
export default Landing;