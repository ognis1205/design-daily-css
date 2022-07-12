import * as Redux from 'redux';
import * as Position from 'src/redux/modules/position';
import reducer from 'src/redux/modules/reducer';

const store = Redux.createStore(reducer);

export type Type = {
  position: Position.State;
};

export default store;
