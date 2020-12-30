import React, { Component } from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import '../styles/Components.css';
import logo from '../img/oka-logo.png';

class Topbar extends Component {
    render() { 
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
                <button className="btn btn-primary navbar-button">Sign up</button>
                <button className="btn btn-primary navbar-button">Log in</button>
            </Navbar>
        );
    }
}
 
export default Topbar;