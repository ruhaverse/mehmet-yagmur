import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import GroupsScreen from '../screens/GroupsScreen.js';

const Stack = createNativeStackNavigator();

export default function GroupNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Groups" component={GroupsScreen} />
    </Stack.Navigator>
  );
}