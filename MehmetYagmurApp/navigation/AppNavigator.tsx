import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ShareUpTimeColors } from '../theme/ShareUpTimeTheme';
import NewsFeedNavigator from './NewsFeedNavigator';
import GroupNavigator from './GroupNavigator';
import AuthNavigator from './AuthNavigator';

// Screens
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import NotificationScreen from '../screens/NotificationScreen';
import MediaScreen from '../screens/MediaScreen';
import ChatScreen from '../screens/ChatScreen';
import CameraScreen from '../screens/CameraScreen';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'NewsFeed') {
            iconName = 'feed';
          } else if (route.name === 'Groups') {
            iconName = 'group';
          } else if (route.name === 'Media') {
            iconName = 'photo-library';
          } else if (route.name === 'Chat') {
            iconName = 'chat';
          } else if (route.name === 'Camera') {
            iconName = 'camera-alt';
          } else if (route.name === 'Profile') {
            iconName = 'person';
          } else if (route.name === 'Notifications') {
            iconName = 'notifications';
          } else if (route.name === 'Settings') {
            iconName = 'settings';
          } else if (route.name === 'Auth') {
            iconName = 'login';
          }

          return <Icon name={iconName || 'home'} size={size} color={color} />;
        },
        tabBarActiveTintColor: ShareUpTimeColors.primary, // ShareUpTime brand color
        tabBarInactiveTintColor: 'gray',
        headerShown: true,
        headerStyle: {
          backgroundColor: '#f8f9fa',
        },
        headerTintColor: '#000000',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ 
          title: 'Ana Sayfa',
          headerTitle: 'Mehmet Yağmur'
        }}
      />
      <Tab.Screen 
        name="NewsFeed" 
        component={NewsFeedNavigator}
        options={{ title: 'Akış' }}
      />
      <Tab.Screen 
        name="Groups" 
        component={GroupNavigator}
        options={{ title: 'Gruplar' }}
      />
      <Tab.Screen 
        name="Media" 
        component={MediaScreen}
        options={{ title: 'Medya' }}
      />
      <Tab.Screen 
        name="Chat" 
        component={ChatScreen}
        options={{ title: 'Sohbet' }}
      />
      <Tab.Screen 
        name="Camera" 
        component={CameraScreen}
        options={{ title: 'Kamera' }}
      />
      <Tab.Screen 
        name="Notifications" 
        component={NotificationScreen}
        options={{ title: 'Bildirimler' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ title: 'Profil' }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{ title: 'Ayarlar' }}
      />
    </Tab.Navigator>
  );
}