'use strict';

import React                               from 'react';
import { Sidebar, Segment, Header, Image } from 'semantic-ui-react';

import Menu       from '../containers/menu-container';
import RecipeList from '../containers/recipe-list-container';

class Application extends React.Component {

  constructor(props) {
    super(props);
    this.state = { type: null, value: null };
  }

  renderContent() {
    const { type, value } = this.state;
    switch(type) {

      case 'recipe-list':
        return (
          <RecipeList />
        );
    }

    return null;
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
              onRecipeListClick = {()     => this.setState({ type : 'recipe-list', value : null   }) }
              onRecipeClick     = {recipe => this.setState({ type : 'recipe',      value : recipe }) }
              onRunListClick    = {()     => this.setState({ type : 'run-list',    value : null   }) }
              onRunClick        = {run    => this.setState({ type : 'run',         value : run    }) }
              onFileListClick   = {()     => this.setState({ type : 'file-list',   value : null   }) }
            />
          </Sidebar>
          <Sidebar.Pusher>
            <Segment basic>
              {this.renderContent()}
            </Segment>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </div>
    );
  }
}

export default Application;
