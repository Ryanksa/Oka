import React, { Component } from 'react';
import './Workmap.scss';
import { deleteItem } from '../../firebase';
import { Button, TextField } from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
} from '@material-ui/pickers';

class WorkmapModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: props.currItem ? props.currItem.name : "",
            abbrev: props.currItem ? props.currItem.abbrev : "",
            due: props.currItem ? props.currItem.due : null,
            description: props.currItem ? props.currItem.description: ""
        };
    }

    render() {
        const { name, abbrev, due, description } = this.state;
        const { closeModal, currItem, saveItem  } = this.props;

        return (
            <div className="workmap-modal">
                <header>
                    <h4 className="modal-title">{currItem ? "Edit an Item" : "Add an Item"}</h4>
                </header>
    
                <form className="modal-form">
                    <div className="modal-form-row">
                        <TextField label="Name" value={name} fullWidth 
                                onChange={(e) => this.setState({ name: e.target.value })}/>
                        <TextField label="Abbreviation" value={abbrev} fullWidth 
                                onChange={(e) => this.setState({ abbrev: e.target.value })}/>
                    </div>
                    <div className="modal-form-row">
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardDatePicker
                                disableToolbar
                                variant="inline"
                                format="MM/dd/yyyy"
                                margin="normal"
                                label="Due Date"
                                fullWidth
                                value={due}
                                onChange={(date) => this.setState({ due: date })}
                            />
                            <KeyboardTimePicker
                                margin="normal"
                                label="Due Time"
                                fullWidth
                                value={due}
                                onChange={(date) => this.setState({ due: date })}
                            />
                        </MuiPickersUtilsProvider>
                    </div>
                    <div className="modal-form-row description">
                        <TextField
                            label="Description"
                            multiline
                            fullWidth
                            rows={4}
                            variant="filled"
                            value={description}
                            onChange={(e) => this.setState({ description: e.target.value })}
                        />
                    </div>
    
                    <div className="modal-form-row buttons">
                        <Button variant="contained" color="primary" 
                                onClick={() => {
                                    saveItem(name, abbrev, due, description);
                                    closeModal();
                                }}>
                            Save
                        </Button>
                        <Button variant="contained" onClick={closeModal}>
                            Cancel
                        </Button>
                        {currItem && 
                        <Button variant="contained" color="secondary" 
                                onClick={() => {
                                    deleteItem(currItem.id);
                                    closeModal();
                                }}>
                            Delete
                        </Button>}
                    </div>
                </form>
                    
            </div>
        )
    }
}

export default WorkmapModal;