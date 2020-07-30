import React, { useState, useContext, createRef } from 'react';
import { observer } from 'mobx-react-lite';
import { TouchableWithoutFeedback, Keyboard, StyleSheet } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { useNavigation } from '@react-navigation/native';
import { settingsContext } from '../../models';
import { Layout, Input, Text, Button, Toggle } from '@ui-kitten/components';

const Settings: React.FC = () => {
  const settingsCtx = useContext(settingsContext);
  const onCheckedChange = (isChecked: boolean) => {
    settingsCtx.setIsDark(isChecked);
  };

  return (
    <Layout style={styles.container}>
      <Toggle checked={settingsCtx.isDark} onChange={onCheckedChange}>
        Dark Mode
      </Toggle>
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

export default observer(Settings);
