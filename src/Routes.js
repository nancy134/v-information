import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Home from './containers/Home';
import Registration from './containers/Registration';
import House from './containers/House';
import Senate from './containers/Senate';
import Voting from './containers/Voting';
import Voter from './containers/Voter';
import Contact from './containers/Contact';
import Candidates from './containers/Candidates';
import State from './containers/State';

export default () =>
  <Switch>
    <Route exact path="/" render={() => (
      <Redirect to="/voter"/>
    )}/>
    <Route path="/home" exact component={Home} />
    <Route path="/registration" exact component={Registration} />
    <Route path="/registration/:id" exact component={Registration} />
    <Route path="/house" exact component={House} />
    <Route path="/senate" exact component={Senate} />
    <Route path="/voter" exact component={Voter} />
    <Route path="/state" exact component={State} />
    <Route path="/contact" exact component={Contact} />
    <Route path="/candidates" exact component={Candidates} />
  </Switch>;
