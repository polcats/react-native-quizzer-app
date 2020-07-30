import 'mobx-react-lite/batchingForReactDom';
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Dashboard } from '../stacks';

const Stack = createStackNavigator();

const Home: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Dashboard} />
    </Stack.Navigator>
  );
};

export default Home;
