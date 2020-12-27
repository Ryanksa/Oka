import React, { Component } from 'react';
import openQuote from '../../img/open-quote.png'

class Quote extends Component {
    constructor(props) {
        super(props);
        this.state = {
            quote: "",
            author: ""
        };
    }

    componentDidMount() {
        this.setState({
            quote: "the powerful play goes on, and you will contribute a verse.",
            author: "Walt Whitman"
        });
    }
    
    render() { 
        return (
            <div className="quote-container">
                <h3 className="float-right">Quote of the day</h3>
                <img src={openQuote} className="quote-open"/>
                <p className="quote-content">{this.state.quote}</p>
                <p className="quote-author">- {this.state.author}</p>
            </div>
        );
    }
}
 
export default Quote;