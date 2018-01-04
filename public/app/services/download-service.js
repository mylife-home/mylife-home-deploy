'use strict';

import { actionTypes } from '../constants';

export default (/*store*/) => next => action => {
  next(action);

  switch(action.type) {
    case actionTypes.FILE_DOWNLOAD: {
      const { name } = action.payload;
      const pom      = document.createElement('a');
      pom.setAttribute('href', `/files/${name}`);
      pom.setAttribute('download', name);
      pom.click();
      pom.remove();

      break;
    }
  }
};

