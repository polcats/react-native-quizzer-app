import React, { useContext } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Layout, Text } from '@ui-kitten/components';
import { userContext } from '../../models';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { Entypo } from '@expo/vector-icons';

const Dashboard: React.FC = () => {
  const userCtx = useContext(userContext);
  const nav = useNavigation();
  const openDrawer = () => nav.dispatch(DrawerActions.openDrawer());

  React.useLayoutEffect(() => {
    nav.setOptions({
      headerTitleAlign: 'center',
      headerLeft: () => (
        <TouchableOpacity onPress={openDrawer}>
          <Entypo style={styles.icon} name="menu" size={24} />
        </TouchableOpacity>
      ),
    });
  }, [nav]);

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
  icon: {
    marginLeft: 20,
  },
});

export default Dashboard;
