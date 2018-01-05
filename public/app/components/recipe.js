'use strict';

import React          from 'react';
import PropTypes      from 'prop-types';
import { Button }     from 'semantic-ui-react';
import LayoutContent  from './layout-content';
import confirm        from './confirm-dialog';
import input          from './input-dialog';

const RecipeList = ({ recipe, onRecipePin, onRecipeUnpin, onRecipeStart, onRecipeDelete, onRecipeCopy }) => (
  <LayoutContent icon='file text outline' title={`Recipe ${recipe.name}`}>
    <div>
      <Button content='pin'    onClick={() => onRecipePin(recipe.name)} />
      <Button content='unpin'  onClick={() => onRecipeUnpin(recipe.name)} />
      <Button content='start'  onClick={() => onRecipeStart(recipe.name)} />
      <Button content='delete' onClick={() => confirm({ content : `Do you want to delete recipe '${recipe.name}' ?`, proceed : () => onRecipeDelete(recipe.name) })} />
      <Button content='copy'   onClick={() => input({ title : 'Enter new recipe name', proceed : value => onRecipeCopy(recipe.name, value) })} />
    </div>
  </LayoutContent>
);

RecipeList.propTypes = {
  recipe         : PropTypes.object.isRequired,
  onRecipePin    : PropTypes.func.isRequired,
  onRecipeUnpin  : PropTypes.func.isRequired,
  onRecipeStart  : PropTypes.func.isRequired,
  onRecipeDelete : PropTypes.func.isRequired,
  onRecipeCopy   : PropTypes.func.isRequired,
};

export default RecipeList;
