import React, { useState } from 'react';
import './Workmap.scss';
import LeaderLine from 'leader-line';
import EditIcon from '@material-ui/icons/Edit';
import CenterFocusWeakIcon from '@material-ui/icons/CenterFocusWeak';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';

const formatDueDate = (due) => {
    return (due.getMonth()+1) + "/" + due.getDate() + "/" + due.getFullYear();
};

const isWorkmapItem = (elem) => {
    if (elem.className && elem.className.split(' ').indexOf('workmap-item') >= 0)
        return elem;
    else if (!elem.parentNode)
        return null;
    else
        return isWorkmapItem(elem.parentNode);
}

export default function WorkmapItem(props) {
    const [focus, setFocus] = useState(props.item.focus);

    const createNewPath = (fromId) => {
        // get all workmap items excluding itself
        const highlightItems = document.querySelectorAll(`.workmap-item:not(#${CSS.escape(fromId)})`);
        // highlight them and draw arrow when mouse over
        for (let i = 0; i < highlightItems.length; i++) {
            highlightItems[i].className += " selecting";
            highlightItems[i].onmouseover = () => {
                const line = new LeaderLine(document.getElementById(fromId), highlightItems[i]);
                highlightItems[i].onmouseout = () => {
                    line.remove();
                    highlightItems[i].onmouseout = null;
                };
            }
        }
        // wrapped addEventListener in setTimeout to avoid this click from triggering it
        setTimeout(() => {
            document.addEventListener("click", function phaseTwo(event) {
                // check and get the workmap-item that was clicked
                const clickedItem = isWorkmapItem(event.target);
                if (clickedItem && clickedItem.id !== fromId) {
                    // create new path
                    props.newPath(fromId, clickedItem.id)
                }
                // undo highlighting and remove onclick listener
                for (let i = 0; i < highlightItems.length; i++) {
                    highlightItems[i].className = highlightItems[i].className.slice(0, -10);
                    highlightItems[i].onmouseover = null;
                }
                document.removeEventListener("click", phaseTwo);
            });
        }, 0);
    };

    const { item, setItemFocus } = props;
    return (
        <Card id={item.id} className={"workmap-item" + (focus ? " focus" : "")}>
            <CardHeader title={item.name} className="item-header"
                        subheader={item.due ? "Due " + formatDueDate(item.due) : "No Due Date"}
                        action={
                            <IconButton onClick={props.onEdit}>
                                <EditIcon />
                            </IconButton>
                        }/>
            <CardContent className="item-content">
                <p>{item.description}</p>
            </CardContent>
            <CardActions>
                <IconButton onClick={() => {
                    const currFocus = focus;
                    setFocus(!currFocus);
                    setItemFocus(item.id, !currFocus);
                }}>
                    <CenterFocusWeakIcon />
                </IconButton>
                <IconButton onClick={() => createNewPath(item.id)}>
                    <TrendingUpIcon />
                </IconButton>
            </CardActions>
        </Card>
    );
}
