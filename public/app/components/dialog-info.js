'use strict';

import React                     from 'react';
import PropTypes                 from 'prop-types';
import { Button, Header, Modal } from 'semantic-ui-react';

const DialogInfo = ({ info, onClose }) => (
  <Modal open={!!info} onClose={onClose}>
    <Header icon='browser' content='Error' />
    <Modal.Content>
      <h3>{info}</h3>
    </Modal.Content>
    <Modal.Actions>
      <Button onClick={onClose} primary>OK</Button>
    </Modal.Actions>
  </Modal>
);

DialogInfo.propTypes = {
  info    : PropTypes.object,
  onClose : PropTypes.func.isRequired
};

export default DialogInfo;