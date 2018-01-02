'use strict';

import { actionTypes } from '../constants';

export default function(state = null, action) {
  if(action.error) {
    return action.payload;
  }

  if(action.type === actionTypes.ERROR_CLEAR) {
    return null;
  }

  return state;
}
