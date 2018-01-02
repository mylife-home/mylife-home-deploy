'use strict';

import React                     from 'react';
import PropTypes                 from 'prop-types';
import { Header, Modal } from 'semantic-ui-react';

const DialogOffline = ({ online }) => (
  <Modal open={!online} closeOnEscape={false} closeOnRootNodeClick={false} size='mini'>
    <Header icon='lightning' content='Offline' />
    <Modal.Content>
      <h3>You are not connected</h3>
    </Modal.Content>
  </Modal>
);

DialogOffline.propTypes = {
  online : PropTypes.bool.isRequired
};

export default DialogOffline;
