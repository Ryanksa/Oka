import React, { Component } from 'react';
import { geoPropTypes } from 'react-geolocated';
import fish from '../img/yinyangfish.png';

class Landing extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchText: ""
        };
    }

    handleClick = () => {
        const queryString = this.state.searchText.replace(" ", "+");
        window.location.href = "https://www.google.com/search?q=" + queryString;
    }

    handleKeyPress = (e) => {
        if (e.keyCode == 13) {
            const queryString = e.target.value.replace(" ", "+");
            window.location.href = "https://www.google.com/search?q=" + queryString;
        }
    }

    render() { 
        return (
            <div className="landing-container">
                <img src={fish} className="landing-img"/><br/>
                <div className="input-group landing-searchbar">
                    <input type="text"
                           className="form-control"
                           placeholder="Search the web" 
                           onKeyDown={(e) => this.handleKeyPress(e)}
                           onChange={(e) => this.setState({searchText: e.target.value})} />
                    <div className="input-group-append">
                        <button className="btn btn-primary"
                                type="button" 
                                onClick={this.handleClick}>
                            Search
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}
 
export default Landing;