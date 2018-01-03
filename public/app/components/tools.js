'use strict';

export const runStatusIconName = run => {
  switch(run.status) {
    case 'created':
    case 'running':
      return 'play'; // runnning

    case 'ended':
      return run.err
        ? 'remove' // error
        : 'checkmark'; // success
  }
};