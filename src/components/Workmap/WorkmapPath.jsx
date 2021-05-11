import React, { useState } from 'react';
import './Workmap.scss';
import { updatePath, deletePath } from '../../firebase';
import Xarrow from 'react-xarrows';
import SaveIcon from '@material-ui/icons/Save';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker
} from '@material-ui/pickers';

const weekdays = ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"];
const formatStartToEnd = (start, end) => {
    if (!start && !end) return "";

    const startDate = new Date(start);
    const endDate = new Date(end);
    const startDateStr = weekdays[startDate.getDay()] + " " + (startDate.getMonth()+1) + "/" + startDate.getDate();
    const endDateStr = weekdays[endDate.getDay()] + " " + (endDate.getMonth()+1) + "/" + endDate.getDate();
    
    if (!start) return `Finish on ${endDateStr}`;
    else if (!end) return `Start on ${startDateStr}`;
    else return startDateStr + " --> " + endDateStr;
};

export default function WorkmapPath(props) {
    const [editing, setEditing] = useState(false);
    const [startDate, setStartDate] = useState(props.path.startDate ? Date(props.path.startDate) : null);
    const [endDate, setEndDate] = useState(props.path.endDate ? Date(props.path.endDate) : null);

    const handleSave = () => {
        updatePath(props.path.id, { startDate, endDate })
            .then(() => {
                setEditing(false);
            });
    };

    const editingButtons = (
        <div>
            <IconButton onClick={handleSave}>
                <SaveIcon fontSize="large" />
            </IconButton>
            <IconButton onClick={() => deletePath(props.path.id)}>
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
    const middleLabel = (
        <div className="path-label">
            {formatStartToEnd(startDate, endDate)}
        </div>
    );

    if (editing) {
        return (
            <Xarrow start={props.path.from} end={props.path.to} 
                    strokeWidth={5.5} color="rgb(81, 129, 216)"
                    label={{start: editingStartInput, middle: editingButtons, end: editingEndInput}} />
        );
    }
    return(
        <Xarrow start={props.path.from} end={props.path.to} 
                strokeWidth={5.5} color="rgb(81, 129, 216)"
                label={{middle: middleLabel}}
                onClick={() => setEditing(true)}/>
    );
}