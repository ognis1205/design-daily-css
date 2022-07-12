import * as React from "react";
import * as ReactSpring from "react-spring";
import styled from "styled-components";
import * as Layouts from 'src/components/layouts';

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
  rowSize: number;
  multiWidth: boolean;
  totalBlocks: number;
};

export const Component = ({ rowSize, multiWidth, totalBlocks }: Props): React.ReactElement => {
  return null;
};
