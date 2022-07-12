import * as React from "react";
import * as ReactSpring from "react-spring";
import * as Layouts from 'src/components/layouts';
import * as Block from 'src/containers/sliding/block';
import * as Utils from 'src/containers/sliding/utils';
import useDraggable from 'src/hooks/draggable';
import styled from "styled-components";

const getColor = (i: number) =>
  [
    '#F67280',
    '#C06C84',
    '#6C5B7B',
    '#355C7D',
  ][i % 4];

const Animated = styled(ReactSpring.animated.div)`
  position: absolute;
  border-radius: 4px;
  background: transparent;
`;

const Container = styled(Layouts.Flex)`
  flex-grow: 2;
  overflow: auto;
  flex-wrap: wrap;
  position: relative;
`;

type Item = {
  name: string;
  background: string;
  width: number;
  position: number;
};

type Props = {
  columns: number;
  numItems: number;
  multiWidth: boolean;
};

export const Component = ({ columns, multiWidth, numItems }: Props): React.ReactElement => {
  const getBlocks = React.useCallback(() => {
    const items: Item[] = new Array(numItems).fill(1).map((_, i) => ({
      width: Math.random() > 0.5 ? (multiWidth ? 2 : 1) : 1,
      position: -1,
      name: i + "",
      background: getColor(i)
    }));
    return Utils.withPositions(items, columns);
  }, [columns, multiWidth, numItems]);

  const blocks = React.useMemo(getBlocks, [getBlocks]);

  const order = React.useRef(
    blocks.map((block, i) => ({ index: i, width: block.width, position: block.position }))
  );

  const positionToIndex = React.useRef(
    Utils.getPositionToIndex(order.current, columns)
  );

  const container = React.useRef<HTMLDivElement>(null);

  const start = React.useRef({ x: 0, y: 0 });

  const dragging = React.useRef(-1);

 const [springs, setSprings] = ReactSpring.useSprings(
    blocks.length,
    Utils.animate(order.current, columns)
  );

  const onDragStart = (event: React.MouseEvent) => {
    start.current = {
      x: event.clientX,
      y: event.clientY
    };
  };

  const [state, onMouseDown, onMouseMove, onMouseUp, clear] = useDraggable({
    container,
    onDragStart,
    single: true
  });

  React.useEffect(() => {
    console.log('effect 1', state);
    if (!state?.elements?.id) return;
    console.log(!state?.elements.id);

    console.log('effect 2');
    const gap = {
      x: state.elements.translate.x,
      y: state.elements.translate.y
    };

    console.log('effect 3');
    const index = order.current.findIndex((a) => dragging.current === a.index);

    const element = order.current[index];

    const position = element.position;

    let y = Math.round(gap.y / 120);
    if (Math.abs(y) > 0.5) y = y * columns;

    const x = Math.round(gap.x / 120) * (gap.x > 0 ? 1 : 1);

    const z = y + x + position;

    const newPosition = Math.round(z);

    const movement = newPosition - position > 0 ? 'FORWARD' : 'BACKWARD';

    let reordered = [...order.current];

    const swap = (
      lhs: number,
      rhs: number,
      position: number,
      width?: number
    ) => {
      console.log('swap');
      if (rhs === -1 && width === 1) {
        let n = reordered.findIndex(
          (a) => a.position > position) + (movement === 'BACKWARD' ? 0 : -1);
        if (n < 0) n = order.current.length - 1;
        const props = {
          ...reordered[lhs],
          position: position
        };
        reordered.splice(lhs, 1);
        reordered.splice(n, 0, props);
        reordered = Utils.withPositions(reordered, columns);
      } else {
        reordered.splice(lhs, 1);
        reordered.splice(rhs, 0, { ...order.current[lhs] });
        reordered = Utils.withPositions(reordered, columns);
      }
    };

    console.log('effect 4');
    let newIndex = positionToIndex.current[newPosition];

    if (newPosition < 0) {
      newIndex = index;
    } else if (index !== newIndex) {
      const newElement = order.current[positionToIndex.current[newPosition]];
      if (newElement && newElement.width > 1)
        if (Math.abs(newPosition - position) < newElement.width) {
          // Do nothing.
        } else {
          swap(index, newIndex, newPosition, element.width);
        }
      else
        swap(index, newIndex, newPosition, element.width);
    }

    setSprings(
      Utils.animate(
        reordered,
        columns,
        order.current,
        gap.x,
        gap.y,
        dragging.current,
        state.dragging
      )
    );

    if (!state.dragging) {
      clear();
      order.current = reordered;
      positionToIndex.current = Utils.getPositionToIndex(order.current, columns);
    }
  }, [state, clear, setSprings, columns]);

  return (
    <Layouts.Flex style={{ height: 400 }} fullHeight flexDirection="column">
      <Container ref={container}>
        {springs.map((props, i) => {
          const id = blocks[i].name;
          return (
            <Animated key={blocks[i].name} style={props}>
              <Block.Component
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                onMouseDown={(e: React.MouseEvent) => {
                  dragging.current = i;
                  onMouseDown(e, id);
                }}
                style={{
                  width: 128 * blocks[i].width - 8,
                  height: 120,
                  background: blocks[i].background
                }}
                name={blocks[i].name}
              />
            </Animated>
          );
        })}
      </Container>
    </Layouts.Flex>
  );
};
