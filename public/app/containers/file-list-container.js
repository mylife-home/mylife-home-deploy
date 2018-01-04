'use strict';

import { connect } from 'react-redux';

import FileList                     from '../components/file-list';
import { getFiles }                 from '../selectors/files';
import { downloadFile, deleteFile } from '../actions/files';

const mapStateToProps = state => ({
  files : getFiles(state)
});

const mapDispatchToProps = dispatch => ({
  onFileDownload : file => dispatch(downloadFile({ name : file })),
  onFileDelete   : file => dispatch(deleteFile({ name : file }))
});

const FileListContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(FileList);

export default FileListContainer;