'use strict';

export const getFiles = state => state.files
  .valueSeq()
  .sortBy(file => file.name);
