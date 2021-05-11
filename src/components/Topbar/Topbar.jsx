import React from 'react';
import './Topbar.scss';
import logo from '../../assets/oka-logo.png';
import { signInWithGoogle, signOut } from '../../firebase';
import { useSelector } from 'react-redux';
import { Button } from '@material-ui/core';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

function Topbar() {
    const user = useSelector(state => state.user);

    return ( 
        <div className="topbar-container">
            <a href="/">
                <img src={logo} className="topbar-logo" alt=""/>
            </a>
            <a className="topbar-item" href="/home">Home</a>
            <a className="topbar-item" href="/workmap">WorkMap</a>
            <a className="topbar-item" href="/takeabreak">Take a Break</a>
            {user ?
            <Button variant="contained" color="primary" size="medium"
                    endIcon={<ExitToAppIcon/>}
                    className="topbar-button"
                    onClick={signOut}>
                Signout
            </Button> : 
            <Button variant="contained" color="primary" size="large"
                    endIcon={<AccountCircleIcon/>}
                    className="topbar-button"
                    onClick={signInWithGoogle}>
                Sign in with Google
            </Button>}
        </div>
    );
}
 
export default Topbar;