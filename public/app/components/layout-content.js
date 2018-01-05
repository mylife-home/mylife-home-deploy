'use strict';

import React               from 'react';
import PropTypes           from 'prop-types';
import { Segment, Header } from 'semantic-ui-react';

const styles = {
  root : {
    display       : 'flex',
    flexDirection : 'column',
    position      : 'absolute',
    top           : 0,
    bottom        : 0,
    left          : 0,
    right         : 0
  },
  container : {
    height    : 0,
    flex      : 1,
    overflowY : 'auto'
  }
};

const FileList = ({ icon, title, children }) => (
  <div style={styles.root}>

    <Segment fixed='top' basic>
      <Header as='h2' icon={icon} content={title} />
    </Segment>

    <div style={styles.container}>
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
