import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { Layout, Text, TopNavigation } from '@ui-kitten/components';
import { userContext } from '../../models';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { Entypo } from '@expo/vector-icons';

const Dashboard: React.FC = () => {
  const userCtx = useContext(userContext);
  const nav = useNavigation();
  const openDrawer = () => nav.dispatch(DrawerActions.openDrawer());

  return (
    <Layout style={styles.container}>
      <TopNavigation
        alignment="center"
        accessoryLeft={() => (
          <Entypo name="menu" size={24} onPress={openDrawer} color="skyblue" />
        )}
        title={() => <Text category="h4">Dashboard</Text>}
      />
      <Layout style={styles.content}>
        <Text category="h1" style={styles.username}>
          Hello {`${userCtx.user.firstName} ${userCtx.user.lastName}`}
        </Text>
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
    flex: 1,
    justifyContent: 'center',
  },
  username: {
    textAlign: 'center',
  },
});

export default Dashboard;
