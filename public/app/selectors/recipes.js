'use strict';

export const getAllRecipes = state => state.recipes.all
  .valueSeq()
  .sortBy(recipe => recipe.name);

export const getPinnedRecipes = state => state.recipes.all
  .valueSeq()
  .filter(recipe => state.recipes.pinned.has(recipe.name))
  .sortBy(recipe => recipe.name);

export const getRecipesWithPin = state => state.recipes.all
  .valueSeq()
  .sortBy(recipe => recipe.name)
  .map(recipe => ({ recipe, pinned : state.recipes.pinned.has(recipe.name) }));

export const getRecipeNames = state => state.recipes.all.keySeq();

export const getRecipe = (state, value) => state.recipes.all.get(value);

export const getRecipePinned = (state, value) => state.recipes.pinned.has(value);