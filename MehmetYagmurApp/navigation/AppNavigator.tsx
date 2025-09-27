import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import NewsFeedNavigator from './NewsFeedNavigator';
import GroupNavigator from './GroupNavigator';
import AuthNavigator from './AuthNavigator';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="NewsFeed" component={NewsFeedNavigator} />
      <Tab.Screen name="Groups" component={GroupNavigator} />
      <Tab.Screen name="Auth" component={AuthNavigator} />
    </Tab.Navigator>
  );
}