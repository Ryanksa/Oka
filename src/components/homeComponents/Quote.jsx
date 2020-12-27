import React, { Component } from 'react';
import openQuote from '../../img/open-quote.png'
import { getRandomQuote } from '../../services/quotes-service';

class Quote extends Component {
    constructor(props) {
        super(props);
        this.state = {
            quote: "",
            author: ""
        };
    }

    componentDidMount() {
        getRandomQuote().then(
            (r) => {
                this.setState({
                    quote: r.data.content,
                    author: r.data.author
                });
            },
            (err) => {
                console.log(err);
            }
        );
    }
    
    render() { 
        return (
            <div className="quote-container">
                <h3 className="float-right">Quote of the day</h3>
                <img src={openQuote} className="quote-open"/>
                <p className="quote-content">{this.state.quote}</p>
                {this.state.author && 
                <p className="quote-author">- {this.state.author}</p>}
            </div>
        );
    }
}
 
export default Quote;