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

export const getRecipe = (state, value) => state.recipes.all.get(value);