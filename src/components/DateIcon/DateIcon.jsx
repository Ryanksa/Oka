import React from 'react';
import './DateIcon.scss';

const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUNE", "JULY", "AUG", "SEPT", "OCT", "NOV", "DEC"];
const weekdays = ["SUN", "MON", "TUES", "WED", "THUR", "FRI", "SAT"];

export default function DateIcon(props) {
    const { date } = props;
    
    if (!date.getMonth) return <></>;
    return(
        <div className="date-icon-wrapper">
            {props.cross && <div className="overlay cross"></div>}
            {props.circle && <div className="overlay circle"></div>}
            <div className="date-icon">
                <div className="icon-header">
                    {months[date.getMonth()]}
                </div>
                <div className="icon-body">
                    {date.getDate()}
                </div>
                <div className="icon-body-bg">
                    {weekdays[date.getDay()]}
                </div>
            </div>
        </div>
    );
};