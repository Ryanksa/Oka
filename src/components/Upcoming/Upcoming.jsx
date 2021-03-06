import React, { useEffect } from 'react';
import './Upcoming.scss';
import { deleteItem } from '../../firebase';
import { formatUpcomingDueDate } from '../../utils/date-helper';
import { useSelector } from 'react-redux';
import Button from '@material-ui/core/Button';
import DoneIcon from '@material-ui/icons/Done';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

function Upcoming() {
    const user = useSelector(state => state.user);
    const itemList = useSelector(state => state.items);

    useEffect(() => {
        // style the cards for the item list
        const cardList = document.querySelectorAll(".upcoming-card");
        let complement;
        for (let i = 0; i < cardList.length; i++) {
            complement = cardList.length - i;
            cardList[i].style.top = `${5*i}px`;
            cardList[i].style.zIndex = complement;
        }
    }, [itemList]);

    return (
        <div className="upcoming-container">
            <h4 className="upcoming-header">
                Upcoming Due Dates
                <Button variant="contained" color="primary" href="/workmap"
                        endIcon={<ArrowForwardIcon />}
                        className="upcoming-button">
                    WorkMap
                </Button>
            </h4>

            <div className="upcoming-card-list">
                {user ?
                itemList.length > 0 ? 
                itemList.map((item) => (
                    <div key={item.id} className={item.due && (item.due < (new Date().getTime() + 86400000)) ? "upcoming-card due-soon" : "upcoming-card"}>
                        <div className="upcoming-card-header">
                            <h4>{item.abbrev}</h4>
                            <div>{formatUpcomingDueDate(item.due)}</div>
                        </div>
                        <div className="upcoming-card-body">
                            <h4>{item.name}</h4>
                            <p>{item.description}</p>
                            <Button variant="contained" color="secondary"
                                    endIcon={<DoneIcon/>}
                                    className="upcoming-card-button"
                                    onClick={() => deleteItem(item.id)}>
                                Done
                            </Button>
                        </div>
                    </div>
                )) :
                <div className="upcoming-empty">
                    You have no upcoming due dates
                </div> :
                <div className="upcoming-empty">
                    Sign in with Google to see your upcoming due dates
                </div>}
            </div>
        </div>
    );
}
 
export default Upcoming;