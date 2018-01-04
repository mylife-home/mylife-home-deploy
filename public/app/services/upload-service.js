'use strict';

import superagent      from 'superagent';
import { actionTypes } from '../constants';
import { uploadFile } from '../actions/online';

export default (/*store*/) => next => action => {
  next(action);

  switch(action.type) {
    case actionTypes.FILE_UPLOAD: {

      const handler = e => {
        e.stopPropagation();
        const file = e.target.files[0];

        const formData = new FormData();
        formData.append('file', file);

        superagent.post('/files').send(formData).end(err => {
          if(err) { return next(uploadFile(err)); } // set the error
          // TODO: do something ?
        });
      };

      const pom = document.createElement('input');
      pom.setAttribute('type', 'file');
      pom.setAttribute('type', 'file');
      pom.style.display = 'none';
      pom.onchange = handler;
      pom.click();
      pom.remove();

      break;
    }
  }
};

