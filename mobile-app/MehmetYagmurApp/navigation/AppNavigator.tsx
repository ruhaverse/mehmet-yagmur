import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SearchScreen from '../screens/SearchScreen';
import NotificationScreen from '../screens/NotificationScreen';
import SettingsScreen from '../screens/SettingsScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';

// Import new advanced components
import TabNavigation from './TabNavigation';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const colors = {
  primary: '#007AFF',
  white: '#FFFFFF',
  text: '#000000',
  background: '#F8F8F8',
};

// Main Tab Navigator
function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          
          switch (route.name) {
            case 'Home':
              iconName = focused ? '🏠' : '🏡';
              break;
            case 'Search':
              iconName = focused ? '🔍' : '🔎';
              break;
            case 'Notifications':
              iconName = focused ? '🔔' : '🔕';
              break;
            case 'Profile':
              iconName = focused ? '👤' : '👥';
              break;
            default:
              iconName = '📱';
          }
          
          return <span style={{ fontSize: size }}>{iconName}</span>;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: '#E0E0E0',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Notifications" component={NotificationScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// Main App Navigator
export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="MainTabs"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: colors.white },
        }}
      >
        {/* Main Tab Navigation */}
        <Stack.Screen name="MainTabs" component={MainTabNavigator} />
        
        {/* Profile Stack */}
        <Stack.Screen 
          name="EditProfile" 
          component={EditProfileScreen}
          options={{
            headerShown: true,
            title: 'Edit Profile',
            headerStyle: {
              backgroundColor: colors.primary,
            },
            headerTintColor: colors.white,
          }}
        />
        
        {/* Settings Stack */}
        <Stack.Screen 
          name="Settings" 
          component={SettingsScreen}
          options={{
            headerShown: true,
            title: 'Settings',
            headerStyle: {
              backgroundColor: colors.primary,
            },
            headerTintColor: colors.white,
          }}
        />
        
        {/* Change Password */}
        <Stack.Screen 
          name="ChangePassword" 
          component={ChangePasswordScreen}
          options={{
            headerShown: true,
            title: 'Change Password',
            headerStyle: {
              backgroundColor: colors.primary,
            },
            headerTintColor: colors.white,
          }}
        />
        
        {/* Media & Reels */}
        <Stack.Screen 
          name="ReelPlayer" 
          component={ReelPlayerScreen}
          options={{
            headerShown: false,
            presentation: 'fullScreenModal',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Export navigation types for TypeScript
export type RootStackParamList = {
  MainTabs: undefined;
  EditProfile: undefined;
  Settings: undefined;
  ChangePassword: undefined;
  ReelPlayer: {
    index: number;
    data: Array<{
      id: string;
      title: string;
      description: string;
      likes: number;
      comments: number;
      shares: number;
    }>;
  };
};

export type TabParamList = {
  Home: undefined;
  Search: undefined;
  Notifications: undefined;
  Profile: undefined;
};