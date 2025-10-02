import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import TestButton from '../pages/TestButton';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="TestButton" component={TestButton} />
      {/* Buraya ileride eklemek istediğin diğer ekranları ekleyebilirsin */}
    </Stack.Navigator>
  );
}