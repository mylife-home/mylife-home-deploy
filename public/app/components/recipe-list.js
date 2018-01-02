'use strict';

import React          from 'react';
import PropTypes      from 'prop-types';
import { Segment, Header, Icon } from 'semantic-ui-react';

const RecipeList = ({ recipes }) => (
  <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
    <Segment fixed='top' textAlign='center' as='header' style={{ margin: 0 }}>
      <Header as='h2' icon='file text outline' content='Recipes' />
    </Segment>
    <div>recipe-list</div>
  </div>
);

RecipeList.propTypes = {
  recipes        : PropTypes.object.isRequired,
  onRecipePin    : PropTypes.func.isRequired,
  onRecipeUnpin  : PropTypes.func.isRequired,
  onRecipeStart  : PropTypes.func.isRequired,
  onRecipeDelete : PropTypes.func.isRequired,
};

export default RecipeList;
