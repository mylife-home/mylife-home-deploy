'use strict';

import { connect } from 'react-redux';

import Menu                 from '../components/menu';
import { getPinnedRecipes } from '../selectors/recipes';
import { getRuns }          from '../selectors/runs';
import { startRecipe }      from '../actions/recipes';

const mapStateToProps = state => ({
  recipes : getPinnedRecipes(state),
  runs    : getRuns(state)
});

const mapDispatchToProps = dispatch => ({
  onRecipeStart : recipe => dispatch(startRecipe({ name : recipe }))
});

const MenuContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Menu);

export default MenuContainer;