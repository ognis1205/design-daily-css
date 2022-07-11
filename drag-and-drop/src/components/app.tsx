import * as React from 'react';
import * as ReactRedux from 'react-redux';
import styled, { keyframes } from 'styled-components';
import store from 'src/redux/store';
import logo from 'src/assets/images/logo.svg';

const Container = styled.div`
  text-align: center;
`;

const Header = styled.header`
  background-color: #282c34;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: white;
`;

type LogoProps = {
  src: any;
  alt: string;
  width?: string;
  height?: string;
};

const LogoSpin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const Logo = styled.img.attrs<LogoProps>((props) => ({
  src: props.src,
  alt: props.alt,
}))<LogoProps>`
  height: ${(props) => props.height || "40vmin"};
  pointerEvents: none;
  animation: ${LogoSpin} infinite 20s linear;
`;

export const Component: React.FC<Record<string, never>> = (): React.ReactElement =>
  (
    <ReactRedux.Provider store={store}>
      <Container>
        <Header>
          <Logo src={logo} alt="logo" />
        </Header>
      </Container>
    </ReactRedux.Provider>
  );
