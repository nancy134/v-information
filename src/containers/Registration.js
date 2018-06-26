import React, { Component } from 'react';
import "./Registration.css"
import { Alert } from 'reactstrap';
import { Button } from 'reactstrap';
import { Container, Row, Col } from 'reactstrap';
import { Jumbotron } from 'reactstrap';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import States from '../actions/States';

export default class Race extends Component {
  constructor(props) {
    super(props)
    this.toggle = this.toggle.bind(this);
    this.onCheckRegistration = this.onCheckRegistration.bind(this);
    this.state = {
      dropdownOpen: false,
      states: null,
      currentState: null,
      ipState: props.match.params.id
    };
  }

  componentDidMount(){
    States.search("min", (states) => {
      var ip_state = null;
      var current_state = null;
      var state_name = null;
      if (this.state.ipState) {
        ip_state = this.state.ipState.toLowerCase();
        for (var i=0; i<states.length; i++){
          state_name = states[i].name.toLowerCase();
          if (state_name === ip_state) {
            current_state = states[i].name;
            break;
          }
        }
      }
      this.setState({states: states,
                    currentState: current_state});
    });
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }
  onCheckRegistration(){
    var url = "";
    for (var i = 0; i < this.state.states.length; i++){
      if (this.state.currentState === this.state.states[i].name){
        url = this.state.states[i].registered;
        break;
      }
    }
    window.open(url, "_blank")
  }

  select(event){
    this.setState({
      currentState: event.target.innerText 
    });

  }
  renderStates(){
    var items = []
    var prompt = "";
    if (this.state.currentState){
      prompt = this.state.currentState;
    } else {
      prompt = "Select your state";
    }
    if (this.state.states) {
      this.state.states.forEach((state, i) => {
        items.push(
          <DropdownItem onClick={(e) => this.select(e)}>{state.name}</DropdownItem>
        );
      });
      return [
        <DropdownToggle caret>
          {prompt} 
        </DropdownToggle>,
        <DropdownMenu className="phowma_dropdown">
          {items}
        </DropdownMenu>
      ];
    }
  }

  renderButton() {
    var text = "Check your voter registration";

    if (this.state.currentState) {
      text = text + " in " + this.state.currentState;  
    }
    return [
      <Button size="lg" color="primary" className="phowmaButton" onClick={() => {this.onCheckRegistration()}}>{text}</Button>
    ];
  }

  render() {
    if (!this.state.states){
      return ([<p>Loading...</p>]);
    }else{
    return ([
    <Container>
      <Row>
        <Col md={{size: 12}} className="mt-5">
          <Alert color="danger">
            <h4 className="text-center phowma_headline"><a href="https://www.nytimes.com/2018/06/11/us/politics/supreme-court-upholds-ohios-purge-of-voting-rolls.html" className="alert-link" target="_blank">Supreme Court Upholds Ohio’s Purge of Voting Rolls</a></h4>
          </Alert>
        </Col>
      </Row>
      <Jumbotron>
          <h2 className="text-center">Check your voter registration now!</h2>
          <Row className="m-3">
          <Col md={{size: 6, offset: 3}} className="text-center">

          <ButtonDropdown size="lg" isOpen={this.state.dropdownOpen} toggle={this.toggle}>
            {this.renderStates()}
          </ButtonDropdown>
          </Col>
          </Row>
          <Row className="m-3">
          <Col md={{size: 6, offset: 3}} className="text-center">

          {this.renderButton()}
          <p>(Will open in new tab)</p>
          </Col>
          </Row>
      </Jumbotron>
    </Container>
    ]);
  }
  }
}
