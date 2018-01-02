'use strict';

import React from 'react';
import StoreProvider from './store-provider';
import Layout from './layout';
import DialogError from '../containers/dialog-error-container';
import DialogInfo from '../containers/dialog-info-container';

const styles = {
  root: {
    position : 'fixed',
    top      : 0,
    bottom   : 0,
    left     : 0,
    right    : 0
  }
};

const Application = () => (
  <StoreProvider>
    <div style={styles.root}>
      <Layout />
      <DialogError />
      <DialogInfo />
    </div>
  </StoreProvider>
);

export default Application;
