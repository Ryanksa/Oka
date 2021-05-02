import React, { useState } from 'react';
import './Workmap.scss';
import LeaderLine from 'leader-line';
import EditIcon from '@material-ui/icons/Edit';
import CenterFocusWeakIcon from '@material-ui/icons/CenterFocusWeak';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import BlockIcon from '@material-ui/icons/Block';
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
    const [selecting, setSelecting] = useState(false);

    const handleNewPath = () => {
        setSelecting(true);
        const fromId = props.item.id;
        let line = null;

        const selectableItems = document.querySelectorAll(`.workmap-item:not(#${CSS.escape(fromId)})`);
        const exitSelecting = () => {
            selectableItems.forEach((item) => {
                item.onclick = null;
                item.onmouseover = null;
                item.className = item.className.slice(0, -11); // ' selectable' is 11 chars long
            });
            setSelecting(false);
        };
        // highlight each selectable item and draw arrows over the path when pointing at them
        selectableItems.forEach((item) => {
            item.className += " selectable";
            item.onclick = (event) => {
                event.stopPropagation();
                props.newPath(fromId, item.id);
                if (line) { // this if block makes line removal atmoic
                    line.remove();
                    line = null;
                }
                exitSelecting();
            };
            item.onmouseover = () => {
                line = new LeaderLine(document.getElementById(fromId), item);
                item.onmouseout = () => {
                    if (line) { // this if block makes line removal atmoic
                        line.remove();
                        line = null;
                    }
                    item.onmouseout = null;
                };
            };
        });
    };

    const handleCancelPath = () => {
        const selectableItems = document.querySelectorAll(`.workmap-item:not(#${CSS.escape(props.item.id)})`);
        selectableItems.forEach((item) => {
            item.onclick = null;
            item.onmouseover = null;
            item.className = item.className.slice(0, -11); // ' selectable' is 11 chars long
        });
        setSelecting(false);
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
                {selecting ? 
                <IconButton onClick={handleCancelPath}>
                    <BlockIcon />
                </IconButton> :
                <IconButton onClick={handleNewPath}>
                    <TrendingUpIcon />
                </IconButton>}
            </CardActions>
        </Card>
    );
}
