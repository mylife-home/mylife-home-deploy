import React                                                          from 'react';
import PropTypes                                                      from 'prop-types';
import { Modal, Input, Header, Button, Popup, Item, Dropdown, Table } from 'semantic-ui-react';
import { confirmable, createConfirmation }                            from 'react-confirm';

function swap(arr, index1, index2) {
  const res   = arr.slice();
  res[index2] = arr[index1];
  res[index1] = arr[index2];
  return res;
}

class RecipeUpdateDialog extends React.Component {
  constructor(props) {
    super(props);

    const { recipe } = props.options;

    this.idgen = 0;
    this.state = {
      name        : recipe.name,
      description : recipe.description,
      steps       : recipe.steps.map(step => ({ id : this.createId(), ... step }))
    };
  }

  createId() {
    return ++this.idgen;
  }

  stepCreate() {
    this.setState({ steps : [ ... this.state.steps, {
      id   : this.createId(),
      type : 'task'
    }]});
  }

  stepRemove(index) {
    this.setState({ steps : [
      ... this.state.steps.slice(0, index),
      ... this.state.steps.slice(index + 1)
    ]});
  }

  stepSwap(index1, index2) {
    this.setState({ steps : swap(this.state.steps, index1, index2)});
  }

  stepChangeType(index, type) {
    const { id, type : oldType } = this.state.steps[index];
    if(type === oldType) { return; }
    const step = { id, type };

    this.setState({ steps : [
      ... this.state.steps.slice(0, index),
      step,
      ... this.state.steps.slice(index + 1)
    ]});
  }

  stepChangeParameter(index, name, value) {
    let { parameters } = this.state.steps[index];
    parameters = Object.assign({}, parameters);
    if(!value) {
      delete parameters[name];
    } else {
      parameters[name] = value;
    }
    this.stepChangeProp(index, { parameters });
  }

  stepChangeProp(index, props) {
    this.setState({ steps : [
      ... this.state.steps.slice(0, index),
      Object.assign({}, this.state.steps[index], props),
      ... this.state.steps.slice(index + 1)
    ]});
  }

  proceed() {
    const { proceed }           = this.props;
    const { name, description } = this.state;
    let { steps }               = this.state;

    // remove ids
    steps = steps.map(step => {
      const { id, ...data } = step;
      void id;
      return data;
    });

    proceed({ name, description, steps });
  }

  render() {
    const { show, cancel, options }    = this.props;
    const { name, description, steps } = this.state;
    const { recipeNames, tasks }       = options;

    return (
      <Modal open={show} onClose={() => cancel()} closeOnEscape={false} closeOnRootNodeClick={false} size='fullscreen'>
        <Header icon='write' content={`Update recipe '${name}'`} />
        <Modal.Content scrolling>
          <Item.Group divided>

            <Item>
              <Item.Content>
                <Item.Header>
                  Description
                </Item.Header>
                <Input
                  fluid
                  style={{ marginLeft : '1em' }}
                  onChange={e => this.setState({ description : e.target.value })}
                  value={description} />
              </Item.Content>
            </Item>

            <Item>
              <Item.Content>
                <Popup content='New step' trigger={
                  <Button basic icon='add circle' onClick={() => this.stepCreate()} />
                } />
              </Item.Content>
            </Item>

            {steps.map((step, index) => {
              const taskMeta = (step.type === 'task') && tasks.find(t => t.name === step.name);
              return (
                <Item key={step.id}>
                  <Item.Content>

                    <Table basic='very' celled>
                      <Table.Body>

                        <Table.Row>
                          <Table.Cell colSpan='3'>
                            <Button.Group basic>
                              <Popup content='Delete step' trigger={
                                <Button basic icon='trash outline' onClick={() => this.stepRemove(index)} />
                              } />
                              <Popup content='Move up' trigger={
                                <Button disabled={index === 0} basic icon='arrow circle outline up' onClick={() => this.stepSwap(index, index-1)} />
                              } />
                              <Popup content='Move down' trigger={
                                <Button disabled={index === steps.length - 1} basic icon='arrow circle outline down' onClick={() => this.stepSwap(index, index+1)} />
                              } />
                            </Button.Group>
                          </Table.Cell>
                        </Table.Row>

                        <Table.Row>
                          <Table.Cell width={1}>
                            <Dropdown fluid selection onChange={(e, { value }) => this.stepChangeType(index, value)} value={step.type} options={[
                              { key : 'recipe', text : 'Recipe', value : 'recipe', icon : 'file text outline' },
                              { key : 'task',   text : 'Task',   value : 'task',   icon : 'settings' }
                            ]} />
                          </Table.Cell>
                          <Table.Cell width={1}>
                            {step.type === 'recipe' && (
                              <div>
                                <Input
                                  fluid
                                  list='recipes'
                                  onChange={e => this.stepChangeProp(index, { name : e.target.value })}
                                  value={step.name || ''} />
                                <datalist id='recipes'>
                                  {recipeNames.map(name => (<option key={name} value={name} />))}
                                </datalist>
                              </div>
                            )}
                            {step.type === 'task' && (
                              <Dropdown
                                fluid
                                selection
                                onChange = {(e, { value }) => this.stepChangeProp(index, { name : value, parameters : {}})}
                                value    = {step.name}
                                options  = {Array.from(tasks.map(task => ({ key : task.name, text : task.name, value : task.name })))} />
                            )}
                          </Table.Cell>
                          <Table.Cell width={2}>
                            {taskMeta && taskMeta.description}
                          </Table.Cell>
                        </Table.Row>

                        {taskMeta && taskMeta.parameters && taskMeta.parameters.map(paramMeta => (
                          <Table.Row key={paramMeta.name}>
                            <Table.Cell width={1}>
                              {paramMeta.name}
                            </Table.Cell>
                            <Table.Cell width={1}>
                              <Input
                                fluid
                                onChange={e => this.stepChangeParameter(index, paramMeta.name, e.target.value)}
                                value={step.parameters[paramMeta.name] || ''} />
                            </Table.Cell>
                            <Table.Cell width={2}>
                              {paramMeta.description}
                            </Table.Cell>
                          </Table.Row>
                        ))}
                      </Table.Body>
                    </Table>

                  </Item.Content>
                </Item>
              );
            })}

          </Item.Group>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => cancel()}>Cancel</Button>
          <Button onClick={() => this.proceed()} primary>OK</Button>
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
