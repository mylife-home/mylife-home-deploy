'use strict';

import React     from 'react';
import PropTypes from 'prop-types';

const RunList = ({ runs, onRunClick }) => (
  <div>
    run-list
    {JSON.stringify(runs)}
  </div>
);

RunList.propTypes = {
  runs       : PropTypes.object.isRequired,
  onRunClick : PropTypes.func.isRequired,
};

export default RunList;
