'use strict';

import { connect } from 'react-redux';

import Recipe                                                                          from '../components/recipe';
import { getRecipe, getRecipePinned, getRecipeNames }                                  from '../selectors/recipes';
import { pinRecipe, unpinRecipe, startRecipe, deleteRecipe, copyRecipe, updateRecipe } from '../actions/recipes';
import { getTasks }                                                                    from '../selectors/tasks';

const mapStateToProps = (state, { recipe }) => ({
  recipe      : getRecipe(state, recipe),
  pinned      : getRecipePinned(state, recipe),
  recipeNames : getRecipeNames(state),
  tasks       : getTasks(state),
});

const mapDispatchToProps = dispatch => ({
  onRecipePin    :  recipe           => dispatch(pinRecipe({ name : recipe })),
  onRecipeUnpin  :  recipe           => dispatch(unpinRecipe({ name : recipe })),
  onRecipeStart  :  recipe           => dispatch(startRecipe({ name : recipe })),
  onRecipeDelete :  recipe           => dispatch(deleteRecipe({ name : recipe })),
  onRecipeCopy   : (recipe, newName) => dispatch(copyRecipe({ source : recipe, destination : newName })),
  onRecipeUpdate :  recipe           => dispatch(updateRecipe(recipe)),
});

const RecipeContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Recipe);

export default RecipeContainer;