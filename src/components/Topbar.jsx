import React, { useContext } from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import '../styles/Components.css';
import logo from '../img/oka-logo.png';
import firebaseApp from '../firebase';
import firebase from 'firebase';
import { AuthContext } from './Auth';

function Topbar() {
    const user = useContext(AuthContext);

    const signInWithGoogle = () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        firebaseApp.auth().signInWithPopup(provider);
    }

    return ( 
        <Navbar bg="light" variant="light">
            <Navbar.Brand href="/">
                <img src={logo}/>
            </Navbar.Brand>
            <Nav className="mr-auto">
                <Nav.Link href="/home">Home</Nav.Link>
                <Nav.Link href="/workmap">WorkMap</Nav.Link>
                <Nav.Link href="/todaysfocus">Today's Focus</Nav.Link>
                <Nav.Link href="/takeabreak">Take a Break</Nav.Link>
            </Nav>
            {user ?
            <button className="btn btn-primary navbar-button" 
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