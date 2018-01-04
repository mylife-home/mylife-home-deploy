'use strict';

import React          from 'react';
import PropTypes      from 'prop-types';
import LayoutContent  from './layout-content';
import { Button }     from 'semantic-ui-react';

const RecipeList = ({ recipe, onRecipePin, onRecipeUnpin, onRecipeStart, onRecipeDelete }) => (
  <LayoutContent icon='file text outline' title={`Recipe ${recipe.name}`}>
    <div>
      <Button content='pin'    onClick={() => onRecipePin(recipe.name)} />
      <Button content='unpin'  onClick={() => onRecipeUnpin(recipe.name)} />
      <Button content='start'  onClick={() => onRecipeStart(recipe.name)} />
      <Button content='delete' onClick={() => onRecipeDelete(recipe.name)} />
    </div>
  </LayoutContent>
);

RecipeList.propTypes = {
  recipe         : PropTypes.object.isRequired,
  onRecipePin    : PropTypes.func.isRequired,
  onRecipeUnpin  : PropTypes.func.isRequired,
  onRecipeStart  : PropTypes.func.isRequired,
  onRecipeDelete : PropTypes.func.isRequired,
};

export default RecipeList;
