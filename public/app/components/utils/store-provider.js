'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import store from '../../services/store-factory';
import { Provider } from 'react-redux';

const StoreProvider = (props) => (
  <Provider store={store}>
    { props.children }
  </Provider>
);

StoreProvider.propTypes = {
  children: PropTypes.node
};

export default StoreProvider;
