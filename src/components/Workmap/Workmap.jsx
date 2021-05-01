import React, { useState, useEffect, useContext } from 'react';
import './Workmap.scss';
import WorkmapItem from './WorkmapItem';
import WorkmapModal from './WorkmapModal';
import WorkmapPath from './WorkmapPath';
import PlainDraggable from 'plain-draggable/plain-draggable.min';
import { AuthContext } from '../../auth';
import firebaseApp from '../../firebase';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { DialogContent, Modal } from '@material-ui/core';

export default function Workmap() {
    // list of items and paths
    const [itemList, setItemList] = useState([]);
    const [pathList, setPathList] = useState([]);
    // modal states for adding/editing items
    const [modalOpen, setModalOpen] = useState(false);
    const [currItem, setCurrItem] = useState(null);

    const user = useContext(AuthContext);

    // handles adding a new or editing an existing workmap item
    const saveItem = (name, abbrev, due, description) => {
        if (!user) return;
        // edit existing workmap item
        const itemsRef = firebaseApp.firestore().collection("workmap/" + user.uid + "/items");
        if (currItem)
            return itemsRef.doc(currItem.id).update({
                name: name.length > 0 ? name : "Task",
                abbrev: abbrev.length > 0 ? abbrev : "TASK",
                due: due,
                description: description
            });
        // adds new workmap item
        else
            return itemsRef.add({
                name: name.length > 0 ? name : "Task",
                abbrev: abbrev.length > 0 ? abbrev : "TASK",
                due: due,
                description: description,
                x: Math.floor(Math.random() * 1600),
                y: Math.floor(Math.random() * 900),
                focus: false
            }, {merge: true});
    };

    // handles setting focus on existing workmap items
    const setItemFocus = (itemId, focus) => {
        const itemsRef = firebaseApp.firestore().collection("workmap/" + user.uid + "/items");
        itemsRef.doc(itemId).update({
            focus: focus
        });
    };

    // handles deleting an existing workmap item
    const deleteItem = () => {
        if (!user) return;

        const itemsRef = firebaseApp.firestore().collection("workmap/" + user.uid + "/items");
        return itemsRef.doc(currItem.id).delete()
            .then(() => {
                const deletePaths = pathList.filter((path) => path.from === currItem.id || path.to === currItem.id);

                const deletePromises = [];
                const pathsRef = firebaseApp.firestore().collection("workmap/" + user.uid + "/paths");
                for (let i = 0; i < deletePaths.length; i++) {
                    deletePromises.push(pathsRef.doc(deletePaths[i].id).delete());
                }
                return Promise.all(deletePromises);
            });
    };

    // handles creating a new workmap path
    const newPath = (fromId, toId) => {
        // path already exists, return
        if (pathList.filter((path) => path.from === fromId && path.to === toId).length > 0) return;
        
        const pathsRef = firebaseApp.firestore().collection("workmap/" + user.uid + "/paths")
        pathsRef.add({
            from: fromId,
            to: toId,
            startDate: null,
            endDate: null
        }, {merge: true});
    }

    // handles updating the start and end date of an existing workmap path
    const updatePath = (pathId, startDate, endDate) => {
        const pathsRef = firebaseApp.firestore().collection("workmap/" + user.uid + "/paths");
        return pathsRef.doc(pathId).update({
            startDate: startDate,
            endDate: endDate
        });
    };

    // handles deleting an existing workmap path
    const deletePath = (pathId) => {
        const pathsRef = firebaseApp.firestore().collection("workmap/" + user.uid + "/paths");
        return pathsRef.doc(pathId).delete();
    };

    // setup listener for the current user's workmap items and paths
    useEffect(() => {
        if (!user) return;
        const itemsRef = firebaseApp.firestore().collection("workmap/" + user.uid + "/items");
        const unsubItem = itemsRef.onSnapshot((qSnapshot) => {
            const itemList = [];
            qSnapshot.forEach((doc) => {
                itemList.push({
                    id: doc.id,
                    name: doc.data().name,
                    abbrev: doc.data().abbrev,
                    due: doc.data().due ? doc.data().due.toDate() : null,
                    description: doc.data().description,
                    x: doc.data().x,
                    y: doc.data().y,
                    focus: doc.data().focus
                });
            });
            setItemList(itemList);
        });
        
        const pathsRef = firebaseApp.firestore().collection("workmap/" + user.uid + "/paths");
        const unsubPath = pathsRef.onSnapshot((qSnapshot) => {
            const pathList = [];
            qSnapshot.forEach((doc) => {
                pathList.push({
                    id: doc.id,
                    from: doc.data().from,
                    to: doc.data().to,
                    startDate: doc.data().startDate,
                    endDate: doc.data().endDate
                });
            });
            setPathList(pathList);
        });

        return () => {
            unsubItem();
            unsubPath();
        };
    }, [user]);

    // make workmap items draggable
    useEffect(() => {
        if (!user) return;
        const itemsRef = firebaseApp.firestore().collection("workmap/" + user.uid + "/items");
        itemList.forEach((item) => {
            const domItem = document.getElementById(item.id);
            new PlainDraggable(domItem, {
                autoScroll: true,
                leftTop: true,
                left: item.x + 23, // 23px offset from .workmap-container left padding (16px) + .workmap-content left border (7px)
                top: item.y + 185, // 185px offset from .topbar-container (90px) + .workmap-header (88px) + .workmap-content top border (7px)
                onDragEnd: () => {
                    itemsRef.doc(item.id).update({
                        x: Math.round(domItem.style.left.slice(0, -2)),
                        y: Math.round(domItem.style.top.slice(0, -2))
                    });
                }
            });
        });
    }, [itemList, pathList, user]);

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
                                newPath={newPath} 
                                setItemFocus={setItemFocus}
                                onEdit={() => {
                                    setCurrItem(item);
                                    setModalOpen(true);
                                }}/>
                ))}
                {pathList.map((path) => (
                    <WorkmapPath key={path.id} path={path} 
                                updatePath={updatePath} deletePath={deletePath}/>
                ))}
            </div>
        </div>
    )
}