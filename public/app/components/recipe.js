'use strict';

import React                         from 'react';
import PropTypes                     from 'prop-types';
import { Button, Popup, Icon, Item } from 'semantic-ui-react';
import LayoutContent                 from './layout-content';
import confirm                       from './confirm-dialog';
import input                         from './input-dialog';
import update                        from './recipe-update';

const RecipeList = ({ recipe, pinned, onRecipePin, onRecipeUnpin, onRecipeStart, onRecipeDelete, onRecipeCopy, onRecipeUpdate }) => (
  <LayoutContent icon='file text outline' title={`Recipe ${recipe.name}`}>
    <div>
      <Button.Group basic>
        <Popup content={`${pinned ? 'Unpin' : 'Pin'} recipe`} trigger={
          <Button basic icon={<Icon name='pin' rotated={pinned ? 'clockwise' : null} />} onClick={() => (pinned ? onRecipeUnpin : onRecipePin)(recipe.name)} />
        } />
        <Popup content='Start recipe' trigger={
          <Button basic icon='play' onClick={() => onRecipeStart(recipe.name)} />
        } />
        <Popup content='Copy recipe' trigger={
          <Button basic icon='copy' onClick={() => input({ title : 'Enter new recipe name', proceed : value => onRecipeCopy(recipe.name, value) })} />
        } />
        <Popup content='Update recipe' trigger={
          <Button basic icon='write' onClick={() => update({ recipe, proceed : value => onRecipeUpdate(value) })} />
        } />
        <Popup content='Delete recipe' trigger={
          <Button basic icon='trash outline' onClick={() => confirm({ content : `Do you want to delete recipe '${recipe.name}' ?`, proceed : () => onRecipeDelete(recipe.name) })} />
        } />
      </Button.Group>
      <Item.Group divided>

        <Item>
          <Item.Content>
            <Item.Header>
              {recipe.description}
            </Item.Header>
          </Item.Content>
        </Item>

        {recipe.steps.map((step, index) => (
          <Item key={index}>
            <Item.Content>
              <Item.Header>
                Step
              </Item.Header>
            </Item.Content>
          </Item>
        ))}

      </Item.Group>
    </div>
  </LayoutContent>
);

RecipeList.propTypes = {
  recipe         : PropTypes.object.isRequired,
  pinned         : PropTypes.bool.isRequired,
  onRecipePin    : PropTypes.func.isRequired,
  onRecipeUnpin  : PropTypes.func.isRequired,
  onRecipeStart  : PropTypes.func.isRequired,
  onRecipeDelete : PropTypes.func.isRequired,
  onRecipeCopy   : PropTypes.func.isRequired,
  onRecipeUpdate : PropTypes.func.isRequired,
};

export default RecipeList;
