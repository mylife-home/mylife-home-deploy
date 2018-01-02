'use strict';

import React          from 'react';
import PropTypes      from 'prop-types';
import { Button } from 'semantic-ui-react';

const RecipeList = ({ recipe, onRecipePin, onRecipeUnpin, onRecipeStart, onRecipeDelete }) => (
  <div>
    recipe {recipe.name}
    <Button content='pin'    onClick={() => onRecipePin(recipe.name)} />
    <Button content='unpin'  onClick={() => onRecipeUnpin(recipe.name)} />
    <Button content='start'  onClick={() => onRecipeStart(recipe.name)} />
    <Button content='delete' onClick={() => onRecipeDelete(recipe.name)} />
  </div>
);

RecipeList.propTypes = {
  recipe         : PropTypes.object.isRequired,
  onRecipePin    : PropTypes.func.isRequired,
  onRecipeUnpin  : PropTypes.func.isRequired,
  onRecipeStart  : PropTypes.func.isRequired,
  onRecipeDelete : PropTypes.func.isRequired,
};

export default RecipeList;
