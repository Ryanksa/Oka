import React, { useState, useContext, useEffect } from 'react';
import Draggable from 'react-draggable';
import '../../styles/WorkmapComponents.css';
import firebaseApp from '../../firebase';
import { AuthContext } from '../Auth';
import upload from '../../img/upload.png'

const enableZoom = () => {
    // code taken and modified from https://stackoverflow.com/questions/52576376/
    const svg = document.getElementById("workmap-svg");
    const svgContainer = document.getElementById("workmap-svg-container");

    var viewBox = {x:-2,y:-2,w:1204,h:444};
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
        viewBox = {x: viewBox.x-dx, y: viewBox.y-dy, 
                w: viewBox.w+dw, h: viewBox.h+dh};
        svg.setAttribute('viewBox', `${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`);
    }
}

const p1calc = (x, y) => {
    return("M" + x + " " + (y+10) +
        "L" + x + " " + y +
        "L" + (x+10) + " " + y);
}

const p2calc = (x, y) => {
    return("M" + (x+54) + " " + (y+53) +
        "L" + (x+54) + " " + (y+63) +
        "L" + (x+44) + " " + (y+63));
}

const p3calc = (x, y) => {
    return("M" + (x+15) + " " + (y+5) +
        "L" + (x+25) + " " + (y+15) +
        "L" + (x+15) + " " + (y+25));
}

const p4calc = (x, y) => {
    return("M" + (x+38) + " " + (y+15) +
        "L" + (x+28) + " " + (y+25) +
        "L" + (x+38) + " " + (y+35));
}


function WorkmapBoard(props) {
    const [itemList, setItemList] = useState([]);
    const user = useContext(AuthContext);
    
    const savePositions = () => {
        if(user) {
            const bgRect = document.getElementById("workmap-bg").getBoundingClientRect();
            const itemRects = document.getElementsByClassName("workmap-item");

            const itemsRef = firebaseApp.firestore().collection("workmap/" + user.uid + "/items");
            const promiseList = [];
            for (var i = 0; i < itemRects.length; i++) {
                const itemRect = itemRects[i].getBoundingClientRect();
                const p = itemsRef.doc(itemRects[i].id).update({
                    x: itemRect.x - bgRect.x,
                    y: itemRect.y - bgRect.y
                });
                promiseList.push(p);
            }
            Promise.all(promiseList).then(() => {
                window.location.reload();
            });
        }
    }
    
    useEffect(() => {
        if (user) {
            const itemsRef = firebaseApp.firestore().collection("workmap/" + user.uid + "/items");
            const unsub = itemsRef.onSnapshot((qSnapshot) => {
                const itemList = [];
                qSnapshot.forEach(doc => {
                    itemList.push({
                        id: doc.id,
                        name: doc.data().name,
                        abbrev: doc.data().abbrev,
                        due: doc.data().due.toDate(),
                        description: doc.data().description,
                        x: doc.data().x,
                        y: doc.data().y
                    });
                });
                setItemList(itemList);
            });
            return () => unsub();
        }
    }, [user]);

    return (
        <div id="workmap-svg-container">
            <svg id="workmap-svg" width="1200" height="440" viewBox="-2 -2 1204 444">
                <rect id="workmap-bg" x="0" y="0" width="1200" height="440" stroke="Black" strokeWidth="2" fill="DimGrey"/>
                <rect x="0" y="0" width="400" height="40" stroke="black" fill="Crimson"/>
                <rect x="400" y="0" width="400" height="40" stroke="black" fill="LightCoral"/>
                <rect x="800" y="0" width="400" height="40" stroke="black" fill="LightPink"/>
                <line x1="400" y1="0" x2="400" y2="440" stroke="Black" />
                <line x1="800" y1="0" x2="800" y2="440" stroke="Black" />
                <text x="200" y="20" textAnchor="middle" fontFamily="monospace" fontStyle="italic" fontSize="18px">Critical</text>
                <text x="600" y="20" textAnchor="middle" fontFamily="monospace" fontStyle="italic" fontSize="18px">Urgent</text>
                <text x="1000" y="20" textAnchor="middle" fontFamily="monospace" fontStyle="italic" fontSize="18px">Minor</text>
                
                {itemList.map((i) => (
                    <Draggable key={i.id}>
                        <g id={i.id} className="workmap-item">
                            <rect x={i.x} y={i.y} width="54" height="63" fill="Gainsboro"/>
                            <g onClick={() => props.onEdit(i)} className="editGroup">
                                <circle className="editCircle" cx={i.x+46} cy={i.y+8} r="6" fill="GhostWhite"/>
                                <line x1={i.x+42} y1={i.y+8} x2={i.x+50} y2={i.y+8} stroke="LightGrey" strokeWidth="2"/>
                                <line x1={i.x+46} y1={i.y+4} x2={i.x+46} y2={i.y+12} stroke="LightGrey" strokeWidth="2"/>
                            </g>
                            <path className="topLeft" d={p1calc(i.x, i.y)} fill="none" stroke="Crimson" strokeWidth="2"/>
                            <path className="botRight" d={p2calc(i.x, i.y)} fill="none" stroke="Crimson" strokeWidth="2"/>
                            <path d={p3calc(i.x, i.y)} fill="none" stroke="IndianRed" strokeWidth="5"/>
                            <path d={p4calc(i.x, i.y)} fill="none" stroke="IndianRed" strokeWidth="5"/>
                            <text x={i.x+27} y={i.y+48} textAnchor="middle" fontFamily="monospace" fontSize="10px">
                                {i.abbrev}
                            </text>
                            <text x={i.x+27} y={i.y+58} textAnchor="middle" fontFamily="monospace" fontSize="8px">
                                {i.due.getFullYear()}/{i.due.getMonth()+1}/{i.due.getDate()}
                            </text>
                        </g>
                    </Draggable>
                ))}
            </svg>
            <img src={upload} className="workmap-upload" onClick={savePositions}/>
        </div>
    );
}
 
export default WorkmapBoard;