'use strict';

import React                     from 'react';
import PropTypes                 from 'prop-types';
import { Button, Header, Modal } from 'semantic-ui-react';

const DialogError = ({ error, onClose }) => (
  <Modal open={!!error} onClose={onClose}>
    <Header icon='browser' content='Error' />
    <Modal.Content>
      <h3>{error && error.toString()}</h3>
    </Modal.Content>
    <Modal.Actions>
      <Button onClick={onClose} primary>OK</Button>
    </Modal.Actions>
  </Modal>
);

DialogError.propTypes = {
  error   : PropTypes.object,
  onClose : PropTypes.func.isRequired
};

export default DialogError;