'use strict';

import React                               from 'react';
import { Sidebar, Segment, Header, Image } from 'semantic-ui-react';

import Menu       from '../containers/menu-container';
import RecipeList from '../containers/recipe-list-container';
import Recipe     from '../containers/recipe-container';

class Application extends React.Component {

  constructor(props) {
    super(props);
    this.state = { type: null, value: null };

    this.onRecipeListClick = ()     => this.setState({ type : 'recipe-list', value : null   });
    this.onRecipeClick     = recipe => this.setState({ type : 'recipe',      value : recipe });
    this.onRunListClick    = ()     => this.setState({ type : 'run-list',    value : null   });
    this.onRunClick        = run    => this.setState({ type : 'run',         value : run    });
    this.onFileListClick   = ()     => this.setState({ type : 'file-list',   value : null   });
  }

  renderContent() {
    const { type, value } = this.state;
    switch(type) {

      case 'recipe-list':
        return (<RecipeList onRecipeClick={this.onRecipeClick}/>);

      case 'recipe':
        return (<Recipe recipe={value}/>);
    }

    return null;
  }

  render() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Segment fixed='top' textAlign='center' as='header' style={{ margin: 0 }}>
          <Header as='h1' image={<Image size='small' src='/images/favicon.ico' />} content='Mylife Home Deploy' />
        </Segment>

        <Sidebar.Pushable as={Segment} style={{ flex: 1, margin: 0 }}>
          <Sidebar animation='push' width='wide' visible>
            <Menu
              onRecipeListClick = {this.onRecipeListClick}
              onRecipeClick     = {this.onRecipeClick    }
              onRunListClick    = {this.onRunListClick   }
              onRunClick        = {this.onRunClick       }
              onFileListClick   = {this.onFileListClick  }
            />
          </Sidebar>
          <Sidebar.Pusher>
            {this.renderContent()}
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </div>
    );
  }
}

export default Application;
