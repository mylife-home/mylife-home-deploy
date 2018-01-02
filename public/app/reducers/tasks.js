'use strict';

import { handleActions } from 'redux-actions';
import { actionTypes } from '../constants';
import Immutable from 'immutable';

export default handleActions({

  [actionTypes.ONLINE_SET] : {
    next : (state, action) => {
      if(action.payload) { return state; }
      // disconnection
      return state.clear();
    }
  },

  [actionTypes.TASK_SET] : {
    next : (state, action) => {
      const task = action.payload;
      return state.set(task.name, task);
    }
  },

}, Immutable.Map());
