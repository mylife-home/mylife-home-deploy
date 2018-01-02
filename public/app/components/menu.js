'use strict';

import React from 'react';
import { Menu, Icon } from 'semantic-ui-react';

const AppMenu = () => (
  <Menu icon='labeled' size='tiny' vertical fluid fixed='left'>
    <Menu.Item name='recipes'>
      <Menu.Header align='left' style={{ color: 'rgba(0, 0, 0, 0.5)' }}>
        <Icon name='file text outline' />
        Recipes
      </Menu.Header>
      <Menu.Menu>
        <Menu.Item name='pinned1'>
          <Menu.Header align='left' style={{ marginLeft: '1em' }}>
            <Icon name='file text outline' />
            build-all
          </Menu.Header>
        </Menu.Item>
        <Menu.Item name='pinned2' style={{ marginLeft: '1em' }}>
          <Menu.Header align='left'>
            <Icon name='file text outline' />
            install-rpi2-home-epanel1
          </Menu.Header>
        </Menu.Item>
        <Menu.Item name='pinned3' style={{ marginLeft: '1em' }}>
          <Menu.Header align='left'>
            <Icon name='file text outline' />
            install-rpi2-home-garden2
          </Menu.Header>
        </Menu.Item>
      </Menu.Menu>
    </Menu.Item>
    <Menu.Item name='flows'>
      <Menu.Header align='left' style={{ color: 'rgba(0, 0, 0, 0.5)' }}>
        <Icon name='tasks' />
        Flows
      </Menu.Header>
      <Menu.Menu>
        <Menu.Item name='flow1'>
          <Menu.Header align='left' style={{ marginLeft: '1em' }}>
            <Icon name='play' />
            #1 build-all
          </Menu.Header>
        </Menu.Item>
        <Menu.Item name='flow2'>
          <Menu.Header align='left' style={{ marginLeft: '1em' }}>
            <Icon name='checkmark' />
            #2 build-all
          </Menu.Header>
        </Menu.Item>
        <Menu.Item name='flow3'>
          <Menu.Header align='left' style={{ marginLeft: '1em' }}>
            <Icon name='remove' />
            #3 build-all
          </Menu.Header>
        </Menu.Item>
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

export default AppMenu;
