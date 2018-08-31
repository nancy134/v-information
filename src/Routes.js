import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './containers/Home';
import Registration from './containers/Registration';
import House from './containers/House';
import Voting from './containers/Voting';

export default () =>
  <Switch>
    <Route path="/" exact component={Registration} />
    <Route path="/home" exact component={Home} />
    <Route path="/registration" exact component={Registration} />
    <Route path="/registration/:id" exact component={Registration} />
    <Route path="/house" exact component={House} />
    <Route path="/voting" exact component={Voting} />
  </Switch>;
