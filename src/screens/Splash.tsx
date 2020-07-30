import React from 'react';
import styled from 'styled-components/native';

const Splash: React.FC = () => {
  return <Background />;
};

const Background = styled.View`
  background: skyblue;
  flex: 1;
  justify-content: center;
`;

export default Splash;
