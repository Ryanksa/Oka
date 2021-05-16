import Countdown from 'react-countdown';

const MILLISECSPERDAY = 86400000;

export const formatHour = (hour) => {
    if (hour === 0) return "12:00 AM ";
    else if (hour === 12) return "12:00 PM ";
    else if (hour < 12) return `${hour}:00 AM `;
    else return `${hour-12}:00 PM `; 
};

export const formatDueDate = (due) => {
    return (due.getMonth()+1) + "/" + due.getDate() + "/" + due.getFullYear();
};

export const formatUpcomingDueDate = (time) => {
    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    if (!time) {
        return "No Due Date";
    } else if (time >= (new Date().getTime() + 86400000)) {
        const year = time.getFullYear();
        const month = time.getMonth() + 1;
        const day = time.getDate();
        return "Due " + weekdays[time.getDay()] + " " + month + "/" + day + "/" + year;
    } else {
        return (<Countdown date={time} renderer={({hours, minutes, seconds, completed}) => {
            if (completed) {
                return "Overdue!";
            } else if (hours > 0) {
                return "Due in " + hours + "hr " + minutes + "min";
            } else {
                return "Due in " + minutes + "min " + seconds + "sec";
            }
        }}/>);
    }
}

// returns 0 if d1 and d2 are on the same day
// else returns number of days from d1 to d2 (negative if d1 is passed d2)
export const numDaysBetween = (d1, d2) => {
    return Math.floor(d2.getTime()/MILLISECSPERDAY) - Math.floor(d1.getTime()/MILLISECSPERDAY);
};

// start and end inclusive
// apply is a function that should take a date object as its only parameter
export const forEachDayBetween = (startDate, endDate, apply) => {
    const result = [];
    let idx = 0;
    for (let i = startDate.getTime(); i <= endDate.getTime(); i += MILLISECSPERDAY) {
        if (idx > 1000) break; // stop after 1000 results
        result.push(apply(new Date(i)));
        idx++;
    }
    return result;
};