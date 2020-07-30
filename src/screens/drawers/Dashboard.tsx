import React from 'react';
import styled from 'styled-components/native';
import { TouchableWithoutFeedback, Keyboard, StyleSheet } from 'react-native';
import { Layout, Input, Text, Button, Toggle } from '@ui-kitten/components';

const Splash: React.FC = () => {
  return <Layout style={styles.container} />;
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    flex: 1,
    padding: 20,
  },
});

export default Splash;
