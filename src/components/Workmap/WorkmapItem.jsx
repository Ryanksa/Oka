import React from 'react';
import './Workmap.scss';
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
    const createNewPath = (fromId) => {
        const highlightItems = document.querySelectorAll(`.workmap-item:not(#${CSS.escape(fromId)})`);
        for (let i = 0; i < highlightItems.length; i++) {
            highlightItems[i].style.border = "1.5px solid rgb(123, 104, 238)";
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
                    highlightItems[i].style.border = "none";
                }
                document.removeEventListener("click", phaseTwo);
            });
        }, 0);
    };

    const { item } = props;
    return (
        <Card id={item.id} className="workmap-item">
            <CardHeader title={item.name} 
                        subheader={item.due ? "Due " + formatDueDate(item.due) : "No Due Date"}
                        action={
                            <IconButton onClick={props.onEdit}>
                                <EditIcon />
                            </IconButton>
                        }/>
            <CardContent>
                <p>{item.description}</p>
            </CardContent>
            <CardActions>
                <IconButton>
                    <CenterFocusWeakIcon />
                </IconButton>
                <IconButton onClick={() => createNewPath(item.id)}>
                    <TrendingUpIcon />
                </IconButton>
            </CardActions>
        </Card>
    );
}
