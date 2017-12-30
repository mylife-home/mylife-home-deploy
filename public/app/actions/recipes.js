'use strict';

import { createAction } from 'redux-actions';
import { actionTypes } from '../constants';

export const createRecipe = createAction(actionTypes.RECIPE_CREATE);
export const deleteRecipe = createAction(actionTypes.RECIPE_DELETE);
export const startRecipe  = createAction(actionTypes.RECIPE_START);

export const ioRecipeSet     = createAction(actionTypes.RECIPE_SET);
export const ioRecipeDeleted = createAction(actionTypes.RECIPE_DELETED);
