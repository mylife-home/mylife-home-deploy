'use strict';

import React          from 'react';
import PropTypes      from 'prop-types';
import { Menu, Icon } from 'semantic-ui-react';

const AppMenu = ({ recipes, runs, onRecipeListClick, onRecipeClick, onRunListClick, onRunClick, onFileListClick }) => (
  <Menu icon='labeled' size='small' vertical fluid fixed='left'>
    <Menu.Item>
      <Menu.Menu>
        <Menu.Item onClick={onRecipeListClick}>
          <Menu.Header align='left' style={{ fontSize: '1.2em' }}>
            <Icon name='file text outline' />
            Recipes
          </Menu.Header>
        </Menu.Item>
        {recipes.map(recipe =>
          <Menu.Item key={recipe.name} name={recipe.name} onClick={() => onRecipeClick(recipe.name)}>
            <Menu.Header align='left' style={{ marginLeft: '1em' }}>
              <Icon name='file text outline' />
              {recipe.name}
            </Menu.Header>
          </Menu.Item>
        )}
      </Menu.Menu>
    </Menu.Item>
    <Menu.Item>
      <Menu.Menu>
        <Menu.Item onClick={onRunListClick}>
          <Menu.Header align='left' style={{ fontSize: '1.2em' }}>
            <Icon name='tasks' />
            Runs
          </Menu.Header>
        </Menu.Item>
        {runs.map(run =>
          <Menu.Item key={run.id} name={run.id} onClick={() => onRunClick(run.id)}>
            <Menu.Header align='left' style={{ marginLeft: '1em' }}>
              <Icon name='play' /> { /* running */ }
              <Icon name='checkmark' /> { /* success */ }
              <Icon name='remove' /> { /* error */ }
              {run.id}
            </Menu.Header>
          </Menu.Item>
        )}
      </Menu.Menu>
    </Menu.Item>
    <Menu.Item>
      <Menu.Menu>
        <Menu.Item onClick={onFileListClick}>
          <Menu.Header align='left' style={{ fontSize: '1.2em' }}>
            <Icon name='folder outline' />
            Files
          </Menu.Header>
        </Menu.Item>
      </Menu.Menu>
    </Menu.Item>
  </Menu>
);

AppMenu.propTypes = {
  recipes           : PropTypes.object.isRequired,
  runs              : PropTypes.object.isRequired,
  onRecipeListClick : PropTypes.func.isRequired,
  onRecipeClick     : PropTypes.func.isRequired,
  onRunListClick    : PropTypes.func.isRequired,
  onRunClick        : PropTypes.func.isRequired,
  onFileListClick   : PropTypes.func.isRequired,
};

export default AppMenu;
