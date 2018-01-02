'use strict';

import { createAction } from 'redux-actions';
import { actionTypes }  from '../constants';

export const ioOnlineSet = createAction(actionTypes.ONLINE_SET);
