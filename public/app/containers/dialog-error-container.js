'use strict';

import { connect }    from 'react-redux';
import { getError }   from '../selectors/dialogs';
import { clearError } from '../actions/dialogs';

import DialogError from '../components/dialog-error';

const mapStateToProps = () => {
  return (state) => ({
    error : getError(state)
  });
};

const mapDispatchToProps = (dispatch) => ({
  onClose : () => dispatch(clearError()),
});

const DialogErrorContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(DialogError);

export default DialogErrorContainer;
