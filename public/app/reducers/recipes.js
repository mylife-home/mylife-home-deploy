'use strict';

import { handleActions } from 'redux-actions';
import { actionTypes } from '../constants/index';
import Immutable from 'immutable';

export default handleActions({

  [actionTypes.RECIPE_SET] : {
    next : (state, action) => {
      const recipe = action.payload;
      return state.set(recipe.name, recipe);
    }
  },

  [actionTypes.RECIPE_DELETED] : {
    next : (state, action) => {
      const { name } = action.payload;
      return state.delete(name);
    }
  },

}, Immutable.Map());
