import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './containers/Home';
import Registration from './containers/Registration';
import House from './containers/House';
import Senate from './containers/Senate';
import Voting from './containers/Voting';
import Voter from './containers/Voter';
export default () =>
  <Switch>
    <Route path="/" exact component={Voter} />
    <Route path="/home" exact component={Home} />
    <Route path="/registration" exact component={Registration} />
    <Route path="/registration/:id" exact component={Registration} />
    <Route path="/house" exact component={House} />
    <Route path="/senate" exact component={Senate} />
    <Route path="/voter" exact component={Voter} />
  </Switch>;
