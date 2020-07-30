import React, { useContext } from 'react';
import styled from 'styled-components/native';
import { TouchableWithoutFeedback, Keyboard, StyleSheet } from 'react-native';
import { Layout, Input, Text, Button, Toggle } from '@ui-kitten/components';
import { userContext } from '../../models';

const Splash: React.FC = () => {
  const userCtx = useContext(userContext);
  return (
    <Layout style={styles.container}>
      <Text category="h1">
        Hello {`${userCtx.user.firstName} ${userCtx.user.lastName}`}
      </Text>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    flex: 1,
    padding: 20,
  },
});

export default Splash;
