'use strict';

import React from 'react';

export const formatString = value => {

  value = value.replace(/\t/g, '\u00A0\u00A0\u00A0\u00A0');

  const items    = value.split('\n');
  const content  = [];
  let keyCounter = 0;
  for(const [ index, item ] of items.entries()) {
    const last = index === items.length - 1;
    content.push(item);
    if(last) { continue; }
    content.push(<br key={++keyCounter} />);
  }
  return (<span>{content}<br/></span>);
};

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