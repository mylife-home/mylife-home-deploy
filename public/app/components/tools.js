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

// https://stackoverflow.com/questions/10420352/converting-file-size-in-bytes-to-human-readable-string
export const formatSize = size => {
  const i = size && Math.floor(Math.log(size) / Math.log(1024));
  return (size / Math.pow(1024, i)).toFixed(2) * 1 + ' ' + [ 'B', 'kB', 'MB', 'GB', 'TB' ][i];
};

export const formatDate       = d => new Date(d).toLocaleString();
export const formatStackTrace = s => formatString(s.replace(/ {4}/g, '\t'));

export const makeFirstUpper = s => s.charAt(0).toUpperCase() + s.slice(1);