import * as FSA from 'typescript-fsa';
import actionCreatorFactory from 'typescript-fsa';

export type Coordinate = {
  x: number;
  y: number;
};

export type Noop = () => void;

export type PositionHandler = (coord: Coordinate) => void;

export type Handler = (param: {
  coord: Coordinate;
  start: PositionHandler;
  move: PositionHandler;
  stop: Noop;
  unselect: Noop;
  multiple: boolean;
  id: string;
}) => void;

const START = 'start';

const MOVE = 'move';

const STOP = 'stop';

const CLEAR = 'clear';

const ACTION_CREATER = actionCreatorFactory('position');

export const START_ACTION = ACTION_CREATER<{
  id: string;
  coord: Coordinate;
  single?: boolean
}>(START);

export const MOVE_ACTION = ACTION_CREATER<{
  id: string | string[];
  coord: Coordinate;
}>(MOVE);

export const STOP_ACTION = ACTION_CREATER<{
  id: string | string[];
}>(STOP);

export const CLEAR_ACTION = ACTION_CREATER<void>(CLEAR);

export const hasAction = (action: FSA.Action<unknown>): boolean =>
  START_ACTION.match(action) ||
  MOVE_ACTION.match(action) ||
  STOP_ACTION.match(action) ||
  CLEAR_ACTION.match(action);

export type State = {
  dragging: boolean;
  elements?: {
    translate: Coordinate;
    initial: Coordinate;
    last: Coordinate;
    id?: string;
  };
};

const INITIAL_STATE = {
  dragging: false,
} as State;

const getInitialElementState = () => ({
  translate: { x: 0, y: 0 },
  initial: { x: 0, y: 0 },
  last: { x: 0, y: 0 }
});

const reducer = (
  state: State = INITIAL_STATE,
  action: FSA.Action<unknown>
): State => {
  if (FSA.isType(action, START_ACTION)) {
    return {
      dragging: true,
      elements: {
        ...getInitialElementState(),
        initial: action.payload.coord,
      },
      ...(action.payload.single ? { id: action.payload.id } : {})
    };
  }

  if (FSA.isType(action, MOVE_ACTION)) {
    if (!state.elements) return state;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const elements = state.elements!;
    return {
      ...state,
      elements: {
        ...elements,
        translate: {
          x: elements.last.x + action.payload.coord.x - elements.initial.x,
          y: elements.last.y + action.payload.coord.y - elements.initial.y
        }
      }
    };
  }

  if (FSA.isType(action, STOP_ACTION)) {
    if (!state.elements) return state;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const elements = state.elements!;
    return {
      elements: { ...elements, last: elements.translate },
      dragging: false
    };
  }

  if (FSA.isType(action, CLEAR_ACTION)) {
    return INITIAL_STATE;
  }

  return state;
};

export default reducer;
