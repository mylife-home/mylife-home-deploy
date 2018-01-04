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

  [actionTypes.FILE_SET] : {
    next : (state, action) => {
      const file = action.payload;
      return state.set(file.name, file);
    }
  },

  [actionTypes.FILE_DELETED] : {
    next : (state, action) => {
      const { name } = action.payload;
      return state.delete(name);
    }
  },

}, Immutable.Map());
