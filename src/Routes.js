import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './containers/Home';
import Registration from './containers/Registration';

export default () =>
  <Switch>
    <Route path="/" exact component={Registration} />
    <Route path="/registration" exact component={Registration} />
    <Route path="/registration/:id" exact component={Registration} />
  </Switch>;
