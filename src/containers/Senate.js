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
      state: null,
      demCandidate: null,
      repCandidate: null
    }
    this.setCampaign = this.setCampaign.bind(this);
  }

  componentDidMount() {
    var stateOptions = [];

    States.search("list", (states) => {
      stateOptions.push(<option value={0}>Select State</option>);
      for (let i=0; i<states.length; i++) {
        if (states[i].id == this.state.stateId)
          stateOptions.push(<option value={states[i].id} selected>{states[i].name}</option>);
        else
          stateOptions.push(<option value={states[i].id}>{states[i].name}</option>);
      }
      this.setState({
        stateOptions: stateOptions
      });
    });
    console.log("this.state.stateId: "+this.state.stateId);
    if (this.state.stateId){
      var query = "q[election_office_state_id_eq]="+
        this.state.stateId+
        "&q[election_office_position_eq]=0";
      Campaigns.index(query, (campaigns) => {
        var state = null;
        console.log("campaigns.length: "+campaigns.length);
        if (campaigns.length > 0){
          state = campaigns[0].election.office.state;
        }
        this.setCampaign(state,campaigns);
      });
    }
  }

  setCampaign(state, campaigns){
    console.log("state: "+JSON.stringify(state));
    var demCandidate = null;
    var repCandidate = null;

    for (var i=0; i<campaigns.length; i++){
      if (campaigns[i].politician.party == 'democrat'){
        demCandidate = campaigns[i];
      } else if (campaigns[i].politician.party == 'republican'){
        repCandidate = campaigns[i];
      }
    }
    console.log("state: "+state);
    this.setState({
      state: state,
      demCandidate: demCandidate,
      repCandidate: repCandidate
    });
  }

  renderStateSelector() {
    return ([
      <Jumbotron>
        <h3>Select your state to see if your sentor is up from re-election</h3>
        <Form inline>
          <Input type="select" name="state">
            {this.state.stateOptions}
          </Input> 
          <Button>Find Candidates</Button>
        </Form>
      </Jumbotron>
    ]);  
  }
  renderDemCandidateName() {
    if (this.state.demCandidate){
      return([
        <h3>{this.state.demCandidate.politician.first_name} {this.state.demCandidate.politician.last_name} (D)</h3> 
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
    console.log("social_id: "+this.state.demCandidate.politician.posts[0].social_id);
    if (this.state.demCandidate.politician.posts.length == 1) {
      return ([
        <TweetEmbed id={this.state.demCandidate.politician.posts[0].social_id} />
      ]);
    } else if (this.state.demCandidate.politician.posts.length == 2) {

      return ([
        <TweetEmbed id={this.state.demCandidate.politician.posts[0].social_id} />,
        <TweetEmbed id={this.state.demCandidate.politician.posts[1].social_id} />
      ]);
    } else {
      if (!this.state.demCandidate.politician.twitter) {
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
  renderCandidates(){
    console.log("this.state.state: "+this.state.state);
    if (!this.state.state){
      return([
      ]);
    } else {
      return([
      <Jumbotron>
        <Row>
          <Col md={{size:12}}>
            <Alert color="primary">
              <h2 className="text-center">{this.state.state.name} candidates for Senate</h2>
            </Alert>
          </Col>
        </Row>
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
      </Jumbotron>
      ]);
    }
  }

  render() {
    return ([
      <Container>
        {this.renderStateSelector()}
        {this.renderCandidates()}
      </Container>
    ]);
  }

}
