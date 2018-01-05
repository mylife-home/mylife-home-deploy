import React                               from 'react';
import PropTypes                           from 'prop-types';
import { Modal, Input, Header, Button }    from 'semantic-ui-react';
import { confirmable, createConfirmation } from 'react-confirm';

class RecipeUpdateDialog extends React.Component {
  constructor(props) {
    super(props);

    const { recipe } = props.options;

    this.state = {
      name        : recipe.name,
      description : recipe.description,
      steps       : [] // TODO
    };
  }

  render() {
    const { show, proceed, /*dismiss,*/ cancel, /*confirmation,*/ } = this.props;
    const { name, description, steps } = this.state;
    return (
      <Modal open={show} onClose={() => cancel()}>
        <Header icon='write' content={`Update recipe '${name}'`} />
        <Modal.Content>
          <Input onChange={e => this.setState({ description : e.target.value })} value={description} />
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => cancel()}>Cancel</Button>
          <Button onClick={() => proceed({ name, description, steps })} primary>OK</Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

RecipeUpdateDialog.propTypes = {
  show         : PropTypes.bool,    // from confirmable. indicates if the dialog is shown or not.
  proceed      : PropTypes.func,    // from confirmable. call to close the dialog with promise resolved.
  cancel       : PropTypes.func,    // from confirmable. call to close the dialog with promise rejected.
  dismiss      : PropTypes.func,    // from confirmable. call to only close the dialog.
  confirmation : PropTypes.string,  // arguments of your confirm function
  options      : PropTypes.object   // arguments of your confirm function
};

const update = createConfirmation(confirmable(RecipeUpdateDialog));

export default options => {
  update({ options }).then(
    value => (options.proceed && options.proceed(value)),
    ()    => (options.cancel && options.cancel()));
};
