'use strict';

import React               from 'react';
import PropTypes           from 'prop-types';
import { Segment, Header } from 'semantic-ui-react';

const styles = {
  root : {
    display       : 'flex',
    flexDirection : 'column',
    minHeight     : '100vh'
  },
  container : {
    position  : 'fixed',
    top       : 0,
    bottom    : 0,
    left      : 0,
    right     : 0,
    overflowY : 'auto'
  }
};

const FileList = ({ icon, title, children }) => (
  <div style={styles.root}>
    <div style={styles.container}>

      <Segment fixed='top' basic>
        <Header as='h2' icon={icon} content={title} />
      </Segment>

      <Segment basic>
        {children}
      </Segment>

    </div>
  </div>
);

FileList.propTypes = {
  icon     : PropTypes.string.isRequired,
  title    : PropTypes.string.isRequired,
  children : PropTypes.element.isRequired
};

export default FileList;
