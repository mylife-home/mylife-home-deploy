'use strict';

import { connect } from 'react-redux';

import Menu                         from '../components/menu';
import { getPinnedRecipes }         from '../selectors/recipes';
import { getRuns }                  from '../selectors/runs';
import { unpinRecipe, startRecipe } from '../actions/recipes';

const mapStateToProps = state => ({
  recipes : getPinnedRecipes(state),
  runs    : getRuns(state)
});

const mapDispatchToProps = dispatch => ({
  onRecipeUnpin : recipe => dispatch(unpinRecipe({ name : recipe })),
  onRecipeStart : recipe => dispatch(startRecipe({ name : recipe }))
});

const MenuContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Menu);

export default MenuContainer;