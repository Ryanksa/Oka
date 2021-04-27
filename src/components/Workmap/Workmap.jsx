import React, { useState, useEffect, useContext } from 'react';
import './Workmap.scss';
import WorkmapItem from './WorkmapItem';
import { AuthContext } from '../../auth';
import firebaseApp from '../../firebase';
import AddCircleIcon from '@material-ui/icons/AddCircle';

export default function Workmap() {
    const [itemList, setItemList] = useState([]);
    const user = useContext(AuthContext);

    useEffect(() => {
        if (user) {
            const itemsRef = firebaseApp.firestore().collection("workmap/" + user.uid + "/items");
            const unsub = itemsRef.onSnapshot((qSnapshot) => {
                const itemList = [];
                qSnapshot.forEach((doc) => {
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
            return unsub;
        }
    }, [user]);

    return (
        <div className="workmap-container">
            <header className="workmap-header">
                <h2>Workmap</h2>
                <AddCircleIcon fontSize="large" className="workmap-add-icon"/>
            </header>

            <div className="workmap-content">
                {itemList.map((item) => (
                    <WorkmapItem item={item} />
                ))}
                <div className="others-container"></div>
                <div className="focus-container"></div>
            </div>
        </div>
    )
}