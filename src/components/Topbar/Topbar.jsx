import React, { useContext } from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import './Topbar.scss';
import logo from '../../assets/oka-logo.png';
import firebaseApp from '../../firebase';
import firebase from 'firebase';
import { AuthContext } from '../../auth';

function Topbar() {
    const user = useContext(AuthContext);

    const signInWithGoogle = () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        firebaseApp.auth().signInWithPopup(provider);
    }

    return ( 
        <Navbar variant="dark" className="topbar-container">
            <Navbar.Brand href="/">
                <img src={logo} className="topbar-logo" alt=""/>
            </Navbar.Brand>
            <Nav className="mr-auto">
                <Nav.Link className="topbar-item" href="/home">Home</Nav.Link>
                <Nav.Link className="topbar-item" href="/workmap">WorkMap</Nav.Link>
                <Nav.Link className="topbar-item" href="/takeabreak">Take a Break</Nav.Link>
            </Nav>
            {user ?
            <button className="btn btn-primary topbar-button" 
                    onClick={() => firebaseApp.auth().signOut()}>
                Sign out
            </button> : 
            <button className="btn btn-primary navbar-button"
                    onClick={signInWithGoogle}>
                Sign in with Google
            </button>}
        </Navbar>
    );
}
 
export default Topbar;