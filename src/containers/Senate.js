import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
import { Jumbotron, Alert } from 'reactstrap';
import { Form, Input, Button } from 'reactstrap';
import TweetEmbed from 'react-tweet-embed';
import States from '../actions/States';
import Campaigns from '../actions/Campaigns';
import { getJsonFromUrl } from '../utils.js';

export default class Senate extends Component {
  constructor(props) {
    super(props)

    var results = getJsonFromUrl(props.location.search.substr(1));
    var stateId = null;
    if (results.state) stateId = results.state;
   
    this.state = {
      stateOptions: null,
      stateId: stateId,
      states: null,
      stateIndex: -1,
      firstCandidate: null,
      secondCandidate: null,
      noCampaigns: false
    }
    this.handleStateChange = this.handleStateChange.bind(this);

  }

  componentDidMount() {
    var stateOptions = [];
    var stateIndex = -1;
    var statesList = [];
    var firstCandidate = null;
    var secondCandidate = null;
    var noCampaigns = false;
    var ip_state = null
    var metas = document.getElementsByTagName('meta');
    for (var i=0; i<metas.length; i++){
      for (var j =0; j < metas[i].attributes.length; j++){
        if (metas[i].attributes[j].name === "property") {
          if (metas[i].attributes[j].value === "phowma:state"){
            ip_state = metas[i].getAttribute("content");
            ip_state = ip_state.toLowerCase();
          }
        }
      }
    }
    States.search("list", (states) => {
      statesList = states;
      var redirecting = false;
      stateOptions.push(<option value={-1}>Select State</option>);
      for (let i=0; i<states.length; i++) {
        if (this.state.stateId && (states[i].id == this.state.stateId)){
          stateOptions.push(<option value={i} selected>{states[i].name}</option>);
          stateIndex = i;
        } else if (!this.state.stateId && ip_state && (states[i].name.toLowerCase() == ip_state)){
          redirecting = true;
          var url = window.location.protocol + "//" + window.location.hostname + "/" + "senate?state="+states[i].id;
          window.location.href = url; 
        } else{ 
          stateOptions.push(<option value={i}>{states[i].name}</option>);
        }
      }
      if (!redirecting){
      if (this.state.stateId){
        var query = "q[election_office_state_id_eq]="+
          this.state.stateId+
          "&q[election_office_position_eq]=0"+
          "&q[s]=party asc";
        Campaigns.index(query, (campaigns) => {
          var firstCandidate = null;
          var secondCandidate = null;
          var senateOffices = [];
          for (var i=0; i<campaigns.length; i++){
            if (campaigns[i].election.office.position == 'senator'){
              senateOffices.push(campaigns[i].election.office.id);
            }
          }
          var uniqueSenateOffices = Array.from(new Set(senateOffices));
          for (var i=0; i<campaigns.length; i++){
            if (campaigns[i].election.office.position == 'senator' && campaigns[i].election.office.id == uniqueSenateOffices[0]){
              if (!firstCandidate) firstCandidate = campaigns[i];
              else if (!secondCandidate) secondCandidate = campaigns[i];
            }
          }
          if (campaigns.length == 0) noCampaigns = true; 
          /*  
          if (campaigns.length == 0) noCampaigns = true;
          if (campaigns.length == 1) {
            firstCandidate = campaigns[0];
          }
          if (campaigns.length == 2) {
            firstCandidate = campaigns[0];
            secondCandidate = campaigns[1]
          }
          */
          this.setState({
            stateOptions: stateOptions,
            states: statesList,
            stateIndex: stateIndex, 
            firstCandidate: firstCandidate,
            secondCandidate: secondCandidate,
            noCampaigns: noCampaigns
          });
      
        });
      } else {
        this.setState({
          stateOptions: stateOptions,
          states: statesList,
          stateIndex: stateIndex,
          noCampaigns: noCampaigns
        });
      }
      }
    });
  }

