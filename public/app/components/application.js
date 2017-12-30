'use strict';

import React from 'react';
import { Sidebar, Segment, Header, Image, Menu, Icon } from 'semantic-ui-react';

const Application = () => (
  <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
    <Segment fixed='top' textAlign='center' as='header' style={{ margin: 0 }}>
      <Header as='h1'>
        <Image size='small' src='/images/favicon.ico' style={{ marginRight: '1.5em' }} />
        Mylife Home Deploy
      </Header>
    </Segment>

    <Sidebar.Pushable as={Segment} style={{ flex: 1, margin: 0 }}>
      <Sidebar as={Menu} animation='push' width='wide' visible icon='labeled' size='tiny' vertical>
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
      </Sidebar>
      <Sidebar.Pusher>
        <Segment basic>
          <Header as='h3'>Application Content</Header>
        </Segment>
      </Sidebar.Pusher>
    </Sidebar.Pushable>
  </div>
);

export default Application;
