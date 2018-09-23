import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import 'bootstrap/dist/css/bootstrap.min.css';
import mixpanel from 'mixpanel-browser';
import MixpanelProvider from 'react-mixpanel';

mixpanel.init("87f6d2737557a1c9ef0e3ffe789a993d");

ReactDOM.render(
  <MixpanelProvider mixpanel={mixpanel}>
  <Router>
    <App />
  </Router>
  </MixpanelProvider>, 
  document.getElementById('root')
);
//registerServiceWorker();
