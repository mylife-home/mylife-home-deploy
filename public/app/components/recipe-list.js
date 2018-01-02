'use strict';

import React          from 'react';
import PropTypes      from 'prop-types';
import { Menu, Icon } from 'semantic-ui-react';

const RecipeList = ({ recipes }) => (
  <div>recipe-list</div>
);

RecipeList.propTypes = {
  recipes        : PropTypes.object.isRequired,
  onRecipePin    : PropTypes.func.isRequired,
  onRecipeUnpin  : PropTypes.func.isRequired,
  onRecipeStart  : PropTypes.func.isRequired,
  onRecipeDelete : PropTypes.func.isRequired,
};

export default RecipeList;
