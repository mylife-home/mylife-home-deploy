'use strict';

import React                                     from 'react';
import PropTypes                                 from 'prop-types';
import { Segment, Header, Table, Button, Popup } from 'semantic-ui-react';
import confirm                                   from './confirm-dialog';

const FileList = ({ files, onFileDelete }) => (
  <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

    <Segment fixed='top' basic>
      <Header as='h2' icon='folder outline' content='Files' />
    </Segment>

    <Segment basic>
      <Table>

        <Table.Header>
          <Table.Row>
            <Table.HeaderCell width={1}>Name</Table.HeaderCell>
            <Table.HeaderCell width={1}>Size</Table.HeaderCell>
            <Table.HeaderCell width={1}></Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {files.map(file => (
            <Table.Row key={file.name}>
              <Table.Cell>{file.name}</Table.Cell>
              <Table.Cell>{file.size}</Table.Cell>
              <Table.Cell>
                <Button.Group basic style={{ marginLeft : '10px' }}>
                  <Popup content='Download file' trigger={
                    <Button basic icon='download' onClick={() => { throw new Error('TODO Download file'); } } />
                  } />
                  <Popup content='Delete file' trigger={
                    <Button basic icon='trash outline' onClick={() => confirm({ content : `Do you want to delete file '${file.name}' ?`, proceed : () => onFileDelete(file.name) })} />
                  } />
                </Button.Group>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Segment>

  </div>
);

FileList.propTypes = {
  files        : PropTypes.object.isRequired,
  onFileDelete : PropTypes.func.isRequired,
};

export default FileList;
