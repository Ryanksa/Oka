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

export default function WorkmapItem(props) {
    const [focus, setFocus] = useState(props.item.focus);

    // handles updating line position during new path selection
    const updateLine = (line, selectingPoint, event) => {
        selectingPoint.style.left = `${event.clientX - props.workmapXOffset + window.pageXOffset}px`;
        selectingPoint.style.top = `${event.clientY - props.workmapYOffset + window.pageYOffset}px`;
        line.position();
    };
    
    // handles finishing new path selection
    const exitSelecting = (line, selectableItems) => {
        document.onmousemove = null;
        document.onclick = null;
        line.remove();
        selectableItems.forEach((item) => {
            item.classList.remove('selectable');
            item.onclick = null;
        });
    }

    const enterSelecting = () => {
        const fromId = props.item.id;
        const selectingPoint = document.getElementById("selecting-endpoint"); 
        const selectableItems = document.querySelectorAll(`.workmap-item:not(#${CSS.escape(fromId)})`);
        
        // draw the selecting line
        let line = new LeaderLine(document.getElementById(fromId), selectingPoint, {
            endPlug: 'disc',
            dash: {animation: true},
            color: 'rgba(81, 129, 216, 0.5)',
            size: 7
        });

        // update selecting line when moving mouse
        document.onmousemove = (event) => {
            updateLine(line, selectingPoint, event);
        }

        // for each selectable item, setup class and onclick function to create a new path
        selectableItems.forEach((item) => {
            item.className += " selectable";
            item.onclick = (event) => {
                event.stopPropagation();
                props.newPath(fromId, item.id);
                exitSelecting(line, selectableItems);
            };
        });

        // if user clicks anywhere else on the page, also exit selecting
        // setTimeout 0 is used to prevent this onclick from firing immediately
        setTimeout(() => {
            document.onclick = () => {
                exitSelecting(line, selectableItems);
            };
        }, 0);
    };

    const { item } = props;
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
                    props.setItemFocus(item.id, !currFocus);
                }}>
                    <CenterFocusWeakIcon />
                </IconButton>
                <IconButton onClick={enterSelecting}>
                    <TrendingUpIcon />
                </IconButton>
            </CardActions>
        </Card>
    );
}
