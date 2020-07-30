import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer, DrawerActions } from '@react-navigation/native';
import { Platform } from 'react-native';
import { userContext } from '../models';
import FlashMessage from 'react-native-flash-message';
import styled from 'styled-components/native';
import { LogIn, SignUp } from './stacks/';
import Splash from './Splash';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const Screen: React.FC = () => {
  const userCtx = useContext(userContext);

  if (userCtx.loading) {
    return <Splash />;
  }

  return (
    <StyledSafeView>
      <StyledKb behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <NavigationContainer>
          {userCtx.loggedIn ? (
            <>
              <Drawer.Navigator
                drawerContent={(props) => <DrawerContent {...props} />}
              >
                {/* <Drawer.Screen name="Tracker" component={Tracker} /> */}
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
      </StyledKb>
    </StyledSafeView>
  );
};

const DrawerContent = ({ navigation }: { navigation: any }) => {
  const userCtx = useContext(userContext);
  return (
    <DrawerContentScrollView>
      <DrawerItem
        onPress={() => navigation.dispatch(DrawerActions.jumpTo('Tracker'))}
        label="Tracker"
      />
      <DrawerItem onPress={() => userCtx.logOut()} label="Log Out" />
    </DrawerContentScrollView>
  );
};

const StyledKb = styled.KeyboardAvoidingView`
  flex: 1;
`;

const StyledSafeView = styled.SafeAreaView`
  flex: 1;
`;

export default observer(Screen);
