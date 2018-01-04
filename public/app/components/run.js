'use strict';

import React                               from 'react';
import PropTypes                           from 'prop-types';
import { Item, Table }                     from 'semantic-ui-react';
import { runStatusIconName, formatString } from './tools';
import LayoutContent                       from './layout-content';

const Run = ({ run }) => (
  <LayoutContent icon={runStatusIconName(run)} title={`Run #${run.id} - ${run.recipe}`}>
    <Item.Group divided>

      <Item key={run.id}>
        <Item.Content>
          <Item.Header>
            Status : {run.status}
          </Item.Header>
        </Item.Content>
      </Item>

      { run.err && (
        <Item>
          <Item.Content>
            <Item.Header>
              Error : {run.err.message.replace(/\n/g, '')}
            </Item.Header>
            <Item.Description>
              {formatString(run.err.stack.replace(/ {4}/g, '\t'))}
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
                  <Table.HeaderCell width={1}>Category</Table.HeaderCell>
                  <Table.HeaderCell width={1}>Severity</Table.HeaderCell>
                  <Table.HeaderCell width={5}>Message</Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {run.logs.map((log, index) => (
                  <Table.Row key={index} error={log.category === 'error'} warning={log.category==='warning'}>
                    <Table.Cell>{log.category}</Table.Cell>
                    <Table.Cell>{log.severity}</Table.Cell>
                    <Table.Cell>{log.message}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </Item.Description>
        </Item.Content>
      </Item>

    </Item.Group>
  </LayoutContent>
);

Run.propTypes = {
  run : PropTypes.object.isRequired,
};

export default Run;
