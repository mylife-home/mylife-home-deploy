'use strict';

export const getTasks = state => state.tasks
  .valueSeq()
  .sortBy(task => task.name);