  handleStateChange(e){
    var stateIndex = e.target.value;
    var url = window.location.protocol + "//" + window.location.hostname + "/" + "senate?state="+this.state.states[stateIndex].id;

    window.location.href = url; 
  }
  renderStateSelector2() {
    return([
      <Input type="select" name="state" onChange={this.handleStateChange}>
        {this.state.stateOptions}
      </Input>
    ]);
  }
  renderCandidateName(candidate){
    var party = "";
    if (candidate){
      if (candidate.politician.party == 'democrat'){
        party = "(D)";
      } else if (candidate.politician.party == 'republican'){
        party = "(R)";
      } else if (candidate.politician.party == 'independent'){
        party = "(I)";
      }
      return([
        <h3>{candidate.politician.first_name} {candidate.politician.last_name} {party}</h3>
      ]);
    } else {
      return([
      ]);
    }

  }
  renderFirstCandidateName() {
    if (this.state.firstCandidate)
    return this.renderCandidateName(this.state.firstCandidate);
  }
  renderSecondCandidateName() {
    if (this.state.secondCandidate)
    return this.renderCandidateName(this.state.secondCandidate);
  }

  renderCandidatePosts(candidate){
    if (!candidate){
      return ([]);
    } else if (candidate.politician.posts.length == 1) {
      return ([
        <TweetEmbed id={candidate.politician.posts[0].social_id} options={{width: '100%'}} />
      ]);

    } else if (candidate.politician.posts.length == 2) {
      return ([
        <TweetEmbed id={candidate.politician.posts[0].social_id} options={{width: '100%'}} />,
        <TweetEmbed id={candidate.politician.posts[1].social_id} options={{width: '100%'}}/>
      ]);
    } else if (candidate.politician.posts.length == 3) {
      return ([
        <TweetEmbed id={candidate.politician.posts[0].social_id} options={{width: '100%'}} />,
        <TweetEmbed id={candidate.politician.posts[1].social_id} options={{width: '100%'}}/>,
        <TweetEmbed id={candidate.politician.posts[2].social_id} options={{width: '100%'}}/>
      ]);
    } else if (candidate.politician.posts.length == 4) {
      return ([
        <TweetEmbed id={candidate.politician.posts[0].social_id} options={{width: '100%'}} />,
        <TweetEmbed id={candidate.politician.posts[1].social_id} options={{width: '100%'}}/>,
        <TweetEmbed id={candidate.politician.posts[2].social_id} options={{width: '100%'}}/>,
        <TweetEmbed id={candidate.politician.posts[3].social_id} options={{width: '100%'}}/>
      ]);
    } else {
      if (!candidate.politician.twitter) {
        return([
          <p>No twitter account for this candidate</p>
        ]);
      } else {
        return([
          <p>No posts for this candidate</p>
        ]);
      }
    }
  }

  renderFirstCandidatePosts() {
    return this.renderCandidatePosts(this.state.firstCandidate);
  }

  renderSecondCandidatePosts() {
    return this.renderCandidatePosts(this.state.secondCandidate);
  }
  renderTitle(){
    var title = "Select state to find candidates for Senate";
    if (this.state.stateIndex > 0){
      title = this.state.states[this.state.stateIndex].name + " candidates for Senate";
    }
    return([
          <Alert color="primary">
            <h2 className="text-center">{title}</h2>
            <Row>
            <Col md={{size: 4, offset: 4}} className="text-center">
            <div className="text-center">
              {this.renderStateSelector2()}
            </div>
            </Col>
            </Row>
          </Alert>
    ]);
  } 
  renderCandidates(){
    if (this.state.stateIndex == -1){
      return([
      ]);
    } else {
      if (this.state.noCampaigns){
      return([<h3>No Senate campaigns in this state</h3>]);
      } else {
      return([
        <Row>
          <Col md={6}>
            {this.renderFirstCandidateName()}
            {this.renderFirstCandidatePosts()}
          </Col>
          <Col md={6}>
            {this.renderSecondCandidateName()}
            {this.renderSecondCandidatePosts()}
          </Col>
        </Row>
      ]);
      }
    }
  }

  render() {
    if (this.state.stateIndex > -1){
    return ([
      <Container>
        <Jumbotron className="pt-2">
          <h2 className="text-center">2018 Midterm Elections</h2>
          <p className="text-center">The midterm elections are the general elections that are held in the middle of the presidential term.  During the midterm election all 435 seats in the House of Representatives are up for election and 33 Senate seats. These elections are important because they determine which party controls the House and Senate.</p>

          {this.renderTitle()}
          {this.renderCandidates()}
        </Jumbotron>
      </Container>
    ]);
    }else{
      return([<p className="text-center">Loading...Please wait...</p>]);
    }
  }

}
