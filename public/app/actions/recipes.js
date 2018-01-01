'use strict';

import { createAction } from 'redux-actions';
import { actionTypes } from '../constants';

export const createRecipe     = createAction(actionTypes.RECIPE_CREATE);
export const deleteRecipe     = createAction(actionTypes.RECIPE_DELETE);
export const startRecipe      = createAction(actionTypes.RECIPE_START);
export const pinRecipe        = createAction(actionTypes.RECIPE_PIN);
export const unpinRecipe      = createAction(actionTypes.RECIPE_UNPIN);

export const ioRecipeSet      = createAction(actionTypes.RECIPE_SET);
export const ioRecipeDeleted  = createAction(actionTypes.RECIPE_DELETED);
export const ioRecipePinned   = createAction(actionTypes.RECIPE_PINNED);
export const ioRecipeUnpinned = createAction(actionTypes.RECIPE_UNPINNED);
