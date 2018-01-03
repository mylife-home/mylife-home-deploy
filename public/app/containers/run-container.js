'use strict';

import { connect } from 'react-redux';

import Run        from '../components/run';
import { getRun } from '../selectors/runs';

const mapStateToProps = (state, { run }) => ({
  run : getRun(state, run)
});

const RunContainer = connect(
  mapStateToProps
)(Run);

export default RunContainer;