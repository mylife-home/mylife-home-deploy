'use strict';

export const getRuns = state => state.runs
  .valueSeq()
  .sortBy(run => run.id);
