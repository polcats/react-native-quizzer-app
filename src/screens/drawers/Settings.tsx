import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { StyleSheet } from 'react-native';
import { settingsContext } from '../../models';
import { Layout, Toggle, Text, TopNavigation } from '@ui-kitten/components';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { Entypo } from '@expo/vector-icons';

const Settings: React.FC = () => {
  const settingsCtx = useContext(settingsContext);
  const onCheckedChange = (isChecked: boolean) => {
    settingsCtx.setIsDark(isChecked);
  };
  const nav = useNavigation();
  const openDrawer = () => nav.dispatch(DrawerActions.openDrawer());

  return (
    <Layout style={styles.container}>
      <TopNavigation
        alignment="center"
        accessoryLeft={() => (
          <Entypo
            name="menu"
            size={24}
            onPress={openDrawer}
            color={settingsCtx.isDark ? '#fff' : '#000'}
          />
        )}
        title={() => <Text category="h4">Settings</Text>}
      />
      <Layout style={styles.content}>
        <Toggle checked={settingsCtx.isDark} onChange={onCheckedChange}>
          Dark Mode
        </Toggle>
      </Layout>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    flex: 1,
    padding: 20,
  },
  content: {
    justifyContent: 'center',
    flex: 1,
  },
});

export default observer(Settings);
