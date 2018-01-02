'use strict';

import React from 'react';
import { Sidebar, Segment, Header, Image } from 'semantic-ui-react';

import Menu from '../containers/menu-container';

class Application extends React.Component {

  constructor(props) {
    super(props);
    this.state = { active: null };
  }

  render() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Segment fixed='top' textAlign='center' as='header' style={{ margin: 0 }}>
          <Header as='h1'>
            <Image size='small' src='/images/favicon.ico' style={{ marginRight: '1.5em' }} />
            Mylife Home Deploy
          </Header>
        </Segment>

        <Sidebar.Pushable as={Segment} style={{ flex: 1, margin: 0 }}>
          <Sidebar animation='push' width='wide' visible>
            <Menu
              onRecipeListClick={() => console.log('recipe-list')} onRecipeClick={recipe => console.log('recipe', recipe)}
              onRunListClick={() => console.log('run-list')} onRunClick={run => console.log('run', run)}
              onFileListClick={() => console.log('file-list')}
            />
          </Sidebar>
          <Sidebar.Pusher>
            <Segment basic>
              <Header as='h3'>Application Content</Header>
            </Segment>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </div>
    );
  }
}

export default Application;