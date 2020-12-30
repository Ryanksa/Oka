import React, { Component } from 'react';
import Draggable from 'react-draggable';
import '../../styles/WorkmapComponents.css';
import ReactModal from 'react-modal';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import plus from '../../img/plus.png';

class WorkmapBoard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            itemList: [],
            modalOpen: false,
            itemName: "",
            itemAbbrev: "",
            itemDescrip: "",
            itemDue: null
        }
    }

    componentDidMount() {
        this.enableZoom();
        const itemList = [
            {x: 10, y: 120, name: "CSCD01 Assignment 1", abbrev: "D01 A1", due: null, description: "I love coding btw"},
            {x: 115, y: 120, name: "CSCC09 Assignment 4", abbrev: "C09 A4", due: null, description: "I ABSOLUTELY love coding btw"},
            {x: 451, y: 335, name: "CSCD01 Final Project", abbrev: "D01 Proj", due: null, description: "I actually HATE coding"},
        ];
        this.setState({itemList});
    }

    enableZoom() {
        // code taken and modified from https://stackoverflow.com/questions/52576376/
        const svg = document.getElementById("workmap-svg");
        const svgContainer = document.getElementById("workmap-svg-container");

        var viewBox = {x:0,y:0,w:svg.clientWidth,h:svg.clientHeight};
        svg.setAttribute('viewBox', `${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`);
        const svgSize = {w:svg.clientWidth,h:svg.clientHeight};

        svgContainer.onmousewheel = function(e) {
            e.preventDefault();
            var w = viewBox.w;
            var h = viewBox.h;
            var mx = e.offsetX;
            var my = e.offsetY;    
            var dw = w*Math.sign(e.deltaY)*0.05;
            var dh = h*Math.sign(e.deltaY)*0.05;
            var dx = dw*mx/svgSize.w;
            var dy = dh*my/svgSize.h;
            viewBox = {x: viewBox.x+dx, y: viewBox.y+dy, 
                       w: viewBox.w-dw, h: viewBox.h-dh};
            svg.setAttribute('viewBox', `${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`);
        }
    }

    handlePlus = () => {
        this.setState({
            modalOpen: true,
            itemName: "",
            itemAbbrev: "",
            itemDescrip: "",
            itemDue: null
        });
    }

    handleEdit = (item) => {
        this.setState({
            modalOpen: true,
            itemName: item.name,
            itemAbbrev: item.abbrev,
            itemDescrip: item.description,
            itemDue: item.due
        });
    }

    p1calc = (x, y) => {
        return("M" + x + " " + (y+5) +
               "L" + x + " " + y +
               "L" + (x+5) + " " + y);
    }

    p2calc = (x, y) => {
        return("M" + (x+45) + " " + (y+49) +
               "L" + (x+45) + " " + (y+54) +
               "L" + (x+40) + " " + (y+54));
    }

    p3calc = (x, y) => {
        return("M" + (x+12) + " " + (y+5) +
               "L" + (x+22) + " " + (y+15) +
               "L" + (x+12) + " " + (y+25));
    }

    p4calc = (x, y) => {
        return("M" + (x+32) + " " + (y+15) +
               "L" + (x+22) + " " + (y+25) +
               "L" + (x+32) + " " + (y+35));
    }

    render() { 
        var d = new Date();
        const nextDays = [];
        for (var i = 0; i < 5; i++) {
            d.setDate(d.getDate() + 1);
            nextDays.push(d.getFullYear() + "-" + (d.getMonth()+1) + "-" + d.getDate());
        }

        return (
            <div id="workmap-svg-container">
                <h2 className="workmap-header">
                    WorkMap
                    <img className="workmap-header-icon" src={plus} 
                     onClick={this.handlePlus}/>
                </h2>
                <svg id="workmap-svg" width="1200" height="440">
                    <rect id="workmap-bg" x="0" y="0" width="1200" height="440" stroke="GhostWhite" strokeWidth="2" fill="DimGrey"/>
                    <text x="120" y="20" textAnchor="middle" fontFamily="monospace" fontStyle="italic" fontSize="15px">{nextDays[0]}</text>
                    <text x="360" y="20" textAnchor="middle" fontFamily="monospace" fontStyle="italic" fontSize="15px">{nextDays[1]}</text>
                    <text x="600" y="20" textAnchor="middle" fontFamily="monospace" fontStyle="italic" fontSize="15px">{nextDays[2]}</text>
                    <text x="840" y="20" textAnchor="middle" fontFamily="monospace" fontStyle="italic" fontSize="15px">{nextDays[3]}</text>
                    <text x="1080" y="20" textAnchor="middle" fontFamily="monospace" fontStyle="italic" fontSize="15px">{nextDays[4]}</text>
                    <line/>
                    <line x1="240" y1="0" x2="240" y2="440" stroke="GhostWhite" />
                    <line x1="480" y1="0" x2="480" y2="440" stroke="GhostWhite" />
                    <line x1="720" y1="0" x2="720" y2="440" stroke="GhostWhite" />
                    <line x1="960" y1="0" x2="960" y2="440" stroke="GhostWhite" />
                    
                    {this.state.itemList.map((i) => (
                        <Draggable key={i.abbrev}>
                            <g className="board-item">
                                <rect x={i.x} y={i.y} width="45" height="54" fill="Gainsboro"/>
                                <path className="topLeft" d={this.p1calc(i.x, i.y)} fill="none" stroke="Crimson"/>
                                <path className="botRight" d={this.p2calc(i.x, i.y)} fill="none" stroke="Crimson"/>
                                <path d={this.p3calc(i.x, i.y)} fill="none" stroke="IndianRed" strokeWidth="4"/>
                                <path d={this.p4calc(i.x, i.y)} fill="none" stroke="IndianRed" strokeWidth="4"/>
                                <text x={i.x+22} y={i.y+44} textAnchor="middle"
                                      fontFamily="monospace" fontSize="8px"
                                      onClick={() => this.handleEdit(i)}>
                                    {i.abbrev}
                                </text>
                            </g>
                        </Draggable>
                    ))}
                </svg>

                <ReactModal isOpen={this.state.modalOpen}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="newItemTitle">Add/Edit an Item</h5>
                        </div>
                        <div className="modal-body">
                            <form>
                                <label htmlFor="item-name">Name</label>
                                <input id="item-name" type="text" defaultValue={this.state.itemName}
                                        className="form-control item-form"
                                        onClick={event => this.setState({itemName: event.target.value})}/>

                                <label htmlFor="item-abbrev">Abbreviation</label>
                                <input id="item-abbrev" type="text" maxLength="10"
                                        className="form-control item-form" defaultValue={this.state.itemAbbrev}
                                        onClick={event => this.setState({itemAbbrev: event.target.value})}/>

                                <label htmlFor="item-due">Due Date </label>
                                <DatePicker id="item-due" 
                                            className="form-control item-form"
                                            selected={this.state.itemDue}
                                            onChange={date => this.setState({itemDue: date})}
                                            showTimeSelect
                                            dateFormat="MMM dd, h:mm aa"/>
                                <br/>

                                <label htmlFor="item-description">Description</label>
                                <textarea id="item-description" type="text" rows="10"
                                            className="form-control item-form" defaultValue={this.state.itemDescrip}
                                            onClick={event => this.setState({itemDescrip: event.target.value})}/>

                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary"
                                    onClick={() => this.setState({modalOpen: false})}>
                                Close
                            </button>
                            <button type="button" className="btn btn-primary">Save changes</button>
                        </div>
                    </div>
                </ReactModal>

            </div>
        );
    }
}
 
export default WorkmapBoard;