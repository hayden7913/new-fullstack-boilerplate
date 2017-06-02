import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, IndexRoute, hashHistory} from 'react-router';
import { Provider } from 'react-redux';

import store from 'reduxFiles/store';
import App from 'components/hello-world/App'
import HomePage from 'components/hello-world/HomePage';
import './index.scss';


ReactDOM.render(
  <Provider store={ store }>
    <Router history={hashHistory}>
      <Route path="/app" component={App}/> 
      <Route path="/*" component ={HomePage}/> 
    </Router>
  </Provider>,
  document.getElementById('root')
);
