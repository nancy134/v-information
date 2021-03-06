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
import { CardDeck, Card, CardImg, CardBody, CardTitle } from 'reactstrap';
import { Table } from 'reactstrap';
import { getJsonFromUrl } from '../utils.js';

export default class State extends Component {
  constructor(props) {
    super(props)
    this.onCheckRegistration = this.onCheckRegistration.bind(this);
    this.onOfficialWebsite = this.onOfficialWebsite.bind(this);
    this.handleStateChange = this.handleStateChange.bind(this);

    var results = getJsonFromUrl(props.location.search.substr(1));
    var stateId = null;
    if (results.state) stateId = results.state;

    this.state = {
      states: null,
      stateOptions: null,
      selectedStateIndex: -1,
      stateId: stateId,
      campaigns: null,
      districts: null
    };
  }

  componentDidMount(){
    var ip_state = null;
    var ip_address = null;
    var metas = document.getElementsByTagName('meta');
    for (var i = 0; i< metas.length; i++)
    {
      for (var j =0; j < metas[i].attributes.length; j++){
        if (metas[i].attributes[j].name === "property") {
          if (metas[i].attributes[j].value === "phowma:state"){
            ip_state = metas[i].getAttribute("content");
            ip_state = ip_state.toLowerCase();
          }
          if (metas[i].attributes[j].value === "phowma:ip"){
            ip_address = metas[i].getAttribute("content");
          }

        }
      }
    }
    if (ip_state === "$state") ip_state = null;
    if (ip_address === "$IP") ip_address = null;
    if (!ip_state && ip_address){

      const request = async () => {
        var url = 'https://ipinfo.io/'+ip_address+'/geo';
        const response = await fetch(url);
        const json = await response.json();
        if (json.region) {
          ip_state = json.region.toLowerCase();
        } 
        this.initializeStateData(ip_address, ip_state);
      }
      request();
    } else {
      this.initializeStateData(ip_address, ip_state);
    }
  }
  initializeStateData(ip_address, ip_state){
    States.search("min", (states) => {
      var stateOptions = [];
      var stateIndex = -1;
      var redirecting = false;
      stateOptions.push(<option value={stateIndex} selected>Select state</option>);
      for (var i=0; i<states.length; i++){
        if (this.state.stateId && this.state.stateId == states[i].id){
          stateOptions.push(<option value={i} selected>{states[i].name}</option>);
          stateIndex = i;
        } else if (!this.state.stateId && ip_state && (states[i].name.toLowerCase() == ip_state)){
          stateOptions.push(<option value={i} selected>{states[i].name}</option>);
          stateIndex = i;
          redirecting = true;
          //redirect
          var url = window.location.protocol + "//" + window.location.hostname + "/" + "state?state="+states[i].id;
          window.location.href = url; 
        } else {
          stateOptions.push(<option value={i}>{states[i].name}</option>);
        }
      }
      if (!redirecting){
        if (stateIndex > -1){
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
        } else {
          this.setState({
            states: states,
            stateOptions: stateOptions,
          });
        }
      }
    });
  }
  handleStateChange(e){
    var selectedStateIndex = e.target.value;
var url = window.location.protocol + "//" + window.location.hostname + "/" + "state?state="+this.state.states[selectedStateIndex].id;
    window.location.href = url; 
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
    var url = "https://www.rockthevote.org/voting-information/"+this.state.states[this.state.selectedStateIndex].name;
    url = url.replace(" ","-");
    url = url.toLowerCase();
    console.log("url: "+url);
    window.open(url,"_blank");
  }
  onHeadCount(){

    var url = "https://www.headcount.org/state/"+this.state.states[this.state.selectedStateIndex].name;
    url = url.replace(" ","-");
    url = url.toLowerCase();
    window.open(url,"_blank");
  } 
  onSenateSocialMedia(){
var url = window.location.protocol + "//" + window.location.hostname + "/" + "senate?state="+this.state.states[this.state.selectedStateIndex].id;
    window.location.href = url;
  }
  onHouse(e){
    var districtIndex = parseInt(e.target.value);
    var url = window.location.protocol + "//" + window.location.hostname + "/house?district=" + this.state.districts[districtIndex].id + "&state=" + this.state.districts[districtIndex].state.id;
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
    if (!this.state.campaigns){
      return([]);
    } else {
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
  }
  renderSenateCandidates(){
    var firstCandidate = null;
    var secondCandidate = null;
   
    if (this.state.campaigns){
      var senatorCount = 0;
      var senateOffices = [];
      for (var i=0; i<this.state.campaigns.length; i++){
        if (this.state.campaigns[i].election.office.position == 'senator'){
          senateOffices.push(this.state.campaigns[i].election.office.id);
        }
      }
      var uniqueSenateOffices = Array.from(new Set(senateOffices));
      for (var i=0; i<this.state.campaigns.length; i++){
        if (this.state.campaigns[i].election.office.position == 'senator' && this.state.campaigns[i].election.office.id == uniqueSenateOffices[0]){
          if (!firstCandidate) firstCandidate = this.state.campaigns[i].politician;
          else if (!secondCandidate) secondCandidate = this.state.campaigns[i].politician;
        }
      }
    }
    if (firstCandidate && secondCandidate){
    return([
      <Jumbotron className="pt-2 pb-2">
        <h3 className="text-center">US Senate Candidates</h3>
        <p className="text-center">Below are the Senate candidates in {this.state.states[this.state.selectedStateIndex].name}.</p>
        <Row>
        <Col>
        <Card>
          <CardImg top width="100%" src={firstCandidate.twitter_banner} />
          <CardBody>
            <CardTitle>{firstCandidate.first_name} {firstCandidate.last_name} ({firstCandidate.party[0].toUpperCase()})</CardTitle>
            <p>{firstCandidate.twitter_bio}</p>
          </CardBody>
        </Card>
        </Col>
        <Col>
        <Card>
          <CardImg top width="100%" src={secondCandidate.twitter_banner} />

          <CardBody>
            <CardTitle>{secondCandidate.first_name} {secondCandidate.last_name} ({secondCandidate.party[0].toUpperCase()})</CardTitle>
            <p>{secondCandidate.twitter_bio}</p>
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
          rows.push(
            <tr>
              <td>{this.state.districts[i].name}</td>
              <td>
                <h4><img src={demCandidate.twitter_image}/>{demCandidate.first_name} {demCandidate.last_name}</h4>
                <p>{demCandidate.twitter_bio}</p>
              </td>
              <td>
                <h4><img src={repCandidate.twitter_image}/>{repCandidate.first_name} {repCandidate.last_name}</h4>
                <p>{repCandidate.twitter_bio}</p>
              </td>
              <td>
                <Button color="link" value={i} onClick={(e) => {this.onHouse(e)}}>See More</Button>
              </td>
            </tr>
          );
        } else if (demCandidate && !repCandidate){
          rows.push(
            <tr>
              <td>{this.state.districts[i].name}</td>
              <td>
                <h4><img src={demCandidate.twitter_image}/>{demCandidate.first_name} {demCandidate.last_name}</h4>
              </td>
              <td>No Republican candidate</td>
              <td>
                <Button color="link" value={i} onClick={(e) => {this.onHouse(e)}}>See More</Button>
              </td>
            </tr>
          );
        } else if (!demCandidate && repCandidate){
          rows.push(
            <tr>
              <td>{this.state.districts[i].name}</td>
              <td>No Democratic candidate</td>
              <td>
                <h4><img src={repCandidate.twitter_image}/>{repCandidate.first_name} {repCandidate.last_name}</h4>
              </td>
              <td>
                <Button color="link" value={i} onClick={(e) => {this.onHouse(e)}}>See More</Button>
              </td>
            </tr>
          );
        }
      }
      return([
      <Jumbotron className="pt-2 pb-2">
        <h3 className="text-center">US Congressional Candidates</h3>
        <p className="text-center">Below are the Democratic and Republican candidates for each of the Districts in {this.state.states[this.state.selectedStateIndex].name}.<br/>
If you don't know your congressional district you can find it <a href="./house">here.</a></p>
        <Table>
          <thead>
            <tr>
              <th>District</th>
              <th>Democrat</th>
              <th>Republican</th>
              <th></th>
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
  renderVoterInformation(){
    if (!this.state.campaigns){
      return([]);
    } else {
      return([
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

      ]);
    }
  }
  render() {
    if (!this.state.states){
      return ([<p className="text-center">Loading...</p>]);
    }else{
    return ([
    <Container>
      <Jumbotron className="pt-2 pb-2">
        <h2 className="text-center">2018 Midterm Elections</h2>
        <p className="text-center">The midterm elections are the general elections that are held in the middle of the presidential term.  During the midterm election all 435 seats in the House of Representatives are up for election and 33 Senate seats. These elections are important because they determine which party controls the House and Senate.</p>
        <h4 className="text-center">Select a state to find out the candidates up for election</h4>
        <Row className="m-3">
          <Col md={{size: 4, offset: 4}} className="text-center">
            {this.renderStateSelector()}
          </Col>
        </Row>
      </Jumbotron>
      {this.renderSenateCandidates()}
      {this.renderCongressionalCandidates()}
      {this.renderVoterInformation()}
    </Container>
    ]);
  }
  }
}
State.contextTypes = {
  mixpanel: PropTypes.object.isRequired
}
