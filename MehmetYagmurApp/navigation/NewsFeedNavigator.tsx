import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import NewsFeedScreen from '../screens/NewsFeedScreen';

const Stack = createNativeStackNavigator();

export default function NewsFeedNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="NewsFeed" component={NewsFeedScreen} />
    </Stack.Navigator>
  );
}