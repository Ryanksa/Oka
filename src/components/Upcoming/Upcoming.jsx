import React, { useState, useContext, useEffect } from 'react';
import './Upcoming.css';
import firebaseApp from '../../firebase';
import { AuthContext } from '../../auth';
import { Link } from "react-router-dom";
import Countdown from 'react-countdown';

function formatDueDate(time) {
    if (!time) {
        return "No Due Date";
    } else if (time >= (new Date().getTime() + 86400000)) {
        const year = time.getFullYear();
        const month = time.getMonth() + 1;
        const day = time.getDate();
        const weekdays = ["Sun", "Mon", "Tues", "Wed", "Thu", "Fri", "Sat"];
        return "Due " + weekdays[time.getDay()] + " " + month + "/" + day + "/" + year;
    } else {
        return (<Countdown date={time} renderer={({hours, minutes, seconds, completed}) => {
            if (completed) {
                return "Overdue!";
            } else {
                return "Due in " + hours + ":" + minutes + ":" + seconds;
            }
        }}/>);
    }
}

function Upcoming() { 
    const [itemList, setItemList] = useState([]);
    const user = useContext(AuthContext);

    const handleFinish = (itemId) => {
        if (user) {
            const itemsRef = firebaseApp.firestore().collection("workmap/" + user.uid + "/items");
            itemsRef.doc(itemId).delete();
        }
    }

    useEffect(() => {
        if (user) {
            const itemsRef = firebaseApp.firestore().collection("workmap/" + user.uid + "/items");
            const unsub = itemsRef.orderBy("due").onSnapshot((qSnapshot) => {
                const itemList = [];
                const nullList = [];
                qSnapshot.forEach(doc => {
                    if (doc.data().due) {
                        itemList.push({
                            id: doc.id,
                            name: doc.data().name,
                            abbrev: doc.data().abbrev,
                            due: doc.data().due.toDate(),
                            description: doc.data().description,
                            x: doc.data().x,
                            y: doc.data().y
                        });
                    } else {
                        nullList.push({
                            id: doc.id,
                            name: doc.data().name,
                            abbrev: doc.data().abbrev,
                            due: null,
                            description: doc.data().description,
                            x: doc.data().x,
                            y: doc.data().y
                        });
                    }
                });
                setItemList(itemList.concat(nullList));
            });
            return () => unsub();
        }
    }, [user]);

    return (
        <div className="upcoming-container">
            <h4 className="upcoming-header">
                Upcoming Due Dates
                <Link to="/workmap" className="btn btn-primary upcoming-button">WorkMap →</Link>
            </h4>

            <div className="upcoming-card-list">
                {itemList.map((item) => (
                    <div key={item.id} className={item.due && (item.due < (new Date().getTime() + 86400000)) ? "upcoming-card due-soon" : "upcoming-card"}>
                        <div className="upcoming-card-header">
                            <p>{item.abbrev}</p>
                            <div>{formatDueDate(item.due)}</div>
                        </div>
                        <div className="upcoming-card-body">
                            <h5>{item.name}</h5>
                            <p>{item.description}</p>
                            <button className="btn btn-danger upcoming-card-button" disabled={!user}
                                    onClick={() => handleFinish(item.id)}>
                                Finish
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
 
export default Upcoming;