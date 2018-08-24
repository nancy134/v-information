import React, { Component } from 'react';
import { Alert, Button } from 'reactstrap';
import { Container, Row, Col } from 'reactstrap';
import { Jumbotron } from 'reactstrap';
import TweetEmbed from 'react-tweet-embed';
import PlacesAutocomplete, {geocodeByAddress, getLatLng} from 'react-places-autocomplete';
import Districts from '../actions/Districts';
import Campaigns from '../actions/Campaigns';

export default class Race extends Component {
  constructor(props) {
    super(props)

    this.state = {
      state: props.match.params.state,
      position: props.match.params.position,
      id: props.match.params.id,
      address: '',
      district: null,
      demCandidate: null,
      repCandidate: null
    }
    this.onFindDistrict = this.onFindDistrict.bind(this);
  }
  handleChange = address => {
    this.setState({ address });
  }

  handleSelect = address => {
    console.log("handleSelect: address: "+address);
    this.setState({address: address});
  }
  onFindDistrict () {
    Districts.searchFull(this.state.address, (district) => {
      console.log("district: "+JSON.stringify(district));
      console.log("q[election_office_district_id_eq]="+district.id);
      Campaigns.index("q[election_office_district_id_eq]="+district.id, (campaigns) => {
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
        this.setState({
          district: district,
          demCandidate: demCandidate,
          repCandidate: repCandidate
        });
      });
    }).catch(error =>
      console.log("This is the error: "+error)
    );
    
    //geocodeByAddress(this.state.address)
    //  .then(results => getLatLng(results[0]))
    //  .then(latLng => console.log('Success', latLng))
    //  .catch(error => console.error('Error', error));
  }
  renderAddressBar() {
    return (
      <Jumbotron>
      <Row>
      <Col md={9}>
      <PlacesAutocomplete
        value={this.state.address}
        onChange={this.handleChange}
        onSelect={this.handleSelect}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div>
            <input
              {...getInputProps({
                placeholder: 'Enter home address ...',
                className: 'form-control location-search-input',
              })}
            />
            <div className="autocomplete-dropdown-container">
              {loading && <div>Loading...</div>}
              {suggestions.map(suggestion => {
                const className = suggestion.active
                  ? 'suggestion-item--active'
                  : 'suggestion-item';
                // inline style for demonstration purpose
                const style = suggestion.active
                  ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                  : { backgroundColor: '#ffffff', cursor: 'pointer' };
                return (
                  <div
                    {...getSuggestionItemProps(suggestion, {
                      className,
                      style,
                    })}
                  >
                    <span>{suggestion.description}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </PlacesAutocomplete>
      </Col>
      <Col md={3}>
        <Button onClick={() => {this.onFindDistrict()}}>Find district</Button>
      </Col>
      </Row>
      </Jumbotron>
    );
  }
  renderDemCandidatePosts() {
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
    if (this.state.repCandidate.politician.posts.length == 1) {
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
  renderCandidates() {
    if (!this.state.district || !this.state.demCandidate || !this.state.repCandidate){
    return ([
      <p>Searching candidates...</p>
    ]);
    } else {
    return ([
      <Row>
        <Col md={{size: 12}} >
          <Alert color="primary">
            <h2 className="text-center">Candidates for {this.state.district.state.name} {this.state.district.name} Congressional district</h2>
          </Alert>
        </Col>
      </Row>,
      <Jumbotron>
        <Row>
          <Col>
            <h3>{this.state.demCandidate.politician.party} {this.state.demCandidate.politician.first_name} {this.state.demCandidate.politician.last_name}</h3>
            {this.renderDemCandidatePosts()}
          </Col>
          <Col>
            <h3>{this.state.repCandidate.politician.party} {this.state.repCandidate.politician.first_name} {this.state.repCandidate.politician.last_name}</h3>
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
        <div>{this.renderAddressBar()}</div>
        {this.renderCandidates()}
      </Container>
    ]);
  }
}
