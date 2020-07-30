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
import { userContext, settingsContext } from '../models';
import { LogIn, SignUp } from './stacks/';
import { ApplicationProvider } from '@ui-kitten/components';
import { Home, Settings } from './drawers';
import FlashMessage from 'react-native-flash-message';
import Splash from './Splash';
import * as eva from '@eva-design/eva';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const Screen: React.FC = () => {
  const userCtx = useContext(userContext);
  const settingsCtx = useContext(settingsContext);

  if (userCtx.loading && settingsCtx.loading) {
    return <Splash />;
  }

  return (
    <ApplicationProvider
      {...eva}
      theme={userCtx.loggedIn ? settingsCtx.theme : eva.light}
    >
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
                  <Drawer.Screen name="Home" component={Home} />
                  <Drawer.Screen name="Settings" component={Settings} />
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
        onPress={() => navigation.dispatch(DrawerActions.jumpTo('Home'))}
        label="Dashboard"
      />
      <DrawerItem
        onPress={() => navigation.dispatch(DrawerActions.jumpTo('Settings'))}
        label="Settings"
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
