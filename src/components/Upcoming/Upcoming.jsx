import React, { useState, useContext, useEffect } from 'react';
import './Upcoming.scss';
import { firestore } from '../../firebase';
import { AuthContext } from '../../auth';
import Countdown from 'react-countdown';
import Button from '@material-ui/core/Button';
import DoneIcon from '@material-ui/icons/Done';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

const weekdays = ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"];
function formatDueDate(time) {
    if (!time) {
        return "No Due Date";
    } else if (time >= (new Date().getTime() + 86400000)) {
        const year = time.getFullYear();
        const month = time.getMonth() + 1;
        const day = time.getDate();
        return "Due " + weekdays[time.getDay()] + " " + month + "/" + day + "/" + year;
    } else {
        return (<Countdown date={time} renderer={({hours, minutes, seconds, completed}) => {
            if (completed) {
                return "Overdue!";
            } else if (hours > 0) {
                return "Due in " + hours + "hrs " + minutes + "mins";
            } else {
                return "Due in " + minutes + "mins " + seconds + "secs";
            }
        }}/>);
    }
}

function Upcoming() { 
    const [itemList, setItemList] = useState([]);
    const [pathList, setPathList] = useState([]);
    const user = useContext(AuthContext);

    const handleFinish = (itemId) => {
        if (!user) return;
        const itemsRef = firestore.collection("workmap/" + user.uid + "/items");
        return itemsRef.doc(itemId).delete()
            .then(() => {
                const deletePaths = pathList.filter((path) => path.from === itemId || path.to === itemId);
                const deletePromises = [];
                const pathsRef = firestore.collection("workmap/" + user.uid + "/paths");
                for (let i = 0; i < deletePaths.length; i++) {
                    deletePromises.push(pathsRef.doc(deletePaths[i].id).delete());
                }
                return Promise.all(deletePromises);
            });
    }

    useEffect(() => {
        if (!user) return;

        const itemsRef = firestore.collection("workmap/" + user.uid + "/items");
        const unsubItem = itemsRef.orderBy("due").onSnapshot((qSnapshot) => {
            // get the item list
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
            // style the cards for the item list
            const cardList = document.querySelectorAll(".upcoming-card");
            let complement;
            for (let i = 0; i < cardList.length; i++) {
                complement = cardList.length - i;
                cardList[i].style.top = `${5*i}px`;
                cardList[i].style.zIndex = complement;
            }
        });

        // get the path list
        const pathsRef = firestore.collection("workmap/" + user.uid + "/paths");
        const unsubPath = pathsRef.onSnapshot((qSnapshot) => {
            const pathList = [];
            qSnapshot.forEach((doc) => {
                pathList.push({
                    id: doc.id,
                    from: doc.data().from,
                    to: doc.data().to,
                });
            });
            setPathList(pathList);
        });

        return () => {
            unsubItem();
            unsubPath();
        };
    }, [user]);

    return (
        <div className="upcoming-container">
            <h4 className="upcoming-header">
                Upcoming Due Dates
                <Button variant="contained" color="primary" href="/workmap"
                        endIcon={<ArrowForwardIcon />}
                        className="upcoming-button">
                    WorkMap
                </Button>
            </h4>

            <div className="upcoming-card-list">
                {user ?
                itemList.length > 0 ? 
                itemList.map((item) => (
                    <div key={item.id} className={item.due && (item.due < (new Date().getTime() + 86400000)) ? "upcoming-card due-soon" : "upcoming-card"}>
                        <div className="upcoming-card-header">
                            <p>{item.abbrev}</p>
                            <div>{formatDueDate(item.due)}</div>
                        </div>
                        <div className="upcoming-card-body">
                            <h5>{item.name}</h5>
                            <p>{item.description}</p>
                            <Button variant="contained" color="secondary"
                                    endIcon={<DoneIcon/>}
                                    className="upcoming-card-button"
                                    onClick={() => (handleFinish(item.id))}>
                                Done
                            </Button>
                        </div>
                    </div>
                )) :
                <div className="upcoming-empty">
                    You have no upcoming due dates
                </div> :
                <div className="upcoming-empty">
                    Sign in with Google to see your upcoming due dates
                </div>}
            </div>
        </div>
    );
}
 
export default Upcoming;