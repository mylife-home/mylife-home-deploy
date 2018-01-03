'use strict';

import React     from 'react';
import PropTypes from 'prop-types';

const FileList = ({ files }) => (
  <div>
    file-list
    {JSON.stringify(files)}
  </div>
);

FileList.propTypes = {
  files : PropTypes.object.isRequired,
};

export default FileList;
