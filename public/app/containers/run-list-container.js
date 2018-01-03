'use strict';

import { connect } from 'react-redux';

import RunList     from '../components/run-list';
import { getRuns } from '../selectors/runs';

const mapStateToProps = state => ({
  runs : getRuns(state)
});

const RunListContainer = connect(
  mapStateToProps
)(RunList);

export default RunListContainer;