import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { StyleSheet } from 'react-native';
import { settingsContext } from '../../models';
import { Layout, Toggle } from '@ui-kitten/components';

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
