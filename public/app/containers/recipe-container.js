'use strict';

import { connect } from 'react-redux';

import Recipe                                                from '../components/recipe';
import { getRecipe }                                         from '../selectors/recipes';
import { pinRecipe, unpinRecipe, startRecipe, deleteRecipe } from '../actions/recipes';

const mapStateToProps = (state, { recipe }) => ({
  recipe : getRecipe(state, recipe)
});

const mapDispatchToProps = dispatch => ({
  onRecipePin    : recipe => dispatch(pinRecipe({ name : recipe })),
  onRecipeUnpin  : recipe => dispatch(unpinRecipe({ name : recipe })),
  onRecipeStart  : recipe => dispatch(startRecipe({ name : recipe })),
  onRecipeDelete : recipe => dispatch(deleteRecipe({ name : recipe }))
});

const RecipeContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Recipe);

export default RecipeContainer;