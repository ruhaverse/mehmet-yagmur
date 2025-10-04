import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import NewsFeedNavigator from './NewsFeedNavigator.js';
import GroupNavigator from './GroupNavigator.js';
import AuthNavigator from './AuthNavigator.js';

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