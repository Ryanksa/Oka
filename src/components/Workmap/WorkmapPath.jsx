import React, { useState } from 'react';
import './Workmap.scss';
import DateIcon from '../DateIcon/DateIcon';
import { updatePath, deletePath } from '../../firebase';
import { numDaysBetween, forEachDayBetween } from '../../utils/date-helper';

import Xarrow from 'react-xarrows';
import SaveIcon from '@material-ui/icons/Save';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker
} from '@material-ui/pickers';

export default function WorkmapPath(props) {
    const { path } = props;

    const [editing, setEditing] = useState(false);
    const [startDate, setStartDate] = useState(path.startDate ? new Date(path.startDate.seconds * 1000) : null);
    const [endDate, setEndDate] = useState(path.endDate ? new Date(path.endDate.seconds * 1000) : null);
    const [hoverDays, setHoverDays] = useState([]);

    const handleSave = () => {
        updatePath(path.id, { startDate, endDate })
            .then(() => {
                setEditing(false);
            });
    };

    const editingButtons = (
        <div>
            <IconButton onClick={handleSave}>
                <SaveIcon fontSize="large" />
            </IconButton>
            <IconButton onClick={() => deletePath(path.id)}>
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

    const middleLabel = () => {
        if (!startDate || !endDate) return <></>;
        
        const today = new Date();
        if (hoverDays.length > 0) {
            return(
                <div className="middle-label-container" onMouseLeave={() => {
                    setHoverDays([]);
                }}>
                    {hoverDays.map((date, idx) => {
                        const todayToDate = numDaysBetween(today, date);
                        return <DateIcon key={idx} date={date} 
                                        cross={todayToDate < 0}
                                        circle={todayToDate === 0} />
                    })}
                </div>
            );
        }

        const todayToStart = numDaysBetween(today, startDate);
        const todayToEnd = numDaysBetween(today, endDate);
        return (
            <div className="middle-label-container" onMouseEnter={() => {
                const displayDays = forEachDayBetween(startDate, endDate, (date) => date);
                setHoverDays(displayDays);
            }}>
                <DateIcon date={todayToStart > 0 ? startDate : (todayToEnd < 0 ? endDate : today)} 
                        circle={todayToStart <= 0 && todayToEnd >= 0}
                        cross={todayToEnd < 0} />
            </div>
        );
    };

    if (editing) {
        return (
            <Xarrow start={path.from} end={path.to} 
                    strokeWidth={5.5} color="rgb(81, 129, 216)"
                    label={{start: editingStartInput, middle: editingButtons, end: editingEndInput}} />
        );
    }
    return(
        <Xarrow start={path.from} end={path.to} 
                strokeWidth={5.5} color="rgb(81, 129, 216)"
                label={{middle: middleLabel()}}
                onClick={() => {
                    setHoverDays([]);
                    setEditing(true);
                }}/>
    );
}