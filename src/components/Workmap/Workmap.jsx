import React, { useState, useEffect, useContext } from 'react';
import './Workmap.scss';
import WorkmapItem from './WorkmapItem';
import WorkmapModal from './WorkmapModal';
import { AuthContext } from '../../auth';
import firebaseApp from '../../firebase';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { DialogContent, Modal } from '@material-ui/core';

export default function Workmap() {
    const [itemList, setItemList] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [currItem, setCurrItem] = useState(null);
    const user = useContext(AuthContext);

    // handles adding a new or editing an existing workmap item
    const saveItem = (name, abbrev, due, description) => {
        if (!user) return;
        const itemsRef = firebaseApp.firestore().collection("workmap/" + user.uid + "/items");
        // edit existing workmap item
        if (currItem)
            itemsRef.doc(currItem.id).update({
                name: name.length > 0 ? name : "Task",
                abbrev: abbrev.length > 0 ? abbrev : "TASK",
                due: due,
                description: description
            }).then(
                () => {
                    setModalOpen(false);
                }
            );
        // adds new workmap item
        else
            itemsRef.add({
                name: name.length > 0 ? name : "Task",
                abbrev: abbrev.length > 0 ? abbrev : "TASK",
                due: due,
                description: description,
                x: Math.floor(Math.random() * 1200),
                y: Math.floor(Math.random() * 300)
            }, {merge: true}).then(
                () => {
                    setModalOpen(false);
                }
            );
    };

    // handles deleting an existing workmap item
    const deleteItem = () => {
        if (!user) return;
        const itemsRef = firebaseApp.firestore().collection("workmap/" + user.uid + "/items");
        itemsRef.doc(currItem.id).delete().then(() => {
            setModalOpen(false);
        });
    };

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
                <AddCircleIcon fontSize="large" className="workmap-add-icon"
                                onClick={() => {
                                    setCurrItem(null);
                                    setModalOpen(true);
                                }}/>
            </header>

            <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
                <DialogContent>
                    <WorkmapModal closeModal={() => setModalOpen(false)} currItem={currItem}
                                saveItem={saveItem} deleteItem={deleteItem} />
                </DialogContent>
            </Modal>

            <div className="workmap-content">
                {itemList.map((item) => (
                    <WorkmapItem key={item.id} item={item} 
                                onEdit={() => {
                                    setCurrItem(item);
                                    setModalOpen(true);
                                }}/>
                ))}
            </div>
        </div>
    )
}