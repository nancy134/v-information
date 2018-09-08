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
      repCandidate: null
    }
    this.handleStateChange = this.handleStateChange.bind(this);
  }

  componentDidMount() {
    var stateOptions = [];
    var stateIndex = 0;
    var statesList = [];
    var demCandidate = null;
    var repCandidate = null;
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

          for (var i=0; i<campaigns.length; i++){
            if (campaigns[i].politician.party == 'democrat'){
              demCandidate = campaigns[i];
            } else if (campaigns[i].politician.party == 'republican'){
              repCandidate = campaigns[i];
            }
          }
          this.setState({
            stateOptions: stateOptions,
            states: statesList,
            stateIndex: stateIndex, 
            demCandidate: demCandidate,
            repCandidate: repCandidate
          });
        });
      } else {
        console.log("stateIndex: "+stateIndex);
        console.log("stateOptins: "+stateOptions);
        console.log("statesList: "+statesList);
        this.setState({
          stateOptions: stateOptions,
          states: statesList,
          stateIndex: stateIndex
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
      console.log("campaigns: "+JSON.stringify(campaigns));
      var demCandidate = null;
      var repCandidate = null;

      for (var i=0; i<campaigns.length; i++){
        if (campaigns[i].politician.party == 'democrat'){
          demCandidate = campaigns[i];
        } else if (campaigns[i].politician.party == 'republican'){
          repCandidate = campaigns[i];
        }
      }
      console.log("demCandidate: "+demCandidate);
      console.log("repCandidate: "+repCandidate);
      this.setState({
        stateIndex: stateIndex,
        campaigns: campaigns,
        demCandidate: demCandidate,
        repCandidate: repCandidate
      });
    });
  }
  renderStateSelector2() {
    console.log("renderStateSelector2()");
    return([
      <Input type="select" name="state" onChange={this.handleStateChange}>
        {this.state.stateOptions}
      </Input>
    ]);
  }
  renderDemCandidateName() {
    console.log("renderDemCandidateName()");
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
    console.log("renderRepCandidateName()");
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
    console.log("RenderDemCandidatePosts()");
    console.log("this.state.demCandidate: "+JSON.stringify(this.state.demCandidate));
    if (!this.state.demCandidate){
      return([]);
    } else {
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
  }

  renderRepCandidatePosts() {
    console.log("RenderRepCandidatePosts()");
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
    console.log("renderTitle()");
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
    console.log("renderCandidates()");
    console.log("this.state.stateIndex: "+this.state.stateIndex);
    if (this.state.stateIndex == -1){
      return([
      ]);
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

  render() {
    console.log("render()");
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
