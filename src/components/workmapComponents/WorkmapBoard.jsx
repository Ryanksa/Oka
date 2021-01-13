import React, { useState, useContext, useEffect } from 'react';
import Draggable from 'react-draggable';
import '../../styles/WorkmapComponents.css';
import upload from '../../img/upload.png'
import firebaseApp from '../../firebase';
import { AuthContext } from '../Auth';

const topLeftPath = (x, y) => {
    return("M" + x + " " + (y+10) +
        "L" + x + " " + y +
        "L" + (x+10) + " " + y);
}

const botRightPath = (x, y) => {
    return("M" + (x+54) + " " + (y+53) +
        "L" + (x+54) + " " + (y+63) +
        "L" + (x+44) + " " + (y+63));
}

const iconPath = (x, y) => {
    return("M" + (x+15) + " " + (y+5) +
        "L" + (x+25) + " " + (y+15) +
        "L" + (x+15) + " " + (y+25) +
        "M" + (x+38) + " " + (y+15) +
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
                itemRects[i].style.visibility = "hidden";
                const itemRect = itemRects[i].getBoundingClientRect();
                const p = itemsRef.doc(itemRects[i].id).update({
                    x: itemRect.x - bgRect.x,
                    y: itemRect.y - bgRect.y
                });
                promiseList.push(p);
            }
            Promise.all(promiseList).then(() => {
                window.location.reload();
                for (var i = 0; i < itemRects.length; i++) {
                    itemRects[i].style.visibility = "visible";
                }
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
                        due: doc.data().due ? doc.data().due.toDate() : null,
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
                            <path className="topLeft" d={topLeftPath(i.x, i.y)} fill="none" stroke="Crimson" strokeWidth="2"/>
                            <path className="botRight" d={botRightPath(i.x, i.y)} fill="none" stroke="Crimson" strokeWidth="2"/>
                            <path d={iconPath(i.x, i.y)} fill="none" stroke="IndianRed" strokeWidth="5"/>
                            <text x={i.x+27} y={i.y+48} textAnchor="middle" fontFamily="monospace" fontSize="10px">
                                {i.abbrev}
                            </text>
                            <text x={i.x+27} y={i.y+58} textAnchor="middle" fontFamily="monospace" fontSize="8px">
                                {i.due && (i.due.getMonth()+1)+"/"+i.due.getDate()+"/"+i.due.getFullYear()}
                            </text>
                        </g>
                    </Draggable>
                ))}
            </svg>
            <img src={upload} className="workmap-upload" onClick={savePositions} alt=""/>
        </div>
    );
}
 
export default WorkmapBoard;