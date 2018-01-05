'use strict';

import { connect } from 'react-redux';

import Run                 from '../components/run';
import { getRun }          from '../selectors/runs';
import { downloadRunLogs } from '../actions/runs';

const mapStateToProps = (state, { run }) => ({
  run : getRun(state, run)
});

const mapDispatchToProps = dispatch => ({
  onRunDownloadLogs    : run => dispatch(downloadRunLogs({ id : run })),
});

const RunContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Run);

export default RunContainer;