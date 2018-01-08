'use strict';

import React                      from 'react';
import PropTypes                  from 'prop-types';
import { Table, Button, Popup }   from 'semantic-ui-react';
import LayoutContent              from './layout-content';
import confirm                    from './confirm-dialog';
import { formatDate, formatSize } from './tools';

const FileList = ({ files, onFileUpload, onFileDownload, onFileDelete }) => (
  <LayoutContent icon='folder outline' title='Files'>
    <Table celled>

      <Table.Header>
        <Table.Row>
          <Table.HeaderCell width={4}>Name</Table.HeaderCell>
          <Table.HeaderCell width={2}>Size</Table.HeaderCell>
          <Table.HeaderCell width={2}>Modified Time</Table.HeaderCell>
          <Table.HeaderCell width={1}></Table.HeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {files.map(file => (
          <Table.Row key={file.name}>
            <Table.Cell>{file.name}</Table.Cell>
            <Table.Cell>{formatSize(file.size)}</Table.Cell>
            <Table.Cell>{formatDate(file.mtime)}</Table.Cell>
            <Table.Cell>
              <Button.Group basic>
                <Popup content='Download file' trigger={
                  <Button basic icon='download' onClick={() => onFileDownload(file.name) } />
                } />
                <Popup content='Delete file' trigger={
                  <Button basic icon='trash outline' onClick={() => confirm({ content : `Do you want to delete file '${file.name}' ?`, proceed : () => onFileDelete(file.name) })} />
                } />
              </Button.Group>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>

      <Table.Footer>
        <Table.Row>
          <Table.HeaderCell colSpan='4'>
            <Popup content='Upload file' trigger={
              <Button basic icon='upload' onClick={() => onFileUpload() } />
            } />
          </Table.HeaderCell>
        </Table.Row>
      </Table.Footer>

    </Table>
  </LayoutContent>
);

FileList.propTypes = {
  files          : PropTypes.object.isRequired,
  onFileUpload   : PropTypes.func.isRequired,
  onFileDownload : PropTypes.func.isRequired,
  onFileDelete   : PropTypes.func.isRequired,
};

export default FileList;
