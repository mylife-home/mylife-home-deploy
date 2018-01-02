'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { Menu, Icon } from 'semantic-ui-react';

const AppMenu = ({ recipes, runs }) => (
  <Menu icon='labeled' size='tiny' vertical fluid fixed='left'>
    <Menu.Item name='recipes'>
      <Menu.Header align='left' style={{ color: 'rgba(0, 0, 0, 0.5)' }}>
        <Icon name='file text outline' />
        Recipes
      </Menu.Header>
      <Menu.Menu>
        {recipes.map(recipe =>
          <Menu.Item key={recipe.name} name={recipe.name}>
            <Menu.Header align='left' style={{ marginLeft: '1em' }}>
              <Icon name='file text outline' />
              {recipe.name}
            </Menu.Header>
          </Menu.Item>
        )}
      </Menu.Menu>
    </Menu.Item>
    <Menu.Item name='flows'>
      <Menu.Header align='left' style={{ color: 'rgba(0, 0, 0, 0.5)' }}>
        <Icon name='tasks' />
        Runs
      </Menu.Header>
      <Menu.Menu>
        {runs.map(run =>
          <Menu.Item key={run.id} name={run.id}>
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
    <Menu.Item name='files'>
      <Menu.Header align='left' style={{ color: 'rgba(0, 0, 0, 0.5)' }}>
        <Icon name='folder outline' />
        Files
      </Menu.Header>
    </Menu.Item>
  </Menu>
);

AppMenu.propTypes = {
  recipes : PropTypes.object,
  runs    : PropTypes.object,
};

export default AppMenu;
