'use strict';

import React                           from 'react';
import PropTypes                       from 'prop-types';
import { Segment, Header, Item, Icon } from 'semantic-ui-react';
import { runStatusIconName }           from './tools';

const RunList = ({ runs, onRunClick }) => (
  <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

    <Segment fixed='top' basic>
      <Header as='h2' icon='tasks' content='Runs' />
    </Segment>

    <Item.Group>
      {runs.map(run => (
        <Item key={run.id}>
          <Item.Image size='tiny'>
            <Icon name={runStatusIconName(run)} size='huge' />
          </Item.Image>
          <Item.Content>
            <Item.Header>
              <a onClick={() => onRunClick(run.id)}>{`#${run.id} - ${run.recipe}`}</a>
            </Item.Header>
            <Item.Description>
              Status : {run.status}
              {run.err && <br/>}
              {run.err && `Error : ${run.err.message}`}
            </Item.Description>
          </Item.Content>
        </Item>
      ))}
    </Item.Group>

  </div>
);

RunList.propTypes = {
  runs       : PropTypes.object.isRequired,
  onRunClick : PropTypes.func.isRequired,
};

export default RunList;
