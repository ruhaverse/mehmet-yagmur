import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import NewsFeedScreen from '../screens/NewsFeedScreen';
import AddPostScreen from '../screens/AddPostScreen';

const Stack = createStackNavigator();

export default function NewsFeedNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="NewsFeed" component={NewsFeedScreen} />
      <Stack.Screen name="AddPost" component={AddPostScreen} />
    </Stack.Navigator>
  );
}