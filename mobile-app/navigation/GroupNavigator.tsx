import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import GroupsScreen from '../screens/GroupsScreen';
import SwapScreen from '../screens/SwapScreen';

const Stack = createNativeStackNavigator();

export default function GroupNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#f8f9fa',
        },
        headerTintColor: '#000000',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="Groups" 
        component={GroupsScreen}
        options={{ title: 'Gruplar' }}
      />
      <Stack.Screen 
        name="Swap" 
        component={SwapScreen}
        options={{ title: 'Takas' }}
      />
    </Stack.Navigator>
  );
}