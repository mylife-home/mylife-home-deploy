'use strict';

import React                                from 'react';
import PropTypes                            from 'prop-types';
import { Button, Popup, Icon, Item, Table } from 'semantic-ui-react';
import LayoutContent                        from './layout-content';
import confirm                              from './confirm-dialog';
import input                                from './input-dialog';
import update                               from './recipe-update';

const makeFirstUpper = s => s.charAt(0).toUpperCase() + s.slice(1);

const RecipeList = ({ recipe, pinned, onRecipePin, onRecipeUnpin, onRecipeStart, onRecipeDelete, onRecipeCopy, onRecipeUpdate, recipeNames, tasks }) => (
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
          <Button basic icon='write' onClick={() => update({ recipe, recipeNames, tasks, proceed : value => onRecipeUpdate(value) })} />
        } />
        <Popup content='Delete recipe' trigger={
          <Button basic icon='trash outline' onClick={() => confirm({ content : `Do you want to delete recipe '${recipe.name}' ?`, proceed : () => onRecipeDelete(recipe.name) })} />
        } />
      </Button.Group>
      <Item.Group>

        <Item>
          <Item.Content>
            <Item.Header>
              {recipe.description}
            </Item.Header>
          </Item.Content>
        </Item>

        {recipe.steps.map((step, index) =>  {
          const taskMeta = (step.type === 'task') && tasks.find(t => t.name === step.name);
          return (
            <Item key={index}>
              <Item.Content>
                <Table celled>

                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell width={1}>
                        {makeFirstUpper(step.type)}
                      </Table.HeaderCell>
                      <Table.HeaderCell width={1}>
                        {step.name}
                      </Table.HeaderCell>
                      <Table.HeaderCell width={2}>
                        {taskMeta && taskMeta.description}
                      </Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>

                  {taskMeta && taskMeta.parameters && (
                    <Table.Body>
                      {taskMeta.parameters.map(paramMeta => (
                        <Table.Row key={paramMeta.name}>
                          <Table.Cell width={1}>
                            {paramMeta.name}
                          </Table.Cell>
                          <Table.Cell width={1}>
                            {step.parameters && step.parameters[paramMeta.name]}
                          </Table.Cell>
                          <Table.Cell width={2}>
                            {paramMeta.description}
                          </Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  )}
                </Table>
              </Item.Content>
            </Item>
          );
        })}

      </Item.Group>
    </div>
  </LayoutContent>
);

RecipeList.propTypes = {
  recipe         : PropTypes.object.isRequired,
  pinned         : PropTypes.bool.isRequired,
  recipeNames    : PropTypes.object.isRequired,
  tasks          : PropTypes.object.isRequired,
  onRecipePin    : PropTypes.func.isRequired,
  onRecipeUnpin  : PropTypes.func.isRequired,
  onRecipeStart  : PropTypes.func.isRequired,
  onRecipeDelete : PropTypes.func.isRequired,
  onRecipeCopy   : PropTypes.func.isRequired,
  onRecipeUpdate : PropTypes.func.isRequired,
};

export default RecipeList;
