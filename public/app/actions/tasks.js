'use strict';

import { createAction } from 'redux-actions';
import { actionTypes }  from '../constants';

export const ioTaskSet = createAction(actionTypes.TASK_SET);
