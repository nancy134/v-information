import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Nav, Navbar, NavbarBrand, NavbarToggler, Collapse } from 'reactstrap';
import Routes from './Routes';
import RouteNavItem from './components/RouteNavItem';

import { Button } from 'reactstrap';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isOpen: false
    }
    this.toggle = this.toggle.bind(this)
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  render() {
    return (
      <div>
        <Navbar expand="md" className="navbar-light bg-light">
          <NavbarBrand href="/">Voter-Information</NavbarBrand>
          <NavbarToggler onClick={this.toggle} className="mr-2"/>
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <RouteNavItem href="/">Home</RouteNavItem>
            </Nav>
          </Collapse>
        </Navbar>
        <Routes></Routes>
      </div>
    );
  }
}

export default App;
