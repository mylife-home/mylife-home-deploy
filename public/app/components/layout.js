'use strict';

import React                               from 'react';
import PropTypes                           from 'prop-types';
import { Sidebar, Segment, Header, Image } from 'semantic-ui-react';

import Menu       from '../containers/menu-container';
import RecipeList from '../containers/recipe-list-container';
import Recipe     from '../containers/recipe-container';
import RunList    from '../containers/run-list-container';
import Run        from '../containers/run-container';
import FileList   from '../containers/file-list-container';

class Layout extends React.Component {

  constructor(props) {
    super(props);
    this.state = { type: null, value: null };

    this.onRecipeListClick = ()     => this.setState({ type : 'recipe-list', value : null   });
    this.onRecipeClick     = recipe => this.setState({ type : 'recipe',      value : recipe });
    this.onRunListClick    = ()     => this.setState({ type : 'run-list',    value : null   });
    this.onRunClick        = run    => this.setState({ type : 'run',         value : run    });
    this.onFileListClick   = ()     => this.setState({ type : 'file-list',   value : null   });
  }

  componentWillReceiveProps(nextProps) {
    switch(this.state.type) {

      case 'recipe': {
        const nextRecipes = nextProps.recipes;
        if(this.props.recipes === nextRecipes) { return; }
        if(!nextRecipes.has(this.state.value)) { return; }
        this.setState({ type: null, value: null });
        return;
      }

      case 'run': {
        const nextRuns = nextProps.runs;
        if(this.props.runs === nextRuns) { return; }
        if(nextRuns.has(this.state.value)) { return; }
        this.setState({ type: null, value: null });
        return;
      }
    }
  }

  renderContent() {
    const { type, value } = this.state;
    switch(type) {

      case 'recipe-list':
        return (<RecipeList onRecipeClick={this.onRecipeClick}/>);

      case 'recipe':
        return (<Recipe recipe={value}/>);

      case 'run-list':
        return (<RunList onRunClick={this.onRunClick}/>);

      case 'run':
        return (<Run run={value}/>);


      case 'file-list':
        return (<FileList />);
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

Layout.propTypes = {
  recipes : PropTypes.object.isRequired,
  runs    : PropTypes.object.isRequired
};

export default Layout;
