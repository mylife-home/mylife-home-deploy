'use strict';

import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';

import ioService from './io-service';
import reducer from '../reducers/index';

const store = createStore(
  reducer,
  applyMiddleware(ioService, thunk, createLogger())
);

export default store;
