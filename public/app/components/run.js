'use strict';

import React     from 'react';
import PropTypes from 'prop-types';

const Run = ({ run }) => (
  <div>
    run
    {JSON.stringify(run)}
  </div>
);

Run.propTypes = {
  run : PropTypes.object.isRequired,
};

export default Run;
