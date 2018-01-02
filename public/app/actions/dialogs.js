'use strict';

import { createAction } from 'redux-actions';
import { actionTypes }  from '../constants';

export const clearError = createAction(actionTypes.ERROR_CLEAR);
export const clearInfo = createAction(actionTypes.INFO_CLEAR);
export const showInfo = createAction(actionTypes.INFO_SHOW);
