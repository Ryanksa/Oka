import React, { useState, useContext, useEffect } from 'react';
import '../../styles/HomeComponents.css';
import firebaseApp from '../../firebase';
import { AuthContext } from '../Auth';
import { Link } from "react-router-dom";

function formatDueDate(time) {
    const year = time.getFullYear();
    const month = time.getMonth() + 1;
    const day = time.getDate();

    const hour = time.getHours();
    const ampm = hour >= 12 ? "PM" : "AM";
    const hr = (hour % 12) > 0 ? (hour % 12) : 12;
    
    const minute = time.getMinutes();
    const min = minute >= 10 ? minute : "0" + minute;
    
    return(hr + ":" + min + ampm + " " + month + "/" + day + "/" + year);
}

function Upcoming() { 
    const [itemList, setItemList] = useState([]);
    const user = useContext(AuthContext);

    const handleFinish = (itemId) => {
        const itemsRef = firebaseApp.firestore().collection("workmap/" + user.uid + "/items");
        itemsRef.doc(itemId).delete();
    }

    useEffect(() => {
        if (user) {
            const itemsRef = firebaseApp.firestore().collection("workmap/" + user.uid + "/items");
            const unsub = itemsRef.orderBy("due").onSnapshot((qSnapshot) => {
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
        <div className="upcoming-container">
            <h4 className="upcoming-header">
                Upcoming Due Dates
                <Link to="/workmap" className="btn btn-primary upcoming-button">WorkMap →</Link>
            </h4>

            <div className="upcoming-card-list">
                {itemList.map((item) => (
                    <div key={item.id} className="upcoming-card">
                        <div className="upcoming-card-header">
                            <p>{item.abbrev}</p>
                            <p>Due {formatDueDate(item.due)}</p>
                        </div>
                        <div>
                            <h5 className="upcoming-card-name">{item.name}</h5>
                            <p className="upcoming-card-description">{item.description}</p>
                            <button className="btn btn-danger" 
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