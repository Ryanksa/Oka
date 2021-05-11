import React, { useState, useEffect } from 'react';
import './Workmap.scss';
import WorkmapItem from './WorkmapItem';
import WorkmapModal from './WorkmapModal';
import WorkmapPath from './WorkmapPath';
import PlainDraggable from 'plain-draggable/plain-draggable.min';
import { useSelector } from 'react-redux';
import { addItem, updateItem } from '../../firebase';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { DialogContent, Modal } from '@material-ui/core';
import workmapExample from '../../assets/workmap-example.gif';

// 23px offset from .workmap-container left padding (16px) + .workmap-content left border (7px)
const workmapXOffset = 23;
// 185px offset from .topbar-container (90px) + .workmap-header (88px) + .workmap-content top border (7px)
const workmapYOffset = 185;

export default function Workmap() {
    // modal states for adding/editing items
    const [modalOpen, setModalOpen] = useState(false);
    const [currItem, setCurrItem] = useState(null);

    const user = useSelector(state => state.user);
    const itemList = useSelector(state => state.items);
    const pathList = useSelector(state => state.paths);

    const saveItem = (name, abbrev, due, description) => {
        if (!user) return;
        if (currItem)
            return updateItem(currItem.id, {name, abbrev, due, description});
        else
            return addItem(name, abbrev, due, description);            
    };

    // make workmap items draggable
    useEffect(() => {
        if (!user) return;
        itemList.forEach((item) => {
            const domItem = document.getElementById(item.id);
            new PlainDraggable(domItem, {
                autoScroll: true,
                leftTop: true,
                left: item.x + workmapXOffset,
                top: item.y + workmapYOffset,
                onDragEnd: () => updateItem(item.id, {
                    x: Math.round(domItem.style.left.slice(0, -2)), // -2 to get rid of 'px'
                    y: Math.round(domItem.style.top.slice(0, -2)) // -2 to get rid of 'px'
                })
            });
        });
    }, [itemList, user]);

    return (
        <div className="workmap-container">
            <header className="workmap-header">
                <h2>Workmap</h2>
                {user &&
                <AddCircleIcon fontSize="large" className="workmap-add-icon"
                                onClick={() => {
                                    setCurrItem(null);
                                    setModalOpen(true);
                                }}/>}
            </header>

            <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
                <DialogContent>
                    <WorkmapModal closeModal={() => setModalOpen(false)} currItem={currItem}
                                saveItem={saveItem} />
                </DialogContent>
            </Modal>

            <div className="workmap-content">
                {user ?
                <>
                    {itemList.map((item) => (
                        <WorkmapItem key={item.id} item={item}
                                    workmapXOffset={workmapXOffset} 
                                    workmapYOffset={workmapYOffset}
                                    onEdit={() => {
                                        setCurrItem(item);
                                        setModalOpen(true);
                                    }}/>
                    ))}
                    {pathList.map((path) => (
                        <WorkmapPath key={path.id} path={path} />
                    ))}
                    <div id="selecting-endpoint"></div>
                </> : 
                <>
                    <img className="not-signed-in-gif" src={workmapExample} alt="" />
                    <div className="not-signed-in-overlay">
                        <p>Sign in with Google to use Workmap</p>
                    </div>
                </>}
            </div>
        </div>
    )
}