'use strict';

import { connect } from 'react-redux';
import { clearError } from '../actions/dialogs';

import DialogError from '../components/dialog-error';

const mapStateToProps = () => {
  return (state) => ({
    error : state.errors
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
