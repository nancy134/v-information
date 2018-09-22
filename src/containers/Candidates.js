import React, { Component } from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';
import { Container, Jumbotron } from 'reactstrap';
import Politicians from '../actions/Politicians';

export default class Candidates extends Component {
  constructor(props){
    super(props)
    this.state = {
      politicians: null
    };
  }
  componentDidMount(){
    Politicians.search((politicians) => {
      this.setState({
        politicians: politicians,
        id: -1
      });
    });
  }
  render() {
    var myData = [
      'John',
      'Miles',
      'Charles',
      'Herbie'
    ];
    if (this.state.politicians){
    var labelKey = "name";
   
    return ([
      <Container>
      <Jumbotron>
      <Typeahead
        onChange={(selected) => {
          console.log('selected: '+JSON.stringify(selected));
        }}
        options={this.state.politicians}
        labelKey="name"
        valueKey="id"
      />
      <p>{this.state.id}</p>
      </Jumbotron>
      </Container>
    ]);
  } else {
    return([
      <p>Loading search terms</p>
    ]);
  }
  }

}
