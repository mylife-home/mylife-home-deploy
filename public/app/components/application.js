'use strict';

import React from 'react';
import { Sidebar, Segment, Header, Image } from 'semantic-ui-react';
import { StoreProvider } from './utils';

import Menu from '../containers/menu-container';

const Application = () => (
  <StoreProvider>
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Segment fixed='top' textAlign='center' as='header' style={{ margin: 0 }}>
        <Header as='h1'>
          <Image size='small' src='/images/favicon.ico' style={{ marginRight: '1.5em' }} />
          Mylife Home Deploy
        </Header>
      </Segment>

      <Sidebar.Pushable as={Segment} style={{ flex: 1, margin: 0 }}>
        <Sidebar animation='push' width='wide' visible>
          <Menu />
        </Sidebar>
        <Sidebar.Pusher>
          <Segment basic>
            <Header as='h3'>Application Content</Header>
          </Segment>
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    </div>
  </StoreProvider>
);

export default Application;
