import React, { Component } from 'react';
import { Form, FormGroup, Label, Input, Button } from 'reactstrap';
import { Container, Jumbotron } from 'reactstrap';
import Contacts from '../actions/Contacts';
import { getJsonFromUrl } from '../utils.js';

export default class Contact extends Component {
  constructor(props){
    super(props)

    var results = getJsonFromUrl(props.location.search.substr(1));
    var name = null;
    var email = null;
    var message = null;
    if (results.name) name = results.name;
    if (results.email) email = results.email;
    if (results.message) message = results.message;

    this.state = {
      name: name,
      email: email,
      message: message
    }
  }
  componentDidMount(){
    if (this.state.name && this.state.email, this.state.message){
      Contacts.submit(this.state.name, this.state.email, this.state.message, (contact) => {
        console.log("contact: "+contact);
      });
    }
  }
  render() {
    if (this.state.name && this.state.email, this.state.message){
      return([
        <Container>
          <Jumbotron>
            <h3 className="text-center">Thank you for contacting us!</h3>
            <h3 className="text-center">We will be in touch shortly.</h3>
          </Jumbotron>
        </Container>
      ]);
    } else {
    return ([
      <Container>
      <Jumbotron>
      <h4>Please contact us if you have any questions or comments about this site:</h4>
      <Form>
        <FormGroup>
          <Label for="name">Name</Label>
          <Input type="text" name="name" id="name"/>
        </FormGroup>
        <FormGroup>
          <Label for="email">Email</Label>
          <Input type="email" name="email" id="email"/>
        </FormGroup>
        <FormGroup>
          <Label for="message">Message</Label>
          <Input type="textarea" name="message" id="message"/>
        </FormGroup>
        <Button>Send Message</Button>
      </Form>
      </Jumbotron>
      </Container>
    ]);
    }
  }

}
