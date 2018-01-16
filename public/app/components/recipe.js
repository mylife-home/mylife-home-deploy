'use strict';

import React                                                  from 'react';
import PropTypes                                              from 'prop-types';
import { Button, Popup, Icon, Item, Table, Accordion, Label } from 'semantic-ui-react';
import LayoutContent                                          from './layout-content';
import confirm                                                from './confirm-dialog';
import input                                                  from './input-dialog';
import update                                                 from './recipe-update';
import { makeFirstUpper }                                     from './tools';
import Immutable                                              from 'immutable';

class RecipeList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { expanded: new Immutable.Set() };
  }

  expandAll() {
    this.setState({ expanded : this.state.expanded.withMutations(set => {
      for(let i=0; i<this.props.recipe.steps.length; ++i) {
        set.add(i);
      }
    })});
  }

  collaspeAll() {
    this.setState({ expanded : this.state.expanded.clear() });
  }

  invertStep(index) {
    const old = this.state.expanded;
    this.setState({ expanded : old.has(index) ? old.delete(index) : old.add(index) });
  }

  renderStepTable(step, taskMeta) {
    return (
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
    );
  }

  renderStep(step, index) {
    const { tasks } = this.props;
    const expanded = this.state.expanded.has(index);
    const taskMeta = (step.type === 'task') && tasks.find(t => t.name === step.name);

    const content = expanded ? '' : (
      <Popup wide='very' content={
        this.renderStepTable(step, taskMeta)
      } trigger={
        <Label basic size='large'>
          <Icon name={step.type === 'recipe' ? 'file text outline' : 'settings'} />
          {step.name}
          {taskMeta && '(' + taskMeta.parameters.map(paramMeta => `${paramMeta.name}: '${step.parameters && step.parameters[paramMeta.name] || '<not set>'}'`).join(', ') + ')'}
        </Label>
      } />
    );

    return (
      <div key={index}>
        <Accordion.Title active={expanded} onClick={() => this.invertStep(index)} content={content} />
        <Accordion.Content active={expanded}>
          {this.renderStepTable(step, taskMeta)}
        </Accordion.Content>
      </div>
    );
  }

  render() {
    const { recipe, pinned, onRecipePin, onRecipeUnpin, onRecipeStart, onRecipeDelete, onRecipeCopy, onRecipeUpdate, recipeNames, tasks } = this.props;
    return (
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
          <Button.Group basic style={{ marginLeft : 10 }}>
            <Popup content='Expand all' trigger={
              <Button basic icon='expand' onClick={() => this.expandAll()} />
            } />
            <Popup content='Collaspe all' trigger={
              <Button basic icon='compress' onClick={() => this.collaspeAll()} />
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

            <Item>
              <Item.Content>
                <Accordion fluid exclusive={false}>
                  {recipe.steps.map((step, index) => this.renderStep(step, index))}
                </Accordion>
              </Item.Content>
            </Item>

          </Item.Group>
        </div>
      </LayoutContent>
    );
  }
}

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
