'use strict';

import io                                                                 from 'socket.io-client';
import { actionTypes }                                                    from '../constants';
import { ioOnlineSet }                                                    from '../actions/online';
import { ioTaskSet }                                                      from '../actions/tasks';
import { ioRecipeSet, ioRecipeDeleted, ioRecipePinned, ioRecipeUnpinned } from '../actions/recipes';
import { ioRunSet, ioRunLog, ioRunDeleted }                               from '../actions/runs';
import { ioFileSet, ioFileDeleted }                                       from '../actions/files';

const eventToActionMap = {};
const actionToEventMap = {};

// CONFIG

registerEventToAction('task:created', ioTaskSet);

registerEventToAction('recipe:created',  ioRecipeSet);
registerEventToAction('recipe:updated',  ioRecipeSet);
registerEventToAction('recipe:deleted',  ioRecipeDeleted);
registerEventToAction('recipe:pinned',   ioRecipePinned);
registerEventToAction('recipe:unpinned', ioRecipeUnpinned);

registerActionToEvent(actionTypes.RECIPE_CREATE, 'recipe:create');
registerActionToEvent(actionTypes.RECIPE_DELETE, 'recipe:delete');
registerActionToEvent(actionTypes.RECIPE_START,  'recipe:start');
registerActionToEvent(actionTypes.RECIPE_PIN,    'recipe:pin');
registerActionToEvent(actionTypes.RECIPE_UNPIN,  'recipe:unpin');

registerEventToAction('run:created', ioRunSet);
registerEventToAction('run:begin',   ioRunSet);
registerEventToAction('run:end',     ioRunSet);
registerEventToAction('run:deleted', ioRunDeleted);
registerEventToAction('run:log',     ioRunLog);

registerEventToAction('file:created', ioFileSet);
registerEventToAction('file:deleted', ioFileDeleted);

// ---

function registerEventToAction(eventName, action) {
  eventToActionMap[eventName] = action;
}

function registerActionToEvent(actionType, eventName) {
  actionToEventMap[actionType] = eventName;
}

export default (/*store*/) => next => {

  const socket = io();

  socket.on('connect',    () => next(ioOnlineSet(true)));
  socket.on('disconnect', () => next(ioOnlineSet(false)));

  for(const [eventName, action] of Object.entries(eventToActionMap)) {
    socket.on(eventName, payload => next(action(payload)));
  }

  return action => {
    next(action);

    const eventName = actionToEventMap[action.type];
    if(!eventName) {
      return;
    }

    socket.emit(eventName, action.payload);
  };
};

