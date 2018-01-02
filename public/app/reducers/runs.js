'use strict';

import { handleActions } from 'redux-actions';
import { actionTypes } from '../constants';
import Immutable from 'immutable';

export default handleActions({

  [actionTypes.RUN_SET] : {
    next : (state, action) => {
      const run = action.payload;
      // keep logs
      return state.update(run.id, oldRun => ({
        logs : oldRun && oldRun.logs || Immutable.List(),
        ...run
      }));
    }
  },

  [actionTypes.RUN_DELETED] : {
    next : (state, action) => {
      const { id } = action.payload;
      return state.delete(id);
    }
  },

  [actionTypes.RUN_LOG] : {
    next : (state, action) => {
      const { id, log } = action.payload;
      return state.update(id, run => ({ ...run, logs : run.logs.push(log) }));
    }
  },

}, Immutable.Map());
