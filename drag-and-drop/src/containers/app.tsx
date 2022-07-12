import * as React from 'react';
import * as ReactRedux from 'react-redux';
import * as Blocks from 'src/containers/sliding/blocks';
import styled, { keyframes } from 'styled-components';
import store from 'src/redux/store';

const Container = styled.div`
  text-align: center;
  background-color: #282c34;
  height: 100%;
`;

export const Component: React.FC<Record<string, never>> = (): React.ReactElement =>
  (
    <ReactRedux.Provider store={store}>
      <Container>
        <Blocks.Component
          columns={3}
          multiWidth={false}
          numItems={22}
        />
      </Container>
    </ReactRedux.Provider>
  );
