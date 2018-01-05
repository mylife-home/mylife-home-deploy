'use strict';

import React                               from 'react';
import PropTypes                           from 'prop-types';
import { Item, Table, Popup, Button }      from 'semantic-ui-react';
import { runStatusIconName, formatString } from './tools';
import LayoutContent                       from './layout-content';

const formatDate  = d => new Date(d).toLocaleString();
const formatStack = s => formatString(s.replace(/ {4}/g, '\t'));

const Run = ({ run, onRunDownloadLogs }) => (
  <LayoutContent icon={runStatusIconName(run)} title={`Run #${run.id} - ${run.recipe}`}>
    <Item.Group divided>

      <Item key={run.id}>
        <Item.Content>
          <Item.Header>
            <Table basic='very' celled collapsing>
              <Table.Body>
                <Table.Row>
                  <Table.Cell>Status</Table.Cell>
                  <Table.Cell>{run.status}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Creation</Table.Cell>
                  <Table.Cell>{formatDate(run.creation)}</Table.Cell>
                </Table.Row>
                {run.end && (
                  <Table.Row>
                    <Table.Cell>End</Table.Cell>
                    <Table.Cell>{formatDate(run.end)}</Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table>

          </Item.Header>
        </Item.Content>
      </Item>

      {run.err && (
        <Item>
          <Item.Content>
            <Item.Header>
              Error : {run.err.message}
            </Item.Header>
            <Item.Description>
              {formatStack(run.err.stack)}
            </Item.Description>
          </Item.Content>
        </Item>
      )}

      <Item>
        <Item.Content>
          <Item.Header>
            Logs
          </Item.Header>
          <Item.Description>
            <Table>

              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell width={1}>Timestamp</Table.HeaderCell>
                  <Table.HeaderCell width={1}>Category</Table.HeaderCell>
                  <Table.HeaderCell width={1}>Severity</Table.HeaderCell>
                  <Table.HeaderCell width={5}>Message</Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {run.logs.map((log, index) => (
                  <Table.Row key={index} error={log.category === 'error'} warning={log.category==='warning'}>
                    <Table.Cell>{formatDate(log.date)}</Table.Cell>
                    <Table.Cell>{log.category}</Table.Cell>
                    <Table.Cell>{log.severity}</Table.Cell>
                    <Table.Cell>{log.message}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>

              <Table.Footer>
                <Table.Row>
                  <Table.HeaderCell colSpan='4'>
                    <Popup content='Download logs' trigger={
                      <Button basic icon='download' onClick={() => onRunDownloadLogs(run.id) } />
                    } />
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Footer>
            </Table>
          </Item.Description>
        </Item.Content>
      </Item>

    </Item.Group>
  </LayoutContent>
);

Run.propTypes = {
  run               : PropTypes.object.isRequired,
  onRunDownloadLogs : PropTypes.func.isRequired,
};

export default Run;
