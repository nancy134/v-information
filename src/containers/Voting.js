import React, { Component } from 'react';
import { Table } from 'reactstrap';
import States from '../actions/States';

export default class Voting extends Component {
  constructor(props){
    super(props)
    this.state = {
      stateInfo: null
    }
  }
  componentDidMount(){
    var stateInfo = [];

    States.search("min", (states) => {
      for (let i=0; i<states.length; i++){
        stateInfo.push(<tr><td>{states[i].name}</td>
        <td><a href={states[i].registered}>Check Registration ({states[i].abbreviation})</a></td>
        <td><a href="www.bing.com">More Information ({states[i].abbreviation})</a></td>
        <td><a href="www.nytimes.com">Rock the Vote (AL)</a></td></tr>);
      }
      this.setState({
        stateInfo: stateInfo
      });
    }); 
  }
  render() {
    return ([
      <Table>
        <thead>
          <tr>
            <th>State</th>
            <th>Check Registration</th>
            <th>More Information</th>
            <th>Rock the Vote</th>
          </tr>
        </thead>
        <tbody>
          {this.state.stateInfo}
        </tbody>
      </Table>    
    ]);
  }

}
