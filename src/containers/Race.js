import React, { Component } from 'react';
import { Alert } from 'reactstrap';
import { Container, Row, Col } from 'reactstrap';
import { Jumbotron } from 'reactstrap';
import TweetEmbed from 'react-tweet-embed';

export default class Race extends Component {
  constructor(props) {
    super(props)

    this.state = {
      state: props.match.params.state,
      position: props.match.params.position,
      id: props.match.params.id
    }
  }
  render() {
    return ([
    <Container>
      <Row>
        <Col md={{size: 12}} className="mt-5">
          <Alert color="primary">
            <h2 className="text-center">Candidates for Texas 18th Congressional district</h2>
          </Alert>
        </Col>
      </Row>
      <Jumbotron>
        <Row>
          <Col>
            <h3>Democrat Sheila Jackson Lee</h3>
            <TweetEmbed id="1012468551213608961" />
          </Col>
          <Col>
            <h3>Republican Ava Pate</h3>
            <TweetEmbed id="1012658894408175616" />
          </Col>
        </Row>
        <p>State: {this.state.state}</p>
        <p>Positon: {this.state.position}</p>
        <p>Id: {this.state.id}</p>
      </Jumbotron>
    </Container>
    ]);
  }

}
