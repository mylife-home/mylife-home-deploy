import React                               from 'react';
import PropTypes                           from 'prop-types';
import { Confirm }                         from 'semantic-ui-react';
import { confirmable, createConfirmation } from 'react-confirm';

const ConfirmDialog = ({ show, proceed, /*dismiss,*/ cancel, /*confirmation,*/ options }) => (
  <Confirm
    open={show}
    header={options.title}
    content={options.content}
    onConfirm={() => proceed()}
    onCancel={() => cancel()} />
);

ConfirmDialog.propTypes = {
  show         : PropTypes.bool,    // from confirmable. indicates if the dialog is shown or not.
  proceed      : PropTypes.func,    // from confirmable. call to close the dialog with promise resolved.
  cancel       : PropTypes.func,    // from confirmable. call to close the dialog with promise rejected.
  dismiss      : PropTypes.func,    // from confirmable. call to only close the dialog.
  confirmation : PropTypes.string,  // arguments of your confirm function
  options      : PropTypes.object   // arguments of your confirm function
};

const confirm = createConfirmation(confirmable(ConfirmDialog));

export default options => {
  options.content = options.content || 'Are you sure ?';

  confirm({ options }).then(
    () => (options.proceed && options.proceed()),
    () => (options.cancel && options.cancel()));
};
