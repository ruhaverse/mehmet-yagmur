import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Activity Related Screens
import ActivityScreen from '../screens/ActivityScreen';
import NotificationScreen from '../../screens/NotificationScreen';

const Stack = createStackNavigator();

export default function ActivityNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen 
        name="ActivityMain" 
        component={ActivityScreen}
      />
      <Stack.Screen 
        name="Notifications" 
        component={NotificationScreen}
      />
    </Stack.Navigator>
  );
}