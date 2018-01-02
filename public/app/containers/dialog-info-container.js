'use strict';

import { connect }   from 'react-redux';
import { getInfo }   from '../selectors/dialogs';
import { clearInfo } from '../actions/dialogs';

import DialogInfo from '../components/dialog-info';

const mapStateToProps = () => {
  return (state) => ({
    info : getInfo(state)
  });
};

const mapDispatchToProps = (dispatch) => ({
  onClose : () => dispatch(clearInfo()),
});

const DialogInfoContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(DialogInfo);

export default DialogInfoContainer;
