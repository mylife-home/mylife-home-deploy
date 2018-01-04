'use strict';

import { applyMiddleware, createStore } from 'redux';
import thunk                            from 'redux-thunk';
import { createLogger }                 from 'redux-logger';

import ioService       from './io-service';
import downloadService from './download-service';
import reducer         from '../reducers';

const store = createStore(
  reducer,
  applyMiddleware(ioService, downloadService, thunk, createLogger())
);

export default store;
