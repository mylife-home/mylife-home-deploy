import React                               from 'react';
import PropTypes                           from 'prop-types';
import { Modal, Input, Header, Button }    from 'semantic-ui-react';
import { confirmable, createConfirmation } from 'react-confirm';

class InputDialog extends React.Component {
  constructor(props) {
    super(props);

    this.state = { value : '' };
  }

  render() {
    const { show, proceed, /*dismiss,*/ cancel, /*confirmation,*/ options } = this.props;
    const { value } = this.state;
    return (
      <Modal open={show}>
        <Header icon='help circle' content={options.title} />
        <Modal.Content>
          <Input onChange={e => this.setState({ value : e.target.value })} value={value} />
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => cancel()}>Cancel</Button>
          <Button onClick={() => proceed(value)} disabled={value === ''} primary>OK</Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

InputDialog.propTypes = {
  show         : PropTypes.bool,    // from confirmable. indicates if the dialog is shown or not.
  proceed      : PropTypes.func,    // from confirmable. call to close the dialog with promise resolved.
  cancel       : PropTypes.func,    // from confirmable. call to close the dialog with promise rejected.
  dismiss      : PropTypes.func,    // from confirmable. call to only close the dialog.
  confirmation : PropTypes.string,  // arguments of your confirm function
  options      : PropTypes.object   // arguments of your confirm function
};

const show = createConfirmation(confirmable(InputDialog));

export default options => {
  show({ options }).then(
    value => (options.proceed && options.proceed(value)),
    ()    => (options.cancel && options.cancel()));
};
