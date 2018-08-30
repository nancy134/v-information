import React, { Component } from 'react';
import { Table } from 'reactstrap';

export default class Voting extends Component {
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
          <tr>
            <td>Alabama</td>
            <td><a href="www.google.com">Check Registration (AL)</a></td>
            <td><a href="www.bing.com">More Information (AL)</a></td>
            <td><a href="www.nytimes.com">Rock the Vote (AL)</a></td>
          </tr>
        </tbody>
      </Table>    
    ]);
  }

}
