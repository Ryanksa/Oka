import React, { useState, useContext } from 'react';
import '../styles/Components.css';
import WorkmapBoard from './workmapComponents/WorkmapBoard';
import plus from '../img/plus.png';
import ReactModal from 'react-modal';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
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
        const itemsRef = firebaseApp.firestore().collection("workmap/" + user.uid + "/items");
        itemsRef.doc(itemId).delete().then(() => {
            setModalOpen(false);
        });
    }

    const modalTitle = modalNew ? "Add an Item" : "Edit an Item";
    return (
        <div className="workmap-container">
            <h2 className="workmap-header">
                WorkMap
                <img className="workmap-header-icon" src={plus} 
                    onClick={handlePlus}/>
            </h2>
            <WorkmapBoard onEdit={handleEdit}/>

            <ReactModal isOpen={modalOpen}>
                <div className="modal-header">
                    <h5 className="modal-title" id="newItemTitle">{modalTitle}</h5>
                </div>
                <div className="modal-body">
                    <form>
                        <label htmlFor="item-name">Name</label>
                        <input id="item-name" type="text" defaultValue={itemName}
                                className="form-control item-form"
                                onChange={event => setItemName(event.target.value)}/>

                        <label htmlFor="item-abbrev">Abbreviation</label>
                        <input id="item-abbrev" type="text" maxLength="10"
                                className="form-control item-form" defaultValue={itemAbbrev}
                                onChange={event => setItemAbbrev(event.target.value)}/>

                        <label htmlFor="item-due">Due Date </label>
                        <DatePicker id="item-due" 
                                    className="form-control item-form"
                                    selected={itemDue}
                                    onChange={date => setItemDue(date)}
                                    showTimeSelect
                                    dateFormat="MMM dd, h:mm aa"/>
                        <br/>

                        <label htmlFor="item-description">Description</label>
                        <textarea id="item-description" type="text" rows="10"
                                    className="form-control item-form" defaultValue={itemDesc}
                                    onChange={event => setItemDesc(event.target.value)}/>

                    </form>
                </div>
                <div className="modal-footer">
                    {!modalNew && 
                    <button type="button" className="btn btn-danger" onClick={handleDelete}>
                        Delete
                    </button>}
                    <button type="button" className="btn btn-secondary"
                            onClick={() => setModalOpen(false)}>
                        Close
                    </button>
                    <button type="button" className="btn btn-primary" onClick={handleSave}>
                        Save changes
                    </button>
                </div>
            </ReactModal>
        </div>
    );
}
 
export default Workmap;