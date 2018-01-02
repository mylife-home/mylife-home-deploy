'use strict';

import { connect }   from 'react-redux';
import { getOnline } from '../selectors/dialogs';

import DialogOffline from '../components/dialog-offline';

const mapStateToProps = () => {
  return (state) => ({
    online : getOnline(state)
  });
};


const DialogOfflineContainer = connect(
  mapStateToProps,
)(DialogOffline);

export default DialogOfflineContainer;
