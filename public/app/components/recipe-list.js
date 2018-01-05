'use strict';

import React                         from 'react';
import PropTypes                     from 'prop-types';
import { Item, Icon, Button, Popup } from 'semantic-ui-react';
import LayoutContent                 from './layout-content';
import confirm                       from './confirm-dialog';
import input                         from './input-dialog';

const RecipeList = ({ recipes, onRecipeClick, onRecipePin, onRecipeUnpin, onRecipeStart, onRecipeDelete, onRecipeCreate }) => (
  <LayoutContent icon='file text outline' title='Recipes'>
    <div>
      <Button.Group basic>
        <Popup content='New recipe' trigger={
          <Button basic icon='add circle' onClick={() => input({ title : 'Enter new recipe name', proceed : onRecipeCreate })} />
        } />
      </Button.Group>
      <Item.Group>
        {recipes.map(({ recipe, pinned }) => (
          <Item key={recipe.name}>
            <Item.Image size='tiny'>
              <Icon name='file text outline' size='huge' />
            </Item.Image>
            <Item.Content>
              <Item.Header>
                <a onClick={() => onRecipeClick(recipe.name)}>{recipe.name}</a>
                <Button.Group basic style={{ marginLeft : '10px' }}>
                  <Popup content={`${pinned ? 'Unpin' : 'Pin'} recipe`} trigger={
                    <Button basic icon={<Icon name='pin' rotated={pinned ? 'clockwise' : null} />} onClick={() => (pinned ? onRecipeUnpin : onRecipePin)(recipe.name)} />
                  } />
                  <Popup content='Start recipe' trigger={
                    <Button basic icon='play' onClick={() => onRecipeStart(recipe.name)} />
                  } />
                  <Popup content='Delete recipe' trigger={
                    <Button basic icon='trash outline' onClick={() => confirm({ content : `Do you want to delete recipe '${recipe.name}' ?`, proceed : () => onRecipeDelete(recipe.name) })} />
                  } />
                </Button.Group>
              </Item.Header>
              <Item.Description>
                {recipe.description}
              </Item.Description>
            </Item.Content>
          </Item>
        ))}
      </Item.Group>
    </div>
  </LayoutContent>
);

RecipeList.propTypes = {
  recipes        : PropTypes.object.isRequired,
  onRecipeClick  : PropTypes.func.isRequired,
  onRecipePin    : PropTypes.func.isRequired,
  onRecipeUnpin  : PropTypes.func.isRequired,
  onRecipeStart  : PropTypes.func.isRequired,
  onRecipeDelete : PropTypes.func.isRequired,
  onRecipeCreate : PropTypes.func.isRequired,
};

export default RecipeList;
