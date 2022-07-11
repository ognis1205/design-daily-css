import * as React from 'react';
import * as ReactRedux from 'react-redux';
import * as Position from 'src/redux/modules/position';
import * as DOM from 'src/utils/dom';

type Params = {
  wrapper: React.RefObject<HTMLElement>;
  onDragStart: (event: React.MouseEvent) => void;
  onDragEnd: (event: React.MouseEvent) => void;
  single: boolean;
};

const useDraggable = ({
  wrapper,
  onDragStart,
  onDragEnd,
  single,
}: Params): [
  ReturnType<typeof ReactRedux.useStore>,
  (event: React.MouseEvent, id: string) => void,
  (event: React.MouseEvent) => void,
  (event: React.MouseEvent) => void,
  () => void,
] => {
  const store = ReactRedux.useStore();

  const dispatch = ReactRedux.useDispatch();

  const dragging = React.useRef<string | null>(null);

  const stop = () => {
    if (dragging.current) dispatch(Position.stop(dragging.current));
    dragging.current = null;
  };

 const onMouseMove = React.useCallback(
    (event: React.MouseEvent) => {
      if (
        wrapper.current &&
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        !DOM.isInside(wrapper.current!, {
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
    }, [wrapper, onDragEnd]);

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
    store,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    clear,
  ];
};

export default useDraggable;
