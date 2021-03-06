import * as React from 'react';
import * as ReactRedux from 'react-redux';
import * as Store from 'src/redux/store';
import * as Position from 'src/redux/modules/position';
import * as DOM from 'src/utils/dom';

type Params = {
  container: React.RefObject<HTMLElement>;
  onDragStart?: (event: React.MouseEvent) => void;
  onDragEnd?: (event: React.MouseEvent) => void;
  single?: boolean;
};

const useDraggable = ({
  container,
  onDragStart,
  onDragEnd,
  single = true,
}: Params): [
  Position.State,
//  Store.Type,
  (event: React.MouseEvent, id: string) => void,
  (event: React.MouseEvent) => void,
  (event: React.MouseEvent) => void,
  () => void,
] => {
//  const state = (ReactRedux.useStore()?.getState() as Store.Type)?.position as Position.State;
//  const store = ReactRedux.useStore()?.getState() as Store.Type;
  const state = ReactRedux.useSelector((state: Store.Type) => state.position);

  const dispatch = ReactRedux.useDispatch();

  const dragging = React.useRef<string | null>(null);

  const stop = () => {
    if (dragging.current) dispatch(Position.stop(dragging.current));
    dragging.current = null;
  };

 const onMouseMove = React.useCallback(
    (event: React.MouseEvent) => {
      if (
        container.current &&
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        !DOM.isInside(container.current!, {
          left: event.clientX,
          top: event.clientY
        })
      ) {
        if (onDragEnd) onDragEnd(event);
        stop();
        return;
      }
      if (dragging.current)
        dispatch(Position.move(
          [dragging.current],
          {
            x: event.clientX,
            y: event.clientY
          }
        ));
    }, [container, onDragEnd]);

  const onMouseUp = React.useCallback(
    (event: React.MouseEvent) => {
      if (onDragEnd) onDragEnd(event);
      if (dragging.current) dispatch(Position.stop(dragging.current));
    }, [onDragEnd]);

  const onMouseDown = React.useCallback(
    (event: React.MouseEvent, id: string) => {
      const coord = { x: event.clientX, y: event.clientY };
      event.stopPropagation();
      if (onDragStart) onDragStart(event);
      dragging.current = id;
      dispatch(Position.start(id, coord, true));
    }, [onDragStart]);

  const clear = () => {
    dispatch(Position.clear());
    dragging.current = null;
  };

  return [
    state,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    clear,
  ];
};

export default useDraggable;
