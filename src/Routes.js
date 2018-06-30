import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './containers/Home';
import Registration from './containers/Registration';
import Race from './containers/Race';

export default () =>
  <Switch>
    <Route path="/" exact component={Registration} />
    <Route path="/registration" exact component={Registration} />
    <Route path="/registration/:id" exact component={Registration} />
    <Route path="/race/:state/:position/:id" exact component={Race} />
  </Switch>;
