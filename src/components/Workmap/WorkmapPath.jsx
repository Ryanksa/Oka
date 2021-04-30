import React, { useState } from 'react';
import './Workmap.scss';
import Xarrow from 'react-xarrows';
import SaveIcon from '@material-ui/icons/Save';
import DeleteIcon from '@material-ui/icons/Delete';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker
} from '@material-ui/pickers';

const weekdays = ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"];
const formatDate = (date) => {
    if (!date) return null;
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return weekdays[date.getDay()] + " " + month + "/" + day;
};

export default function WorkmapPath(props) {
    const [editing, setEditing] = useState(false);
    const [startDate, setStartDate] = useState(props.path.startDate);
    const [endDate, setEndDate] = useState(props.path.endDate);

    const handleSave = () => {
        props.updatePath(props.path.id, startDate, endDate)
            .then(() => {
                setEditing(false);
            });
    };

    const editingButtons = (
        <div>
            <SaveIcon fontSize="large" onClick={handleSave}/>
            <DeleteIcon fontSize="large" onClick={() => props.deletePath(props.path.id)} />
        </div>
    );
    const editingStartInput = (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <div className="path-datepicker-container">
                <KeyboardDatePicker inputVariant="filled" format="MM/dd" label="Start Date" 
                                    value={startDate} onChange={setStartDate} />
            </div>
        </MuiPickersUtilsProvider>
    );
    const editingEndInput = (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <div className="path-datepicker-container">
                <KeyboardDatePicker inputVariant="filled" format="MM/dd" label="End Date" 
                                    value={endDate} onChange={setEndDate} />
            </div>
        </MuiPickersUtilsProvider>
    );

    if (editing) {
        return (
            <Xarrow start={props.path.from} end={props.path.to}
                    label={{start: editingStartInput, middle: editingButtons, end: editingEndInput}} />
        );
    }
    return(
        <Xarrow start={props.path.from} end={props.path.to}
                label={{start: formatDate(startDate), end: formatDate(endDate)}} 
                onClick={() => setEditing(true)}/>
    );
}