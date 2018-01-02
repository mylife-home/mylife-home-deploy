'use strict';

import React                                          from 'react';
import PropTypes                                      from 'prop-types';
import { Segment, Header, Item, Icon, Button, Popup } from 'semantic-ui-react';
import confirm                                        from './confirm-dialog';

const RecipeList = ({ recipes, onRecipeClick, onRecipePin, onRecipeUnpin, onRecipeStart, onRecipeDelete }) => (
  <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

    <Segment fixed='top' basic>
      <Header as='h2' icon='file text outline' content='Recipes' />
    </Segment>

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
                } />  {/* TODO: confirm */}
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
);

RecipeList.propTypes = {
  recipes        : PropTypes.object.isRequired,
  onRecipeClick  : PropTypes.func.isRequired,
  onRecipePin    : PropTypes.func.isRequired,
  onRecipeUnpin  : PropTypes.func.isRequired,
  onRecipeStart  : PropTypes.func.isRequired,
  onRecipeDelete : PropTypes.func.isRequired,
};

export default RecipeList;
