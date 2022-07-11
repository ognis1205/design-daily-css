import * as Redux from 'redux';
import position from 'src/redux/modules/position';

const reducer = Redux.combineReducers({
  position: position,
});

export default reducer;
