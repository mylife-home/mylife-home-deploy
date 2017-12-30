'use strict';

import { handleActions } from 'redux-actions';
import { actionTypes } from '../constants/index';

export default handleActions({

  [actionTypes.ONLINE_SET] : {
    next : (state, action) => action.payload
  },

}, false);
