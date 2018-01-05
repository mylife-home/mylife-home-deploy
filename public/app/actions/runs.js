'use strict';

import { createAction } from 'redux-actions';
import { actionTypes }  from '../constants';

export const downloadRunLogs = createAction(actionTypes.RUN_DOWNLOAD_LOGS);

export const ioRunSet        = createAction(actionTypes.RUN_SET);
export const ioRunLog        = createAction(actionTypes.RUN_LOG);
export const ioRunDeleted    = createAction(actionTypes.RUN_DELETED);

