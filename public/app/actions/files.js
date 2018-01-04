'use strict';

import { createAction } from 'redux-actions';
import { actionTypes }  from '../constants';

export const ioFileSet      = createAction(actionTypes.FILE_SET);
export const ioFileDeleted  = createAction(actionTypes.FILE_DELETED);

export const downloadFile   = createAction(actionTypes.FILE_DOWNLOAD);
export const deleteFile     = createAction(actionTypes.FILE_DELETE);
