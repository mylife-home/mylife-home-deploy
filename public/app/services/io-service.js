'use strict';

import io from 'socket.io-client';
import { actionTypes } from '../constants/index';
import { ioOnlineSet } from '../actions/online';
import { ioRecipeSet, ioRecipeDeleted } from '../actions/recipes';

const eventToActionMap = {};
const actionToEventMap = {};

// CONFIG

registerEventToAction('recipe:created', ioRecipeSet);
registerEventToAction('recipe:updated', ioRecipeSet);
registerEventToAction('recipe:deleted', ioRecipeDeleted);

registerActionToEvent(actionTypes.RECIPE_CREATE, 'recipe:create');
registerActionToEvent(actionTypes.RECIPE_DELETE, 'recipe:delete');
registerActionToEvent(actionTypes.RECIPE_START,  'recipe:start');

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

