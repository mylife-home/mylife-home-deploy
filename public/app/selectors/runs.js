'use strict';

export const getRuns = state => state.runs
  .valueSeq()
  .sortBy(run => run.id);

export const getRunIds = state => state.runs.keySeq().toSet();

export const getRun = (state, value) => state.runs.get(value);