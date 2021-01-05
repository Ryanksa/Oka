import React from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

function WorkmapModal(props) {
    const modalTitle = props.modalNew ? "Add an Item" : "Edit an Item";

    return(
        <div>
            <div className="modal-header">
                <h5 className="modal-title" id="newItemTitle">{modalTitle}</h5>
            </div>

            <div className="modal-body">
                <form>
                    <label htmlFor="item-name">Name</label>
                    <input id="item-name" type="text" defaultValue={props.itemName}
                            className="form-control item-form"
                            onChange={event => props.setItemName(event.target.value)}/>

                    <label htmlFor="item-abbrev">Abbreviation</label>
                    <input id="item-abbrev" type="text" maxLength="10"
                            className="form-control item-form" defaultValue={props.itemAbbrev}
                            onChange={event => props.setItemAbbrev(event.target.value)}/>

                    <label htmlFor="item-due">Due Date </label>
                    <DatePicker id="item-due" 
                                className="form-control item-form"
                                selected={props.itemDue}
                                onChange={date => props.setItemDue(date)}
                                showTimeSelect
                                dateFormat="MMM dd, h:mm aa"/>
                    <br/>

                    <label htmlFor="item-description">Description</label>
                    <textarea id="item-description" type="text" rows="10"
                                className="form-control item-form" defaultValue={props.itemDesc}
                                onChange={event => props.setItemDesc(event.target.value)}/>

                </form>
            </div>

            <div className="modal-footer">
                {!props.modalNew && 
                <button type="button" className="btn btn-danger" onClick={props.onDelete}>
                    Delete
                </button>}
                <button type="button" className="btn btn-secondary"
                        onClick={() => props.setModalOpen(false)}>
                    Close
                </button>
                <button type="button" className="btn btn-primary" onClick={props.onSave}>
                    {props.modalNew ? "Add item" : "Save changes"}
                </button>
            </div>
        </div>
    );
}

export default WorkmapModal;