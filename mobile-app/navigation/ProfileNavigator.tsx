import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Profile Related Screens
import ProfileScreen from '../screens/ProfileScreen';
import AccountScreen from '../screens/AccountScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import ActivityScreen from '../screens/ActivityScreen';
import AllFriendsScreen from '../screens/AllFriendsScreen';
import AddNewFriendScreen from '../screens/AddNewFriendScreen';

const Stack = createStackNavigator();

export default function ProfileNavigator() {
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
        name="ProfileMain" 
        component={ProfileScreen}
        options={{ 
          title: 'Profil',
          headerShown: false
        }}
      />
      <Stack.Screen 
        name="Account" 
        component={AccountScreen}
        options={{ 
          title: 'Hesap',
          headerShown: false
        }}
      />
      <Stack.Screen 
        name="EditProfile" 
        component={EditProfileScreen}
        options={{ 
          title: 'Profili Düzenle',
          headerShown: false
        }}
      />
      <Stack.Screen 
        name="Activity" 
        component={ActivityScreen}
        options={{ 
          title: 'Aktivite',
          headerShown: false
        }}
      />
      <Stack.Screen 
        name="AllFriends" 
        component={AllFriendsScreen}
        options={{ 
          title: 'Arkadaşlar',
          headerShown: false
        }}
      />
      <Stack.Screen 
        name="AddNewFriend" 
        component={AddNewFriendScreen}
        options={{ 
          title: 'Arkadaş Ekle',
          headerShown: false
        }}
      />
    </Stack.Navigator>
  );
}