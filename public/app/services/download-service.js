'use strict';

import { actionTypes } from '../constants';
import { getRun }      from '../selectors/runs';

const createLogsContent = logs => logs
  .map(log => `${new Date(log.date).toLocaleString()} - ${log.severity.toUpperCase()} - ${log.category} : ${log.message}`)
  .join('\n');

const download = (name, link) => {
  const pom = document.createElement('a');
  pom.setAttribute('href', link);
  pom.setAttribute('download', name);
  pom.click();
  pom.remove();
};

export default store => next => action => {
  next(action);

  switch(action.type) {
    case actionTypes.FILE_DOWNLOAD: {
      const { name } = action.payload;
      download(name, `/files/${name}`);
      break;
    }

    case actionTypes.RUN_DOWNLOAD_LOGS: {
      const { id }   = action.payload;
      const run = getRun(store.getState(), id);
      const content  = createLogsContent(run.logs);
      download(`run${run.id}-${run.recipe}-logs.txt`, `data:text/plain;charset=utf-8,${encodeURIComponent(content)}`);
      break;
    }
  }
};

