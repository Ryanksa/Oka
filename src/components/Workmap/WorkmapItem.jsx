import React from 'react';
import './Workmap.scss';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import CenterFocusWeakIcon from '@material-ui/icons/CenterFocusWeak';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';

const formatDueDate = (due) => {
    return (due.getMonth()+1) + "/" + due.getDate() + "/" + due.getFullYear();
};

export default function WorkmapItem(props) {
    const { item } = props;
    return (
        <Card key={item.id} className="workmap-item">
            <CardHeader title={item.name} subheader={item.due && formatDueDate(item.due)} />
            <CardContent>
                <pre>{item.description}</pre>
            </CardContent>
            <CardActions>
                <IconButton>
                    <AddCircleIcon />
                </IconButton>
                <IconButton>
                    <CenterFocusWeakIcon />
                </IconButton>
            </CardActions>
        </Card>
    )
}
