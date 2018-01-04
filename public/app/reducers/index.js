import { combineReducers } from 'redux';

import online  from './online';
import errors  from './errors';
import info    from './info';
import tasks   from './tasks';
import recipes from './recipes';
import runs    from './runs';
import files   from './files';

export default combineReducers({
  online,
  errors,
  info,
  tasks,
  recipes,
  runs,
  files
});
