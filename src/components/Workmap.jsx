import React, { useState, useContext } from 'react';
import '../styles/Components.css';
import WorkmapBoard from './workmapComponents/WorkmapBoard';
import WorkmapModal from './workmapComponents/WorkmapModal';
import plus from '../img/plus.png';
import ReactModal from 'react-modal';
import firebaseApp from '../firebase';
import { AuthContext } from './Auth';

function Workmap() {
    const [modalOpen, setModalOpen] = useState(false);
    const [itemId, setItemId] = useState(null);
    const [itemName, setItemName] = useState("");
    const [itemAbbrev, setItemAbbrev] = useState("");
    const [itemDesc, setItemDesc] = useState("");
    const [itemDue, setItemDue] = useState(null);
    const [modalNew, setModalNew] = useState(true);
    const user = useContext(AuthContext);

    const handlePlus = () => {
        setModalOpen(true);
        setItemId(null);
        setItemName("");
        setItemAbbrev("");
        setItemDesc("");
        setItemDue(null);
        setModalNew(true);
    }

    const handleEdit = (item) => {
        setModalOpen(true);
        setItemId(item.id);
        setItemName(item.name);
        setItemAbbrev(item.abbrev);
        setItemDesc(item.description);
        setItemDue(item.due);
        setModalNew(false);
    }

    const handleSave = () => {
        if (user) {
            const itemsRef = firebaseApp.firestore().collection("workmap/" + user.uid + "/items");
            if (modalNew) {
                itemsRef.add({
                    name: itemName,
                    abbrev: itemAbbrev,
                    due: itemDue,
                    description: itemDesc,
                    x: Math.floor(Math.random() * 1155),
                    y: Math.floor(Math.random() * 386)
                }, {merge: true}).then(
                    () => {
                        setModalOpen(false);
                    }
                );
            } else {
                itemsRef.doc(itemId).update({
                    name: itemName,
                    abbrev: itemAbbrev,
                    due: itemDue,
                    description: itemDesc
                }).then(
                    () => {
                        setModalOpen(false);
                    }
                );
            }
        }
    }

    const handleDelete = () => {
        if (user) {
            const itemsRef = firebaseApp.firestore().collection("workmap/" + user.uid + "/items");
            itemsRef.doc(itemId).delete().then(() => {
                setModalOpen(false);
            });
        }
    }

    return (
        <div className="workmap-container">
            <h2 className="workmap-header">
                WorkMap
                <img className="workmap-header-icon" src={plus} alt=""
                     onClick={handlePlus}/>
            </h2>
            <WorkmapBoard onEdit={handleEdit}/>

            <ReactModal isOpen={modalOpen}>
                <WorkmapModal modalOpen={modalOpen} setModalOpen={setModalOpen}
                            itemName={itemName} setItemName={setItemName}
                            itemAbbrev={itemAbbrev} setItemAbbrev={setItemAbbrev}
                            itemDesc={itemDesc} setItemDesc={setItemDesc}
                            itemDue={itemDue} setItemDue={setItemDue} modalNew={modalNew}
                            onSave={handleSave} onDelete={handleDelete} user={user}/>
            </ReactModal>
        </div>
    );
}
 
export default Workmap;