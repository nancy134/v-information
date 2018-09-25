import React, { Component } from 'react';
import './App.css';
import { Nav, Navbar, NavbarBrand, NavbarToggler, Collapse } from 'reactstrap';
import { Jumbotron } from 'reactstrap';
import Routes from './Routes';
import RouteNavItem from './components/RouteNavItem';

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
<div className="text-center">
<a target="_blank"  href="https://www.amazon.com/gp/product/B07GVVG7CF/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=B07GVVG7CF&linkCode=as2&tag=voterinformat-20&linkId=dbe089ee74a688b9b5d758705b426394">
<img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&MarketPlace=US&ASIN=B07GVVG7CF&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=_SL160_&tag=voterinformat-20" />
</a>
<a target="_blank"  href="https://www.amazon.com/gp/product/B07F2LGJ4F/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=B07F2LGJ4F&linkCode=as2&tag=voterinformat-20&linkId=9ae971b5baa2382e5d08a27f959a7ebf">
<img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&MarketPlace=US&ASIN=B07F2LGJ4F&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=_SL160_&tag=voterinformat-20" />
</a>
<a target="_blank"  href="https://www.amazon.com/gp/product/B07C96YB9T/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=B07C96YB9T&linkCode=as2&tag=voterinformat-20&linkId=a40803bb2256b9117106dbd6005fe13a">
<img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&MarketPlace=US&ASIN=B07C96YB9T&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=_SL160_&tag=voterinformat-20" />
</a>
<a target="_blank"  href="https://www.amazon.com/gp/product/B0795Z71G6/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=B0795Z71G6&linkCode=as2&tag=voterinformat-20&linkId=3e1767a2365cb8b307d7826bee3ad650">
<img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&MarketPlace=US&ASIN=B0795Z71G6&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=_SL160_&tag=voterinformat-20" />
</a>
<a target="_blank"  href="https://www.amazon.com/gp/product/B07GT3V172/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=B07GT3V172&linkCode=as2&tag=voterinformat-20&linkId=ad23bc9991d36432cce2e2b35e739c2f">
<img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&MarketPlace=US&ASIN=B07GT3V172&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=_SL160_&tag=voterinformat-20" />
</a>
<a target="_blank"  href="https://www.amazon.com/gp/product/B073PVPC33/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=B073PVPC33&linkCode=as2&tag=voterinformat-20&linkId=615a3f890618ee85b8fc6be559af1857">
<img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&MarketPlace=US&ASIN=B073PVPC33&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=_SL160_&tag=voterinformat-20" />
</a>
</div>
        <Navbar expand="md" color="dark" dark>
          <NavbarBrand href="/">Voter-Information</NavbarBrand>
          <NavbarToggler onClick={this.toggle} className="mr-2"/>
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <RouteNavItem href="/house">House</RouteNavItem>
              <RouteNavItem href="/senate">Senate</RouteNavItem>
              <RouteNavItem href="/voter">Voter</RouteNavItem>
              <RouteNavItem href="/state">State</RouteNavItem> 
              <RouteNavItem href="/contact">Contact</RouteNavItem>
            </Nav>
          </Collapse>
        </Navbar>
        <Routes></Routes>
      </div>
    );
  }
}

export default App;
