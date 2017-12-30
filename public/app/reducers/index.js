import { combineReducers } from 'redux';

import online  from './online';
import errors  from './errors';
import info    from './info';
import recipes from './recipes';

export default combineReducers({
  online,
  errors,
  info,
  recipes
});
