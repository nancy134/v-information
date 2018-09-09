import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
import { Jumbotron, Alert } from 'reactstrap';
import { Form, Input, Button } from 'reactstrap';
import TweetEmbed from 'react-tweet-embed';
import States from '../actions/States';
import Campaigns from '../actions/Campaigns';

export default class Senate extends Component {
  constructor(props) {
    super(props)

    const params = new URLSearchParams(props.location.search);
    const stateId = params.get('state');
    this.state = {
      stateOptions: null,
      stateId: stateId,
      states: null,
      stateIndex: -1,
      demCandidate: null,
      repCandidate: null,
      indCandidate: null,
      noCampaigns: false
    }
    console.log("this.state.noCampaigs: "+this.state.noCampaigns);
    this.handleStateChange = this.handleStateChange.bind(this);
  }

  componentDidMount() {
    var stateOptions = [];
    var stateIndex = -1;
    var statesList = [];
    var demCandidate = null;
    var repCandidate = null;
    var indCandidate = null;
    var noCampaigns = false;
    States.search("list", (states) => {
      statesList = states;
      stateOptions.push(<option value={-1}>Select State</option>);
      for (let i=0; i<states.length; i++) {
        if (states[i].id == this.state.stateId){
          stateOptions.push(<option value={i} selected>{states[i].name}</option>);
          stateIndex = i;
        } else{ 
          stateOptions.push(<option value={i}>{states[i].name}</option>);
        }
      }

      if (this.state.stateId){
        var query = "q[election_office_state_id_eq]="+
          this.state.stateId+
          "&q[election_office_position_eq]=0";
        Campaigns.index(query, (campaigns) => {
          var demCandidate = null;
          var repCandidate = null;
          var indCandidate = null;
          if (campaigns.length == 0) noCampaigns = true;
          for (var i=0; i<campaigns.length; i++){
            if (campaigns[i].politician.party == 'democrat'){
              demCandidate = campaigns[i];
            } else if (campaigns[i].politician.party == 'republican'){
              repCandidate = campaigns[i];
            } else if (campaigns[i].politician.party == 'independent'){
              indCandidate = campaigns[i];
            }
          }
          this.setState({
            stateOptions: stateOptions,
            states: statesList,
            stateIndex: stateIndex, 
            demCandidate: demCandidate,
            repCandidate: repCandidate,
            indCandidate: indCandidate,
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
    });
  }

  handleStateChange(e){
    var stateIndex = e.target.value;
    var query = "q[election_office_state_id_eq]="+
      this.state.states[stateIndex].id+
      "&q[election_office_position_eq]=0";

    Campaigns.index(query, (campaigns) => {
      var demCandidate = null;
      var repCandidate = null;
      var indCandidate = null;
      var noCampaigns = false;
      if (campaigns.length == 0) noCampaigns = true;
      for (var i=0; i<campaigns.length; i++){
        if (campaigns[i].politician.party == 'democrat'){
          demCandidate = campaigns[i];
        } else if (campaigns[i].politician.party == 'republican'){
          repCandidate = campaigns[i];
        } else if (campaigns[i].politician.party == 'independent'){
          indCandidate = campaigns[i];
        }
      }
      this.setState({
        stateIndex: stateIndex,
        campaigns: campaigns,
        demCandidate: demCandidate,
        repCandidate: repCandidate,
        indCandidate: indCandidate,
        noCampaigns: noCampaigns
      });
    });
  }
  renderStateSelector2() {
    return([
      <Input type="select" name="state" onChange={this.handleStateChange}>
        {this.state.stateOptions}
      </Input>
    ]);
  }
  renderDemCandidateName() {
    if (this.state.demCandidate){
      return([
        <h3>{this.state.demCandidate.politician.first_name} {this.state.demCandidate.politician.last_name} (D)</h3> 
      ]);
    } else if (this.state.indCandidate){ 
      return([
        <h3>{this.state.indCandidate.politician.first_name} {this.state.indCandidate.politician.last_name} (I)</h3>

      ]);
    } else {
      return([
        <h3>No Democratic candidate</h3>
      ]);
    }
  }
  renderRepCandidateName() {
    if (this.state.repCandidate){
      return([
        <h3>{this.state.repCandidate.politician.first_name} {this.state.repCandidate.politician.last_name} (R)</h3>
      ]);
    } else {
      return([
        <h3>No Republican candidate</h3>
      ]);
    }
  }

  renderDemCandidatePosts() {
    if (!this.state.demCandidate && !this.state.indCandidate){
      return([]);
    } else {
    var candidate = null;
    if (this.state.demCandidate){
      candidate = this.state.demCandidate;
    }else if (this.state.indCandidate){
      candidate = this.state.indCandidate;
    }

    if (candidate.politician.posts.length == 1) {
      return ([
        <TweetEmbed id={candidate.politician.posts[0].social_id} />
      ]);
    } else if (candidate.politician.posts.length == 2) {

      return ([
        <TweetEmbed id={candidate.politician.posts[0].social_id} />,
        <TweetEmbed id={candidate.politician.posts[1].social_id} />
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
  }

  renderRepCandidatePosts() {
    if (!this.state.repCandidate){
      return ([]);
    } else if (this.state.repCandidate.politician.posts.length == 1) {
      return ([
        <TweetEmbed id={this.state.repCandidate.politician.posts[0].social_id} />
      ]);

    } else if (this.state.repCandidate.politician.posts.length == 2) {
      return ([
        <TweetEmbed id={this.state.repCandidate.politician.posts[0].social_id} />,
        <TweetEmbed id={this.state.repCandidate.politician.posts[1].social_id} />
      ]);
    } else {
      if (!this.state.repCandidate.politician.twitter) {
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
          <Col>
            {this.renderDemCandidateName()}
            {this.renderDemCandidatePosts()}
          </Col>
          <Col>
            {this.renderRepCandidateName()}
            {this.renderRepCandidatePosts()}
          </Col>
        </Row>
      ]);
      }
    }
  }

  render() {
    return ([
      <Container>
        <Jumbotron>
          {this.renderTitle()}
          {this.renderCandidates()}
        </Jumbotron>
      </Container>
    ]);
  }

}
