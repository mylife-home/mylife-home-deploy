'use strict';

import { connect } from 'react-redux';

import Menu                                                  from '../components/menu';
import { getRecipesWithPin }                                 from '../selectors/recipes';
import { pinRecipe, unpinRecipe, startRecipe, deleteRecipe } from '../actions/recipes';

const mapStateToProps = state => ({
  recipes : getRecipesWithPin(state)
});

const mapDispatchToProps = dispatch => ({
  onRecipePin    : recipe => dispatch(pinRecipe({ name : recipe })),
  onRecipeUnpin  : recipe => dispatch(unpinRecipe({ name : recipe })),
  onRecipeStart  : recipe => dispatch(startRecipe({ name : recipe })),
  onRecipeDelete : recipe => dispatch(deleteRecipe({ name : recipe }))
});

const MenuContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Menu);

export default MenuContainer;