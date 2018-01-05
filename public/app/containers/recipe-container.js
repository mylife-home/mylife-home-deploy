'use strict';

import { connect } from 'react-redux';

import Recipe                                                            from '../components/recipe';
import { getRecipe, getRecipePinned }                                    from '../selectors/recipes';
import { pinRecipe, unpinRecipe, startRecipe, deleteRecipe, copyRecipe } from '../actions/recipes';

const mapStateToProps = (state, { recipe }) => ({
  recipe : getRecipe(state, recipe),
  pinned : getRecipePinned(state, recipe)
});

const mapDispatchToProps = dispatch => ({
  onRecipePin    :  recipe           => dispatch(pinRecipe({ name : recipe })),
  onRecipeUnpin  :  recipe           => dispatch(unpinRecipe({ name : recipe })),
  onRecipeStart  :  recipe           => dispatch(startRecipe({ name : recipe })),
  onRecipeDelete :  recipe           => dispatch(deleteRecipe({ name : recipe })),
  onRecipeCopy   : (recipe, newName) => dispatch(copyRecipe({ source : recipe, destination : newName }))
});

const RecipeContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Recipe);

export default RecipeContainer;