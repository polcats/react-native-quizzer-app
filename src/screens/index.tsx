import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';
import {
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
  Alert,
} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer, DrawerActions } from '@react-navigation/native';
import { Platform } from 'react-native';
import { userContext } from '../models';
import { LogIn, SignUp } from './stacks/';
import FlashMessage from 'react-native-flash-message';
import styled from 'styled-components/native';
import Splash from './Splash';
import { ApplicationProvider, Input } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import { Dashboard } from './drawers';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const Screen: React.FC = () => {
  const userCtx = useContext(userContext);

  if (userCtx.loading) {
    return <Splash />;
  }

  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <NavigationContainer>
            {userCtx.loggedIn ? (
              <>
                <Drawer.Navigator
                  drawerContent={(props) => <DrawerContent {...props} />}
                >
                  <Drawer.Screen name="Tracker" component={Dashboard} />
                </Drawer.Navigator>
                <FlashMessage position="bottom" />
              </>
            ) : (
              <>
                <Stack.Navigator>
                  <Stack.Screen name="Log In" component={LogIn} />
                  <Stack.Screen name="Sign Up" component={SignUp} />
                </Stack.Navigator>
                <FlashMessage position="top" />
              </>
            )}
          </NavigationContainer>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ApplicationProvider>
  );
};

const DrawerContent = ({ navigation }: { navigation: any }) => {
  const userCtx = useContext(userContext);

  const confirmLogout = () => {
    Alert.alert(
      'Delete',
      `Are you sure you want to log out?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Ok',
          onPress: () => {
            userCtx.logOut();
          },
        },
      ],
      { cancelable: false },
    );
  };

  return (
    <DrawerContentScrollView>
      <DrawerItem
        onPress={() => navigation.dispatch(DrawerActions.jumpTo('Tracker'))}
        label="Tracker"
      />
      <DrawerItem onPress={confirmLogout} label="Log Out" />
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default observer(Screen);
