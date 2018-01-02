'use strict';

import { connect } from 'react-redux';

import Menu                 from '../components/menu';
import { getPinnedRecipes } from '../selectors/recipes';
import { getRuns }          from '../selectors/runs';

const mapStateToProps = state => ({
  recipes : getPinnedRecipes(state),
  runs    : getRuns(state)
});

const MenuContainer = connect(
  mapStateToProps
)(Menu);

export default MenuContainer;