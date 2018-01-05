'use strict';

import React                      from 'react';
import PropTypes                  from 'prop-types';
import { Segment, Header, Image } from 'semantic-ui-react';

import Menu       from '../containers/menu-container';
import RecipeList from '../containers/recipe-list-container';
import Recipe     from '../containers/recipe-container';
import RunList    from '../containers/run-list-container';
import Run        from '../containers/run-container';
import FileList   from '../containers/file-list-container';

const styles = {
  root : {
    display       : 'flex',
    flexDirection : 'column',
    minHeight     : '100vh'
  },
  fixed : {
    position : 'fixed',
    top      : 0,
    bottom   : 0,
    left     : 0,
    right    : 0
  },
  menuContainer : {
    width    : 350,
    position : 'relative'
  },
  contentContainer : {
    flex     : 1,
    position : 'relative'
  }
};

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
      <div style={styles.root}>
        <Segment fixed='top' textAlign='center' as='header' style={{ margin: 0 }}>
          <Header as='h1' image={<Image size='small' src='/images/favicon.ico' />} content='Mylife Home Deploy' />
        </Segment>

        <div style={{ flex : 1, display : 'flex', flexDirection : 'row' }}>
          <div fixed='left' style={styles.menuContainer}>
            <Menu
              onRecipeListClick = {this.onRecipeListClick}
              onRecipeClick     = {this.onRecipeClick    }
              onRunListClick    = {this.onRunListClick   }
              onRunClick        = {this.onRunClick       }
              onFileListClick   = {this.onFileListClick  }
            />
          </div>
          <div style={styles.contentContainer}>
            {this.renderContent()}
          </div>
        </div>
      </div>
    );
  }
}

Layout.propTypes = {
  recipes : PropTypes.object.isRequired,
  runs    : PropTypes.object.isRequired
};

export default Layout;
