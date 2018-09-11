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
            ip_state = metas[i].attributes[1].value;
            ip_state = ip_state.toLowerCase();
          }
        }
      }
    }
    States.search("list", (states) => {
      statesList = states;
      stateOptions.push(<option value={-1}>Select State</option>);
      for (let i=0; i<states.length; i++) {
        if (this.state.stateId && (states[i].id == this.state.stateId)){
          stateOptions.push(<option value={i} selected>{states[i].name}</option>);
          stateIndex = i;
        } else if (!this.state.stateId && ip_state && (states[i].name.toLowerCase() == ip_state)){
          window.location.href = "http://server.phowma.com/senate?state="+states[i].id;
        } else{ 
          stateOptions.push(<option value={i}>{states[i].name}</option>);
        }
      }

      if (this.state.stateId){
        var query = "q[election_office_state_id_eq]="+
          this.state.stateId+
          "&q[election_office_position_eq]=0"+
          "&q[s]=party asc";
        Campaigns.index(query, (campaigns) => {
          var firstCandidate = null;
          var secondCandidate = null;
          if (campaigns.length == 0) noCampaigns = true;
          if (campaigns.length == 1) {
            firstCandidate = campaigns[0];
          }
          if (campaigns.length == 2) {
            firstCandidate = campaigns[0];
            secondCandidate = campaigns[1]
          }
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
    });
  }

  handleStateChange(e){
    var stateIndex = e.target.value;
    window.location.href = "http://server.phowma.com/senate?state="+this.state.states[stateIndex].id;
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
    return this.renderCandidateName(this.state.firstCandidate);
  }
  renderSecondCandidateName() {
    return this.renderCandidateName(this.state.secondCandidate);
  }

  renderCandidatePosts(candidate){
    if (!candidate){
      return ([]);
    } else if (candidate.politician.posts.length == 1) {
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
          <Col>
            {this.renderFirstCandidateName()}
            {this.renderFirstCandidatePosts()}
          </Col>
          <Col>
            {this.renderSecondCandidateName()}
            {this.renderSecondCandidatePosts()}
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
