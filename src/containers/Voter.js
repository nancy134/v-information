import React, { Component } from 'react';
import styles from "./Voter.css"
import { Alert } from 'reactstrap';
import { Form, Input, Button } from 'reactstrap';
import { Container, Row, Col } from 'reactstrap';
import { Jumbotron } from 'reactstrap';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import States from '../actions/States';
import Campaigns from '../actions/Campaigns';
import Districts from '../actions/Districts';
import PropTypes from 'prop-types';
import { Carousel, CarouselItem } from 'reactstrap';
import { Media } from 'reactstrap';
import { CardDeck, Card, CardBody, CardTitle } from 'reactstrap';
import { Table } from 'reactstrap';

export default class Voter extends Component {
  constructor(props) {
    super(props)
    this.onCheckRegistration = this.onCheckRegistration.bind(this);
    this.onOfficialWebsite = this.onOfficialWebsite.bind(this);
    this.handleStateChange = this.handleStateChange.bind(this);
    this.state = {
      states: null,
      stateOptions: null,
      selectedStateIndex: -1,
      campaigns: null,
      districts: null
    };
  }

  componentDidMount(){
    var ip_state = null;
    var metas = document.getElementsByTagName('meta');
    for (var i = 0; i< metas.length; i++)
    {
      for (var j =0; j < metas[i].attributes.length; j++){
        if (metas[i].attributes[j].name === "property") {
          if (metas[i].attributes[j].value === "phowma:state"){
            ip_state = metas[i].attributes[1].value;
            ip_state = ip_state.toLowerCase();
          }
        }
      }
    } 
    States.search("min", (states) => {
      var stateOptions = [];
      var stateIndex = -1;
      for (var i=0; i<states.length; i++){
        if (states[i].name.toLowerCase() == ip_state){
          stateOptions.push(<option value={i} selected>{states[i].name}</option>);
          stateIndex = i;
        } else {
          stateOptions.push(<option value={i}>{states[i].name}</option>);
        }
      }
      Campaigns.index("q[election_office_state_id_eq]="+states[stateIndex].id, (campaigns) => {
        Districts.byState(states[stateIndex].id, (districts) => {
          this.setState({
            states: states,
            stateOptions: stateOptions,
            campaigns: campaigns,
            selectedStateIndex: stateIndex,
            districts: districts
          });
        });
      });
    });
  }
  handleStateChange(e){
    var selectedStateIndex = e.target.value;
    Campaigns.index("q[election_office_state_id_eq]="+this.state.states[selectedStateIndex].id, (campaigns) => {
      Districts.byState(this.state.states[selectedStateIndex].id, (districts) => {

        this.setState({
          selectedStateIndex: selectedStateIndex,
          campaigns: campaigns,
          districts: districts
        });
      });
    });
  }
  onCheckRegistration(){
    var url = this.state.states[this.state.selectedStateIndex].registered;
    window.open(url, "_blank")
  }
  onOfficialWebsite(){
    var url = this.state.states[this.state.selectedStateIndex].voting;
    window.open(url, "_blank");
  }
  onRockTheVote(){
    var url = "https://www.rockthevote.org/voting-information/"+this.state.states[this.state.selectdStateIndex].name;
    url = url.replace(" ","-");
    url = url.toLowerCase();
    window.open(url,"_blank");
  }
  onHeadCount(){
    var url = "https://www.headcount.org/state/"+this.state.states[this.state.selectedStateIndex].name;
    url = url.replace(" ","-");
    url = url.toLowerCase();
    window.open(url,"_blank");
  } 
  onSenateSocialMedia(){
    window.location.href = "http://server.phowma.com/senate?state="+this.state.states[this.state.selectedStateIndex].id;
  }
  onHouse(e){
    var districtIndex = parseInt(e.target.value);
    var url = "http://server.phowma.com/house?district="+this.state.districts[districtIndex].id+"&state="+this.state.districts[districtIndex].state.id;
    console.log("url: "+url);
    window.location.href = url;
  }
  renderCheckRegistration(){
    var text = "Check your voter registration";
    if (this.state.selectedStateIndex >= 0) {
      text = text + " in " + this.state.states[this.state.selectedStateIndex].name;
    }
    return([
      <Button color="link" className="btn-wrap" onClick={() => {this.onCheckRegistration()}}>{text}</Button>
    ]);
  }
  renderOfficialWebsite(){
    var text = "Go to the official state website";
    if (this.state.selectedStateIndex >= 0){
      text = "Go to the official " + this.state.states[this.state.selectedStateIndex].name + " voting website";
    }
    return([
      <Button color="link" className="btn-wrap" onClick={() => {this.onOfficialWebsite()}}>{text}</Button>
    ]);
  }
  renderWebsites(){
    var rockTheVoteUrl = "https://www.rockthevote.org/voting-information/nebraska/";
    return([
      <Button
        color="link"
        className="btn-wrap"
        onClick={()=> {this.onRockTheVote()}}>
        rockthevote.org
      </Button>,
      <Button
        color="link"
        className="btn-wrap"
        onClick={() => {this.onHeadCount()}}>
        headcount.org
      </Button>

    ]);
  }
  renderSenateCandidates(){
    var demCandidate = null;
    var repCandidate = null;
    if (this.state.campaigns){
      for (var i=0; i<this.state.campaigns.length; i++){
        if (this.state.campaigns[i].election.office.position == 'senator'){
          if (this.state.campaigns[i].politician.party == 'democrat'){
            demCandidate = this.state.campaigns[i].politician;
          } else if (this.state.campaigns[i].politician.party == 'republican') {
            repCandidate = this.state.campaigns[i].politician;
          }
        }
      }
    }
    if (demCandidate && repCandidate){
    return([
      <Jumbotron className="pt-2 pb-2">
        <h3 className="text-center">US Senate Candidates</h3>
        <Row>
        <Col>
        <Card>
          <CardBody>
            <CardTitle>{demCandidate.first_name} {demCandidate.last_name}</CardTitle>
          </CardBody>
        </Card>
        </Col>
        <Col>
        <Card>
          <CardBody>
            <CardTitle>{repCandidate.first_name} {repCandidate.last_name}</CardTitle>
          </CardBody>
        </Card>
        </Col>
        </Row>
        <div className="text-center">
          <Button color="link" onClick={() => {this.onSenateSocialMedia()}}>Check out what the candidates are saying on social media</Button>
        </div>
      </Jumbotron>

    ]);
    } else {
      return([]);
    }
  }
  renderCongressionalCandidates(){
    if (!this.state.campaigns){
      return([]);
    } else {
      var rows = [];
      for (var i=0; i<this.state.districts.length; i++){
        var demCandidate = null;
        var repCandidate = null;
        for (var j=0; j<this.state.campaigns.length; j++){
          if (this.state.campaigns[j].election.office.position == "representative" && this.state.campaigns[j].election.office.district.id == this.state.districts[i].id){
            if (this.state.campaigns[j].politician.party == 'democrat'){
              demCandidate = this.state.campaigns[j].politician;
            }else if (this.state.campaigns[j].politician.party == 'republican'){
              repCandidate = this.state.campaigns[j].politician;
            }
          }
        }
        if (demCandidate && repCandidate){
          console.log("i for districts: "+i);
          rows.push(<tr><td>{this.state.districts[i].name}</td><td>{demCandidate.first_name} {demCandidate.last_name}</td><td>{repCandidate.first_name} {repCandidate.last_name}</td><td></td><td><Button color="link" value={i} onClick={(e) => {this.onHouse(e)}}>Social Media</Button></td></tr>);
        } else if (demCandidate && !repCandidate){
          rows.push(<tr><td>{this.state.districts[i].name}</td><td>{demCandidate.first_name} {demCandidate.last_name}</td><td>No candidate</td><td></td><td><Button color="link" value={i} onClick={() => {this.onHouse(i)}}>Social Media</Button></td></tr>);
        } else if (!demCandidate && repCandidate){
          rows.push(<tr><td>{this.state.districts[i].name}</td><td>No candidate</td><td>{repCandidate.first_name} {repCandidate.last_name}</td><td></td><td><Button color="link" value={i} onClick={() => {this.onHouse(i)}}>Social Media</Button></td></tr>);
        }
      }
      return([
      <Jumbotron className="pt-2 pb-2">
        <h3 className="text-center">US Congressional Candidates</h3>
        <Table>
          <thead>
            <tr>
              <th>District</th>
              <th>Democrat</th>
              <th>Republican</th>
              <th>Other</th>
              <th>Social Media</th>
            </tr>
          </thead>
          <tbody>
            {rows}
          </tbody>
        </Table>
      </Jumbotron>

      ]);
    }
  }
  renderStateSelector(){
    return([
      <div className="text-center">
        <Input type="select" name="state" onChange={this.handleStateChange}>
          {this.state.stateOptions}
        </Input>
      </div>
    ]);
  }
  render() {
    if (!this.state.states){
      return ([<p>Loading...</p>]);
    }else{
    return ([
    <Container>
      <Jumbotron className="pt-2 pb-2">
        <h2 className="text-center">2018 Midterm Election Information</h2>
        <h4 className="text-center">Select your state</h4>
        <Row className="m-3">
          <Col md={{size: 4, offset: 4}} className="text-center">
            {this.renderStateSelector()}
          </Col>
        </Row>
      </Jumbotron>
      {this.renderSenateCandidates()}
      {this.renderCongressionalCandidates()}
      <Jumbotron className="pt-2">
        <h3 className="text-center">Voter Information</h3>
        <CardDeck>
          <Card>
            <CardBody>
              {this.renderCheckRegistration()}
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              {this.renderOfficialWebsite()}
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <div className="text-center">
                <p>More websites...</p>
                {this.renderWebsites()}
              </div>
            </CardBody>
          </Card>
        </CardDeck>
      </Jumbotron>
    </Container>
    ]);
  }
  }
}
Voter.contextTypes = {
  mixpanel: PropTypes.object.isRequired
}
