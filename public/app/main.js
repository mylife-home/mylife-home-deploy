'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

import injectTapEventPlugin from 'react-tap-event-plugin';

import 'semantic-ui-css/semantic.min.css';

//import { getAccounts, getGroups } from './actions/common';
//import { getOperations } from './actions/management';
import Application from './components/application';

//import store from './services/store-factory';

//Needed for onTouchTap
//Can go away when react 1.0 release
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

//store.dispatch(getAccounts());
//store.dispatch(getGroups());
//store.dispatch(getOperations());

ReactDOM.render(
  <Application/>,
  document.getElementById('content')
);