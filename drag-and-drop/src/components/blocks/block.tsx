import * as React from 'react';
import styled from 'styled-components';
import * as Layouts from 'src/components/layouts';

const Block = styled(Layouts.Flex)`
  position: relative;
  border-radius: 4px;
  margin-right: 8px;
`;

const Text = styled.p`
  color: white;
  font-weight: 600;
  font-size: 24px;
`;

type Props = {
  name: string;
  style: React.CSSProperties;
  onMouseDown: (event: React.MouseEvent) => void;
};

export const Component: React.FC<Props> = ({ name, ...rest }: Props): React.ReactElement => (
  <Block
    {...rest}
    className="block"
    alignItems="center"
    justifyContent="center"
  >
    <Text className="ellipsis">{name}</Text>
  </Block>
);
