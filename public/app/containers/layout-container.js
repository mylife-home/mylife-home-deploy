'use strict';

import { connect } from 'react-redux';

import Layout             from '../components/layout';
import { getRecipeNames } from '../selectors/recipes';
import { getRunIds }      from '../selectors/runs';

const mapStateToProps = state => ({
  recipes : getRecipeNames(state),
  runs    : getRunIds(state)
});

const LayoutContainer = connect(
  mapStateToProps
)(Layout);

export default LayoutContainer;