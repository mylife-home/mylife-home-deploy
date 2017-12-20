'use strict';

import React from 'react';
import { Button, Container, Header } from 'semantic-ui-react';

const Application = () => (
  <Container>
    <Header as='h1'>Hello world!</Header>

    <Button
      content='Discover docs'
      href='https://react.semantic-ui.com'
      icon='github'
      labelPosition='left'
    />
  </Container>
);

export default Application;
