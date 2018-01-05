'use strict';

import { connect } from 'react-redux';

import RecipeList                                                       from '../components/recipe-list';
import { getRecipesWithPin }                                            from '../selectors/recipes';
import { pinRecipe, unpinRecipe, startRecipe, deleteRecipe, newRecipe } from '../actions/recipes';

const mapStateToProps = state => ({
  recipes : getRecipesWithPin(state)
});

const mapDispatchToProps = dispatch => ({
  onRecipePin    : recipe => dispatch(pinRecipe({ name : recipe })),
  onRecipeUnpin  : recipe => dispatch(unpinRecipe({ name : recipe })),
  onRecipeStart  : recipe => dispatch(startRecipe({ name : recipe })),
  onRecipeDelete : recipe => dispatch(deleteRecipe({ name : recipe })),
  onRecipeCreate : recipe => dispatch(newRecipe({ name : recipe }))
});

const RecipeListContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(RecipeList);

export default RecipeListContainer;