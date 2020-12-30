import React, { Component } from 'react';
import '../styles/Components.css';
import WorkmapBoard from './workmapComponents/WorkmapBoard';

class Workmap extends Component {
    constructor(props) {
        super(props);
        this.state = {
            itemList: []
        };
    }

    componentDidMount() {
        
    }
    
    render() { 
        return (
            <div className="workmap-container">
                <WorkmapBoard/>
            </div>
        );
    }
}
 
export default Workmap;