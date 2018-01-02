'use strict';

import { handleActions } from 'redux-actions';
import { actionTypes } from '../constants';
import Immutable from 'immutable';

export default handleActions({

  [actionTypes.ONLINE_SET] : {
    next : (state, action) => {
      if(action.payload) { return state; }
      // disconnection
      return {
        ...state,
        all    : state.all.clear(),
        pinned : state.pinned.clear()
      };
    }
  },

  [actionTypes.RECIPE_SET] : {
    next : (state, action) => {
      const recipe = action.payload;
      return {
        ...state,
        all : state.all.set(recipe.name, recipe)
      };
    }
  },

  [actionTypes.RECIPE_DELETED] : {
    next : (state, action) => {
      const { name } = action.payload;
      return {
        ...state,
        all    : state.all.delete(name),
        pinned : state.pinned.delete(name)
      };
    }
  },

  [actionTypes.RECIPE_PINNED] : {
    next : (state, action) => {
      const { name } = action.payload;
      return {
        ...state,
        pinned : state.pinned.add(name)
      };
    }
  },

  [actionTypes.RECIPE_UNPINNED] : {
    next : (state, action) => {
      const { name } = action.payload;
      return {
        ...state,
        pinned : state.pinned.delete(name)
      };
    }
  },

}, {
  all    : Immutable.Map(),
  pinned : Immutable.Set()
});
