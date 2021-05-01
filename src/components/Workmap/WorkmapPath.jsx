import React, { useState } from 'react';
import './Workmap.scss';
import Xarrow from 'react-xarrows';
import SaveIcon from '@material-ui/icons/Save';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker
} from '@material-ui/pickers';

const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const formatDate = (date) => {
    if (!date) return null;
    const d = new Date(date);
    const month = d.getMonth() + 1;
    const day = d.getDate();
    return weekdays[d.getDay()] + " " + month + "/" + day;
};

export default function WorkmapPath(props) {
    const [editing, setEditing] = useState(false);
    const [startDate, setStartDate] = useState(props.path.startDate ? Date(props.path.startDate) : null);
    const [endDate, setEndDate] = useState(props.path.endDate ? Date(props.path.endDate) : null);

    const handleSave = () => {
        props.updatePath(props.path.id, startDate, endDate)
            .then(() => {
                setEditing(false);
            });
    };

    const editingButtons = (
        <div>
            <IconButton onClick={handleSave}>
                <SaveIcon fontSize="large" />
            </IconButton>
            <IconButton onClick={() => props.deletePath(props.path.id)}>
                <DeleteIcon fontSize="large" />
            </IconButton>
        </div>
    );
    const editingStartInput = (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <div className="path-datepicker-container">
                <KeyboardDatePicker inputVariant="outlined" format="MM/dd" className="path-datepicker" 
                                    label="Start Date" value={startDate} onChange={setStartDate} />
            </div>
        </MuiPickersUtilsProvider>
    );
    const editingEndInput = (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <div className="path-datepicker-container">
                <KeyboardDatePicker inputVariant="outlined" format="MM/dd" className="path-datepicker"
                                    label="End Date" value={endDate} onChange={setEndDate} />
            </div>
        </MuiPickersUtilsProvider>
    );
    const startLabel = (
        <div className="path-label">
            {formatDate(startDate)}
        </div>
    );
    const endLabel = (
        <div className="path-label">
            {formatDate(endDate)}
        </div>
    );

    if (editing) {
        return (
            <Xarrow start={props.path.from} end={props.path.to}
                    label={{start: editingStartInput, middle: editingButtons, end: editingEndInput}} />
        );
    }
    return(
        <Xarrow start={props.path.from} end={props.path.to}
                label={{start: startLabel, end: endLabel}} 
                onClick={() => setEditing(true)}/>
    );
}