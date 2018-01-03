'use strict';

import { connect } from 'react-redux';

import FileList     from '../components/file-list';
import { getFiles } from '../selectors/files';

const mapStateToProps = state => ({
  files : getFiles(state)
});

const mapDispatchToProps = dispatch => ({
});

const FileListContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(FileList);

export default FileListContainer;